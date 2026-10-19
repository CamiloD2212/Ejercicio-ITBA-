# AGENTS.md

## Proyecto: DevBoard — Frontend Kanban con React

Este archivo define las reglas de trabajo para cualquier agente de IA, desarrollador o herramienta automatizada que modifique el repositorio. La etapa actual está enfocada en el **frontend** de la aplicación Kanban, integrándolo con el backend REST existente.

El agente debe leer este archivo antes de modificar código, inspeccionar el repositorio y respetar tanto el contrato del backend como las reglas de UI/UX, arquitectura, accesibilidad y pruebas descritas aquí.

---

# 1. Objetivo y prioridades

Construir una Single Page Application (SPA) para gestionar tableros Kanban, sus columnas y sus tickets, con una interfaz **Modern SaaS**: actual, clara, vibrante, accesible y orientada a productividad.

Prioridades, en este orden:

1. Cumplir el contrato real del backend y no inventar endpoints.
2. Mantener la integridad de las relaciones Board → Column → Ticket.
3. Separar presentación, estado, navegación e integración con la API.
4. Ofrecer estados de carga, error, vacío y éxito claros.
5. Mantener una experiencia responsive y accesible.
6. Aplicar de manera consistente el sistema visual Modern SaaS.
7. Probar los flujos principales y sus errores antes de dar una funcionalidad por terminada.
8. Evitar sobreingeniería, dependencias innecesarias y duplicación.

No reemplazar código funcional ni reestructurar grandes partes del proyecto sin inspeccionar antes su estado actual y justificar el cambio.

---

# 2. Fuente de verdad y límites

Las fuentes de verdad son:

1. El contrato y comportamiento verificado del backend existente.
2. Este archivo `AGENTS.md`, para las decisiones de frontend.
3. Las pruebas existentes y la estructura real del repositorio.

Si existe una contradicción entre la consigna del frontend y el contrato disponible del backend, **no inventar silenciosamente una solución**. Identificar la discrepancia, documentarla y proponer el cambio mínimo necesario.

## 2.1 Contrato conocido del backend

Los endpoints definidos en el backend son:

| Método | Endpoint | Acción | Éxito esperado |
|---|---|---|---|
| `POST` | `/api/boards` | Crear un tablero | `201 Created` |
| `GET` | `/api/boards/:boardId` | Obtener un tablero con sus columnas y datos relacionados | `200 OK` |
| `POST` | `/api/boards/:boardId/columns` | Crear una columna | `201 Created` |
| `DELETE` | `/api/boards/:boardId/columns/:columnId` | Eliminar una columna | `204 No Content` |
| `POST` | `/api/boards/:boardId/columns/:columnId/tickets` | Crear un ticket | `201 Created` |
| `PATCH` | `/api/boards/:boardId/columns/:columnId/tickets/:ticketId` | Actualizar o mover un ticket | `200 OK` |

El backend valida identificadores, existencia de recursos y relaciones padre-hijo. El frontend debe mostrar los errores de API de forma útil, sin intentar reemplazar las validaciones del servidor.

## 2.2 Inconsistencias y límites conocidos

La consigna de frontend propone las rutas `/login`, `/boards` y `/boards/:boardId`, pero el contrato de backend actualmente conocido **no incluye**:

- Un endpoint de autenticación o sesión.
- Un endpoint para listar todos los tableros (`GET /api/boards`).
- Un endpoint para eliminar tableros (`DELETE /api/boards/:boardId`).

Por lo tanto:

- No inventar esos endpoints ni asumir que existen.
- No implementar autenticación real sin un contrato backend definido.
- La ruta `/boards` no puede mostrar una lista real desde el backend actual sin una operación de listado.
- Si se necesitan datos simulados para desarrollar la UI, mantenerlos aislados en `mockData.js` o en una capa mock explícita, sin mezclarlos con el servicio real ni presentarlos como datos persistidos.
- No habilitar mocks silenciosamente en producción.
- Documentar estos límites en `docs/frontend-architecture.md` y en el README del frontend.
- Antes de implementar los flujos que dependen de esos contratos, informar la discrepancia y proponer cómo resolverla.

Puede implementarse la estructura visual de login como pantalla pública si la consigna lo requiere, pero no simular autenticación real ni proteger rutas con una sesión ficticia sin dejarlo explícito y aprobado.

---

# 3. Stack tecnológico

Utilizar, salvo que el repositorio ya tenga una decisión compatible y funcional:

- **React 18 o superior** para la interfaz.
- **Vite** para desarrollo y build.
- **React Router DOM v6 o superior** para navegación SPA.
- **Axios** para centralizar las llamadas HTTP.
- **React Hook Form** para el manejo de formularios.
- **Zod** para esquemas de validación, integrándolo con React Hook Form mediante el resolver correspondiente.
- CSS con **Custom Properties** para tokens visuales y temas.
- JavaScript con módulos ES, salvo que el proyecto ya esté configurado de manera consistente con TypeScript.

Antes de agregar una dependencia, verificar `package.json` y el lockfile. No reinstalar ni migrar herramientas sin necesidad.

No introducir Redux, otra librería de estado global, una biblioteca de componentes visuales o un framework CSS adicional sin una necesidad concreta y justificada. Utilizar estado local para estado efímero y hooks/contexto o una solución de caché de consultas solo cuando la complejidad real lo amerite.

---

# 4. Arquitectura y responsabilidades

Mantener una separación clara entre vistas, componentes visuales y acceso a datos. Adaptar la estructura a la existente en lugar de imponer una reestructuración completa.

Estructura de referencia:

```text
src/
├── api/
│   ├── httpClient.js
│   ├── boardService.js
│   ├── columnService.js
│   └── ticketService.js
├── assets/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Spinner.jsx
│   │   ├── Toast.jsx
│   │   └── EmptyState.jsx
│   └── layout/
│       ├── AppLayout.jsx
│       ├── Sidebar.jsx
│       └── Topbar.jsx
├── features/
│   ├── boards/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── schemas/
│   ├── columns/
│   │   ├── components/
│   │   └── hooks/
│   └── tickets/
│       ├── components/
│       ├── hooks/
│       └── schemas/
├── hooks/
├── pages/
│   ├── LoginPage.jsx
│   ├── BoardsListPage.jsx
│   └── BoardDetailPage.jsx
├── routes/
│   └── AppRouter.jsx
├── styles/
│   ├── tokens.css
│   ├── themes.css
│   └── global.css
├── mocks/
│   └── mockData.js
├── App.jsx
└── main.jsx
```

Esta estructura es orientativa, no una obligación de crear todos los archivos de inmediato. Crear únicamente los módulos necesarios para la fase que se está desarrollando.

## 4.1 Responsabilidades

### `api/`

- Centralizar la configuración de Axios.
- Exponer funciones específicas por recurso.
- Mantener los detalles HTTP fuera de los componentes visuales.
- Propagar errores de forma consistente para que la UI pueda interpretarlos.
- No incluir JSX ni lógica de presentación.

### Componentes presentacionales

- Recibir datos y callbacks por props.
- Renderizar la interfaz y comunicar interacciones mediante callbacks.
- No llamar directamente a Axios ni conocer URLs de la API.
- No concentrar lógica de negocio, sincronización remota ni efectos complejos.

### Páginas y contenedores

- Componer componentes reutilizables.
- Coordinar carga de datos, estado de la vista y acciones del usuario.
- Usar servicios de `api/` o hooks de dominio.
- Gestionar estados de carga, error, vacío y éxito.
- Evitar convertirse en componentes gigantes con estilos, validaciones y fetches mezclados.

### Hooks

- Encapsular lógica reutilizable de estado o interacción.
- No crear hooks para abstraer una operación trivial utilizada una sola vez, salvo que mejore claramente la legibilidad.

### Formularios y esquemas

- Definir reglas de validación de cliente en esquemas reutilizables cuando corresponda.
- Mostrar los errores junto al campo pertinente.
- Tratar la validación del cliente como una ayuda de UX, nunca como sustituto de la validación del backend.

### Estilos

- Mantener los tokens visuales centralizados.
- No duplicar reglas globales ni fijar colores de tema directamente en componentes.
- Evitar estilos globales que filtren accidentalmente a componentes no relacionados.

---

# 5. Contrato de rutas SPA

Configurar las rutas mediante React Router DOM.

| Ruta | Página | Acceso previsto | Comportamiento |
|---|---|---|---|
| `/login` | `LoginPage` | Público | Pantalla/formulario de acceso según lo definido por la consigna |
| `/boards` | `BoardsListPage` | Protegido en el diseño objetivo | Lista de tableros |
| `/boards/:boardId` | `BoardDetailPage` | Protegido en el diseño objetivo | Tablero Kanban con columnas y tickets |
| `*` | `NotFoundPage` o equivalente | Público | Estado de ruta inexistente |

Reglas:

- Usar `useParams()` para leer `boardId` en la página del tablero.
- Usar `useNavigate()` para navegación programática cuando corresponda.
- Los enlaces de navegación deben utilizar `Link` o `NavLink`.
- **No utilizar `Link` para acciones de mutación** como crear, borrar o mover tickets.
- Después de una mutación, navegar solo si corresponde y únicamente después de confirmar el éxito de la API.
- No crear un `ProtectedRoute` que dependa de una autenticación ficticia. La protección real queda pendiente hasta definir un contrato de autenticación.
- La ruta `/boards` necesita un endpoint de listado que no está en el contrato conocido; no simular que `GET /api/boards` existe.

---

# 6. Integración con la API

## 6.1 URL base

La URL base del backend debe configurarse exclusivamente mediante:

```env
VITE_API_URL=http://localhost:4000/api
```

El valor anterior es solo un ejemplo local. El entorno de ejecución debe proporcionar la URL adecuada.

Reglas:

- Utilizar `import.meta.env.VITE_API_URL`.
- No hardcodear URLs del backend dentro de páginas o componentes.
- Crear una instancia centralizada de Axios con `baseURL`.
- No agregar `/api` dos veces: acordar si forma parte de `VITE_API_URL` y mantenerlo consistente.
- Crear `.env.example` con valores ilustrativos, sin secretos.
- No versionar `.env` con configuraciones locales o credenciales.
- Manejar errores de red, respuestas HTTP no exitosas y respuestas vacías como `204 No Content`.

## 6.2 Servicios

Crear funciones de servicio que representen las operaciones del contrato real. Ejemplos conceptuales:

- `createBoard(payload)`
- `getBoardById(boardId)`
- `createColumn(boardId, payload)`
- `deleteColumn(boardId, columnId)`
- `createTicket(boardId, columnId, payload)`
- `updateTicket(boardId, columnId, ticketId, payload)`

Los nombres definitivos deben seguir las convenciones del repositorio. No implementar funciones de servicio para endpoints inexistentes como si fueran operaciones reales.

Los servicios deben propagar errores o normalizarlos en un formato común sin ocultar el estado HTTP ni el mensaje útil del servidor.

## 6.3 Errores de API

- Mostrar mensajes comprensibles, sin stack traces ni detalles internos.
- Si el backend devuelve un error de validación, asociarlo al campo correspondiente cuando sea posible.
- Si el error no puede asociarse a un campo, mostrar una alerta o toast general.
- Distinguir problemas de conexión de errores de validación o de recursos inexistentes.
- No asumir que todas las respuestas de error tienen un mismo formato sin inspeccionar el backend real.
- No reintentar automáticamente mutaciones que puedan generar efectos no deseados.

---

# 7. Formularios y validaciones

Utilizar React Hook Form y Zod para formularios con validaciones no triviales.

Reglas:

1. Validar en cliente los campos obligatorios, formatos y restricciones que estén definidos por el contrato.
2. No inventar campos obligatorios ni límites de longitud que no estén especificados.
3. Mantener los mensajes claros, breves y asociados al campo.
4. Mapear los errores del backend al formulario cuando exista una correspondencia razonable.
5. No borrar todos los campos ni reiniciar el formulario cuando una petición falla.
6. Prevenir envíos repetidos mientras la operación está en curso.
7. Usar etiquetas accesibles y atributos como `aria-invalid` y `aria-describedby` cuando correspondan.
8. Tras el éxito, limpiar o cerrar el formulario solo si ese es el comportamiento esperado de la interacción.

Todo formulario que realice `POST`, `PATCH` o `DELETE` debe:

- Deshabilitar el control de envío mientras se procesa la operación.
- Mostrar un indicador visual de carga (spinner o estado equivalente).
- Evitar que se envíe de nuevo la misma acción accidentalmente.
- Informar el resultado mediante un estado visible, toast o actualización contextual.

No usar únicamente un spinner sin texto o sin un estado accesible para comunicar que la operación está en curso.

---

# 8. Estado de interfaz y sincronización

Cada página o componente que dependa de datos remotos debe contemplar los estados que correspondan:

- **Loading:** la petición está en curso.
- **Success:** los datos se cargaron y se pueden utilizar.
- **Empty:** no hay datos que mostrar.
- **Error:** la operación falló y el usuario puede comprender qué ocurrió.
- **Submitting/Mutating:** una acción de escritura está en curso.

Evitar estados redundantes que puedan derivarse de otros valores. Evitar `useEffect` para valores que pueden calcularse directamente durante el render.

## 8.1 Creación y eliminación

- Actualizar la UI a partir de la respuesta confirmada por el backend.
- No mostrar una mutación como exitosa antes de recibir la confirmación del servidor.
- En operaciones destructivas, solicitar confirmación cuando la pérdida de datos pueda ser significativa.
- Respetar el `204 No Content` de eliminación: no intentar parsear su cuerpo como JSON.
- Si una operación falla, conservar los datos anteriores y comunicar el error.

## 8.2 Movimiento de tickets y UI optimista

Para mover tickets entre columnas, la consigna propone una **actualización optimista**:

1. Guardar el estado anterior del ticket y de las columnas afectadas.
2. Actualizar temporalmente la UI para reflejar el movimiento.
3. Enviar el `PATCH` al endpoint real.
4. Si el backend confirma el éxito, reconciliar la UI con la respuesta disponible.
5. Si responde con error (por ejemplo, `400` o `404`) o falla la red, revertir el estado anterior.
6. Mostrar un toast accesible que explique que no se pudo mover el ticket.

No dejar el estado local y el servidor divergentes. No realizar actualizaciones optimistas para acciones cuyo contrato o impacto todavía no esté claro.

El cuerpo del `PATCH`, los campos permitidos y la forma exacta de indicar la columna de destino deben obtenerse del backend real; no inventarlos. Si el contrato no define con claridad cómo representar el movimiento, detener esa parte e informar la ambigüedad antes de implementarla.

---

# 9. Diseño visual: Modern SaaS

La interfaz debe seguir el estilo **Modern SaaS (vibrante y accesible)** definido en la consigna: producto de productividad actual, jerarquía visual clara, CTA destacados y bordes redondeados suaves.

## 9.1 Paleta definida por la consigna

### Light mode

- Fondo: `#FAFAFA`
- Tarjetas/superficies: `#FFFFFF`
- Texto principal: `#2D3748`
- Acento cian: `#00B8D9`
- Acento púrpura: `#6554C0`
- Las tarjetas pueden usar sombras suaves y difuminadas.

### Dark mode

- Fondo: `#121212`
- Tarjetas/superficies: `#1E1E1E`
- Bordes sutiles: `#333333`
- Texto principal: `#E0E0E0`
- Acento cian: `#33E1ED`
- Acento púrpura: `#9F8DF1`
- No utilizar sombras en dark mode; separar las superficies con bordes sutiles.

Los colores semánticos adicionales para éxito, advertencia, error, foco y estados deshabilitados deben elegirse con contraste suficiente y documentarse como tokens.

## 9.2 Tokens CSS obligatorios

Queda prohibido hardcodear colores hexadecimales de tema directamente en componentes o en múltiples archivos de estilos. Definir tokens globales en archivos de diseño, por ejemplo:

```css
:root {
  color-scheme: light;
  --bg-primary: #FAFAFA;
  --surface-primary: #FFFFFF;
  --text-primary: #2D3748;
  --accent-cyan: #00B8D9;
  --accent-purple: #6554C0;
  /* Agregar tokens semánticos de borde, texto secundario,
     foco, éxito, advertencia, error y sombra. */
}

:root.dark {
  color-scheme: dark;
  --bg-primary: #121212;
  --surface-primary: #1E1E1E;
  --text-primary: #E0E0E0;
  --accent-cyan: #33E1ED;
  --accent-purple: #9F8DF1;
  /* Sobrescribir los tokens semánticos para dark mode. */
}
```

El fragmento es una referencia de estructura, no una obligación de copiarlo sin adaptar el CSS existente.

Todos los componentes deben consumir variables CSS, por ejemplo `var(--bg-primary)`, `var(--text-primary)` y `var(--accent-cyan)`. Las excepciones solo se admiten para recursos gráficos externos o casos técnicos justificados.

## 9.3 Tema claro/oscuro

Implementar:

1. Detección inicial de `prefers-color-scheme` para respetar la preferencia del sistema cuando el usuario todavía no eligió un tema.
2. Un control visible y accesible para alternar entre tema claro y oscuro.
3. Una clase global (por ejemplo, `.dark`) aplicada a `<html>` o `<body>`.
4. Persistencia de la elección explícita en `localStorage`.
5. Restauración del tema al recargar.
6. Prevención, en la medida razonable de la estructura existente, del parpadeo de tema incorrecto al iniciar.

Prioridad de decisión:

- Si existe una preferencia explícita guardada, respetarla.
- Si no existe, usar la preferencia del sistema operativo.
- Si cambia la preferencia del sistema y no hay una elección explícita guardada, actualizar el tema.

No leer ni escribir `localStorage` de forma que provoque errores durante el renderizado del servidor si el proyecto llegara a incorporarlo en el futuro. Actualmente la app es una SPA Vite, pero mantener el manejo del tema encapsulado.

## 9.4 Criterios visuales

- Diseñar primero una jerarquía consistente: navegación, encabezados, contenido principal y acciones.
- Utilizar espaciado, tipografía, bordes, radios y elevación de manera consistente.
- Reservar los colores de acento para acciones primarias, selección y estados relevantes; no saturar toda la interfaz.
- Los tableros deben priorizar la lectura rápida de columnas y tickets.
- Los tickets deben tener jerarquía clara entre título, descripción y metadatos disponibles.
- Los estados vacíos deben explicar qué falta y ofrecer una acción pertinente cuando exista.
- Los modales deben cerrar de forma coherente, controlar el foco y permitir el uso por teclado.
- Evitar animaciones decorativas excesivas; respetar `prefers-reduced-motion`.
- No agregar campos o metadatos visuales que el backend no provea ni la consigna requiera.

---

# 10. Responsive y accesibilidad

La interfaz debe ser usable en escritorio, tablet y móvil.

- Evitar anchos fijos que rompan pantallas pequeñas.
- En el tablero Kanban, permitir desplazamiento horizontal de columnas si es necesario sin generar scroll horizontal de toda la página de forma accidental.
- Mantener las acciones principales disponibles en pantallas pequeñas.
- Usar HTML semántico y botones reales para acciones.
- Todo control debe tener nombre accesible.
- No depender exclusivamente del color para comunicar estados.
- Asegurar foco visible y navegación por teclado.
- Gestionar correctamente el foco al abrir/cerrar modales.
- Usar `aria-live` o mecanismos equivalentes para anunciar errores, toasts y resultados dinámicos cuando corresponda.
- Verificar contraste suficiente en ambos temas.
- No quitar el outline de foco sin proporcionar un reemplazo visible.

---

# 11. Drag and drop

No agregar una librería de drag and drop hasta confirmar que el repositorio no cuenta ya con una solución y que la interacción es necesaria para cumplir la experiencia de Kanban.

Si se implementa movimiento mediante arrastrar y soltar:

- Mantener una alternativa accesible por teclado o mediante controles explícitos.
- No persistir el movimiento solo en el frontend.
- Integrarlo con el `PATCH` real.
- Aplicar la estrategia optimista y rollback definida en la sección 8.2.
- Evitar enviar múltiples mutaciones simultáneas contradictorias para el mismo ticket.
- No inventar el payload del movimiento.

---

# 12. Mocks y desarrollo independiente del backend

Se pueden utilizar mocks para construir y validar la interfaz antes de disponer de un backend accesible.

- Mantener los datos sintéticos en `src/mocks/mockData.js` o en un mecanismo de mocking aislado.
- Modelar los mocks según las respuestas reales del backend.
- No mezclar datos simulados y reales en el mismo flujo sin una distinción explícita.
- No activar mocks por defecto en producción.
- Documentar cómo activar y desactivar los mocks.
- No afirmar que una operación mock fue persistida en MongoDB.
- No utilizar mocks para ocultar errores de integración.

Antes de conectar una vista, verificar la estructura real de las respuestas y los errores del backend.

---

# 13. Testing y verificación

Usar las herramientas de pruebas que ya existan en el repositorio. Si no hay estrategia de testing, proponer una mínima antes de agregar dependencias.

Verificar, como mínimo, los siguientes casos cuando correspondan:

## Navegación

- Las rutas declaradas renderizan la página esperada.
- Un `boardId` inválido produce un estado de error claro.
- Una ruta inexistente muestra una página de no encontrado.
- No se simula una autenticación inexistente.

## Carga de datos

- Se muestra loading mientras la petición está en curso.
- Se muestran los datos cuando la petición tiene éxito.
- Se muestra un estado vacío cuando no hay elementos.
- Se muestra un error útil cuando falla la petición.
- Se contempla una API no disponible.

## Formularios y mutaciones

- Los campos obligatorios se validan.
- Los errores de servidor se muestran sin recargar la página.
- Los botones se deshabilitan durante la petición.
- Se muestra un indicador de envío.
- Los errores no borran innecesariamente lo ingresado.
- Una eliminación `204` no intenta parsear JSON.
- Un fallo de mutación no se presenta como éxito.

## Movimiento de tickets

- El movimiento actualiza la UI de forma optimista.
- Un `PATCH` exitoso conserva el estado esperado.
- Un `400`, `404` o error de red revierte la UI.
- Se muestra un toast de error.
- No se corrompen las columnas ni se duplica el ticket.

## Tema y responsive

- El tema del sistema se respeta cuando no hay preferencia guardada.
- La selección explícita persiste tras recargar.
- Los componentes consumen tokens CSS.
- Las pantallas principales son utilizables en anchos de escritorio y móvil.
- Las acciones principales funcionan por teclado.

No declarar que se ejecutaron pruebas que no se hayan ejecutado realmente. Informar los comandos utilizados y cualquier limitación del entorno.

---

# 14. Documentación obligatoria

Crear o actualizar la documentación del frontend, sin borrar ni reemplazar la documentación existente del backend.

Como mínimo:

- `README.md` del frontend o sección equivalente: objetivo, requisitos, instalación, variables de entorno, ejecución y build.
- `docs/frontend-architecture.md`: decisiones de arquitectura, stack, organización de carpetas, separación de responsabilidades, manejo de estado, formularios, tema y estrategia de errores.
- Documentar los endpoints consumidos y las limitaciones de contrato detectadas.
- Explicar cómo ejecutar el frontend contra el backend local.
- Explicar el uso de mocks si se implementan.
- Documentar cualquier dependencia nueva y el motivo de incorporarla.

El proyecto también debe mantener `.env.example` sin secretos reales.

---

# 15. Git y Conventional Commits

Los commits deben seguir Conventional Commits y representar unidades pequeñas y revisables.

Ejemplos:

```text
feat(frontend): scaffold Vite React application
feat(api): add Axios client and board services
feat(theme): add Modern SaaS light and dark themes
feat(boards): implement board detail loading states
feat(tickets): add ticket creation form
fix(tickets): rollback optimistic move on API failure
test(frontend): cover board loading and error states
docs(frontend): document architecture and setup
```

Evitar mensajes genéricos como `update`, `changes`, `final`, `fix` o `cosas`.

No hacer commits, push, merge ni despliegues sin que la tarea o el usuario lo autorice explícitamente.

---

# 16. Desarrollo basado en especificaciones (SDD)

Trabajar de forma incremental. No generar todo el frontend en una única modificación.

## Fase 0 — Inspección y contrato

Antes de programar:

1. Leer este `AGENTS.md`.
2. Inspeccionar la estructura del repositorio y `package.json`.
3. Identificar el estado real del backend y sus endpoints.
4. Revisar los formatos reales de request/response y los errores.
5. Identificar las discrepancias de autenticación, listado de tableros y eliminación de tableros.
6. Definir rutas, pantallas, estados y flujos de UI.
7. Registrar decisiones y preguntas abiertas en la documentación.

No continuar como si las discrepancias estuvieran resueltas.

## Fase 1 — Base del frontend

- Configurar o verificar React y Vite.
- Configurar React Router.
- Preparar estilos globales y tokens Modern SaaS.
- Configurar la detección y persistencia del tema.
- Verificar que la aplicación arranque y compile.

No implementar todavía todas las operaciones de negocio.

## Fase 2 — Cliente API

- Crear el cliente Axios.
- Configurar `VITE_API_URL`.
- Implementar los servicios correspondientes únicamente a endpoints existentes.
- Definir un manejo consistente de errores.
- Probar cada servicio con el backend disponible o con mocks aislados.

## Fase 3 — Componentes atómicos

Construir componentes reutilizables sin llamadas HTTP internas, por ejemplo:

- Button
- Input
- Modal
- Spinner
- Toast
- EmptyState
- TicketCard
- ColumnView

Cada componente debe tener responsabilidades acotadas, props claras y estilos compatibles con ambos temas.

## Fase 4 — Vistas y navegación

Implementar las vistas de forma incremental:

1. `LoginPage`, respetando los límites de autenticación conocidos.
2. `BoardsListPage`, identificando explícitamente la ausencia del endpoint de listado.
3. `BoardDetailPage`, usando `boardId` y el endpoint de detalle real.

Cada vista debe incluir estados de carga, error y vacío que correspondan.

## Fase 5 — Formularios y mutaciones

- Crear formularios con React Hook Form y Zod.
- Integrar creación de tableros, columnas y tickets según el contrato disponible.
- Integrar eliminación de columnas.
- Integrar actualización/movimiento de tickets.
- Implementar feedback de carga, éxito y error.
- Aplicar rollback a la UI optimista cuando falle el movimiento.

## Fase 6 — Responsive, accesibilidad y calidad

- Revisar escritorio, tablet y móvil.
- Revisar teclado, foco, etiquetas y contraste.
- Verificar los temas claro y oscuro.
- Ejecutar pruebas, lint y build disponibles en el proyecto.

## Fase 7 — Integración y despliegue

- Probar el frontend conectado al backend real.
- Configurar variables de entorno del despliegue.
- Verificar CORS y disponibilidad de la API sin exponer credenciales.
- Desplegar únicamente cuando el usuario lo solicite o la tarea lo autorice.
- Documentar URLs, configuración necesaria y límites conocidos, sin inventar resultados.

---

# 17. Negative Boundaries

El agente **NO DEBE**:

- Inventar endpoints, payloads, campos o códigos HTTP.
- Dar por implementada una autenticación que el backend no soporta.
- Tratar `GET /api/boards` o `DELETE /api/boards/:boardId` como endpoints existentes sin confirmación.
- Colocar llamadas Axios directamente en componentes presentacionales.
- Mezclar lógica de presentación, validación, negocio y red en un único componente gigante.
- Hardcodear URLs de backend en páginas o componentes.
- Hardcodear repetidamente colores de tema en los componentes.
- Ignorar errores HTTP o mostrar mutaciones fallidas como exitosas.
- Dejar botones de envío activos durante una mutación.
- Parsear como JSON una respuesta `204 No Content`.
- Implementar UI optimista sin rollback ante errores.
- Inventar el cuerpo del `PATCH` para mover tickets.
- Introducir librerías sin revisar primero las dependencias existentes.
- Activar mocks en producción silenciosamente.
- Usar enlaces de navegación como sustituto de acciones de mutación.
- Simular persistencia real con datos locales.
- Sobrescribir archivos funcionales sin revisar sus dependencias.
- Afirmar que las pruebas, el build o el despliegue fueron exitosos sin ejecutarlos.
- Realizar commits, push, merge o despliegues no autorizados.

---

# 18. Regla de incertidumbre

Cuando la consigna no defina un comportamiento:

1. Identificar qué información falta.
2. Inspeccionar el código y el contrato existente para determinar si ya está resuelta.
3. Explicar brevemente la ambigüedad.
4. Proponer la alternativa mínima y sus consecuencias.
5. Pedir confirmación si la decisión cambia el contrato, agrega funcionalidades o altera datos.

Prestar especial atención a:

- Autenticación y protección de rutas.
- Listado de tableros.
- Eliminación de tableros.
- Campos obligatorios y límites de formularios.
- Forma exacta de mover un ticket mediante `PATCH`.
- Respuestas del backend y formato de errores.
- Persistencia de datos mock.
- Comportamiento de arrastre y soltado.
- Acciones que puedan eliminar datos.

---

# 19. Instrucciones para el agente en cada tarea

Antes de escribir o modificar código:

1. Leer `AGENTS.md`.
2. Inspeccionar los archivos relacionados y el estado de Git.
3. Identificar la fase SDD en la que se trabaja.
4. Confirmar el contrato de API necesario.
5. Describir brevemente el alcance de los cambios.
6. Implementar solo la parte acordada.
7. Ejecutar las verificaciones pertinentes.
8. Revisar el diff para detectar cambios ajenos al objetivo.
9. Informar archivos modificados, decisiones, pruebas ejecutadas y asuntos pendientes.

No reescribir archivos completos cuando un cambio localizado sea suficiente. No introducir refactors no relacionados con la tarea.

---

# 20. Definition of Done

Una funcionalidad se considera terminada cuando:

- [ ] Cumple el comportamiento definido y no inventa contrato.
- [ ] Respeta la separación entre UI, páginas, hooks y servicios API.
- [ ] Incluye estados de carga, error, vacío y éxito según corresponda.
- [ ] Valida formularios y muestra errores útiles.
- [ ] Deshabilita controles y muestra feedback durante mutaciones.
- [ ] Maneja correctamente respuestas vacías `204 No Content`.
- [ ] Conserva la consistencia entre UI y backend.
- [ ] Las actualizaciones optimistas tienen rollback.
- [ ] Utiliza tokens CSS Modern SaaS y funciona en light/dark mode.
- [ ] Respeta preferencia del sistema y persistencia del tema.
- [ ] Es responsive y contempla accesibilidad básica.
- [ ] No introduce dependencias o endpoints injustificados.
- [ ] Las pruebas disponibles fueron ejecutadas y sus resultados informados.
- [ ] El build disponible se ejecutó y sus resultados fueron informados.
- [ ] La documentación relevante está actualizada.
- [ ] Las limitaciones de contrato están documentadas y no se ocultan.
