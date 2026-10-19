/**
 * Mock Data para desarrollo y testing desacoplado del frontend.
 * Estructurado exactamente según la especificación del Backend:
 * Board -> Column -> Ticket
 */

export const mockBoards = [
  {
    _id: "67b000000000000000000001",
    title: "Sprint 42 — Core Platform",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    columns: [
      {
        _id: "67c000000000000000000001",
        title: "Por Hacer (To Do)",
        board: "67b000000000000000000001",
        tickets: [
          {
            _id: "67d000000000000000000001",
            title: "Implementar autenticación JWT",
            description: "Crear middleware de verificación y endpoints de refresh token",
            column: "67c000000000000000000001",
            createdAt: new Date().toISOString()
          },
          {
            _id: "67d000000000000000000002",
            title: "Optimizar queries en MongoDB",
            description: "Añadir índices compuestos en colecciones de alto volumen",
            column: "67c000000000000000000001",
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        _id: "67c000000000000000000002",
        title: "En Progreso (In Progress)",
        board: "67b000000000000000000001",
        tickets: [
          {
            _id: "67d000000000000000000003",
            title: "Diseño UI Modern SaaS",
            description: "Tokens de color cyan/purple, theme switch con localStorage y optimización de FOUC",
            column: "67c000000000000000000002",
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        _id: "67c000000000000000000003",
        title: "Finalizado (Done)",
        board: "67b000000000000000000001",
        tickets: [
          {
            _id: "67d000000000000000000004",
            title: "API RESTful con rutas anidadas",
            description: "Validación estricta de jerarquía Board -> Column -> Ticket",
            column: "67c000000000000000000003",
            createdAt: new Date().toISOString()
          },
          {
            _id: "67d000000000000000000005",
            title: "Borrado en cascada Mongoose",
            description: "Hooks pre('deleteOne') para cascada de eliminación automática",
            column: "67c000000000000000000003",
            createdAt: new Date().toISOString()
          }
        ]
      }
    ]
  },
  {
    _id: "67b000000000000000000002",
    title: "Mobile App Redesign",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    columns: [
      {
        _id: "67c000000000000000000004",
        title: "Backlog",
        board: "67b000000000000000000002",
        tickets: [
          {
            _id: "67d000000000000000000006",
            title: "Animaciones de transición de pantallas",
            description: "Diseñar micro-interacciones a 60fps",
            column: "67c000000000000000000004",
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        _id: "67c000000000000000000005",
        title: "Completado",
        board: "67b000000000000000000002",
        tickets: []
      }
    ]
  }
];
