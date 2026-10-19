import React, { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiMessage, boardApi } from './api.js';

const boardSchema = z.object({ title: z.string().trim().min(1, 'Escribe un nombre para continuar.') });
const ticketSchema = z.object({ title: z.string().trim().min(1, 'El título es obligatorio.'), description: z.string() });

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => { if (!localStorage.getItem('devboard-theme')) { document.documentElement.classList.toggle('dark', media.matches); setDark(media.matches); } };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const toggle = () => { const next = !dark; setDark(next); document.documentElement.classList.toggle('dark', next); localStorage.setItem('devboard-theme', next ? 'dark' : 'light'); };
  return [dark, toggle];
}

function Shell({ children }) {
  const [dark, toggle] = useTheme();
  return <div className="app-shell"><header className="topbar"><Link className="brand" to="/"><span className="brand-mark">d.</span><span>devboard</span></Link><div className="top-actions"><span className="sync-label"><i /> API configurada por entorno</span><button className="icon-button" onClick={toggle} aria-label={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>{dark ? '☼' : '☾'}</button></div></header>{children}<footer>DevBoard <span>·</span> tu equipo, en movimiento</footer></div>;
}

function Home() {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(boardSchema) });
  const openBoard = async ({ title }) => {
    setBusy(true); setError('');
    try { const board = await boardApi.create({ title }); navigate(`/boards/${board._id}`); }
    catch (e) { setError(apiMessage(e)); }
    finally { setBusy(false); }
  };
  const [boardId, setBoardId] = useState('');
  return <main className="home"><div className="home-copy"><div className="overline"><span className="live-dot" /> EL TRABAJO AVANZA</div><h1>Ideas claras.<br/><span>Equipos en marcha.</span></h1><p className="lead">Un tablero simple para convertir lo que hay que hacer en lo que ya está hecho.</p><div className="home-rule"/><div className="create-panel"><div><h2>Empieza un tablero</h2><p>Dale un nombre y organiza el siguiente paso.</p></div><form onSubmit={handleSubmit(openBoard)}><label htmlFor="board-title">Nombre del tablero</label><div className="input-row"><input id="board-title" placeholder="Por ejemplo, Lanzamiento de producto" {...register('title')} aria-invalid={!!errors.title}/><button className="primary-button" disabled={busy}>{busy ? 'Creando…' : 'Crear tablero'}</button></div>{errors.title && <small className="field-error">{errors.title.message}</small>}</form>{error && <div role="alert" className="alert">{error}</div>}</div><div className="return-panel"><div className="return-icon">↗</div><div><h3>¿Ya tienes un tablero?</h3><p>Ábrelo con su identificador.</p></div><form className="join-form" onSubmit={(e) => { e.preventDefault(); if (boardId.trim()) navigate(`/boards/${boardId.trim()}`); }}><input aria-label="Identificador del tablero" placeholder="Pega el ID del tablero" value={boardId} onChange={(e) => setBoardId(e.target.value)}/><button className="quiet-button">Abrir</button></form></div></div><div className="hero-art" aria-hidden="true"><div className="art-note note-one"><b>Diseño de producto</b><span className="tag tag-cyan">En curso</span><small>Revisar el flujo de alta</small></div><div className="art-note note-two"><b>Preparar demo</b><span className="tag tag-purple">Por hacer</span><small>Compartir avances con el equipo</small></div><div className="art-note note-three"><b>Release 1.4</b><span className="tag tag-green">Listo</span><small>Notas y cambios publicados</small></div><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="art-caption">Un lugar para<br/>lo que sigue.</div></div></main>;
}

function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null); const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });
  useEffect(() => {
    const previous = document.activeElement;
    const first = dialogRef.current?.querySelector('input, textarea, button');
    first?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const controls = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled)')];
      if (!controls.length) return;
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('keydown', onKeyDown); previous?.focus(); };
  }, []);
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button><h2 id="modal-title">{title}</h2>{children}</section></div>;
}

function BoardPage() {
  const { boardId } = useParams(); const [board, setBoard] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [toast, setToast] = useState(''); const [dialog, setDialog] = useState(null); const [saving, setSaving] = useState(false);
  const columnForm = useForm({ resolver: zodResolver(boardSchema) }); const ticketForm = useForm({ resolver: zodResolver(ticketSchema), defaultValues: { title: '', description: '' } });
  const load = async () => { setLoading(true); setError(''); try { setBoard(await boardApi.get(boardId)); } catch (e) { setError(apiMessage(e, 'No encontramos ese tablero. Comprueba el identificador.')); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [boardId]);
  const announce = (text) => { setToast(text); window.setTimeout(() => setToast(''), 3500); };
  const addColumn = async ({ title }) => { setSaving(true); try { await boardApi.addColumn(boardId, { title }); setDialog(null); columnForm.reset(); await load(); announce('Columna creada.'); } catch (e) { announce(apiMessage(e)); } finally { setSaving(false); } };
  const addTicket = async ({ title, description }) => { setSaving(true); try { await boardApi.addTicket(boardId, dialog.column._id, { title, description }); setDialog(null); ticketForm.reset(); await load(); announce('Ticket creado.'); } catch (e) { announce(apiMessage(e)); } finally { setSaving(false); } };
  const removeColumn = async (column) => { if (!window.confirm(`¿Eliminar “${column.title}” y todos sus tickets?`)) return; setSaving(true); try { await boardApi.removeColumn(boardId, column._id); await load(); announce('Columna eliminada.'); } catch (e) { announce(apiMessage(e)); } finally { setSaving(false); } };
  const removeTicket = async (column, ticket) => { if (!window.confirm(`¿Eliminar “${ticket.title}”?`)) return; setSaving(true); try { await boardApi.removeTicket(boardId, column._id, ticket._id); await load(); announce('Ticket eliminado.'); } catch (e) { announce(apiMessage(e)); } finally { setSaving(false); } };
  const moveTicket = async (source, ticket, target) => { if (!target || source._id === target._id || saving) return; const snapshot = board; setSaving(true); setBoard({ ...board, columns: board.columns.map((c) => c._id === source._id ? { ...c, tickets: c.tickets.filter((t) => t._id !== ticket._id) } : c._id === target._id ? { ...c, tickets: [...c.tickets, { ...ticket, column: target._id }] } : c) }); try { await boardApi.updateTicket(boardId, source._id, ticket._id, { columnId: target._id }); announce('Ticket movido.'); } catch (e) { setBoard(snapshot); announce(`No se pudo mover el ticket. ${apiMessage(e)}`); } finally { setSaving(false); } };
  return <main className="board-page"><aside className="side-rail"><Link to="/" className="rail-home" aria-label="Inicio">d.</Link><div className="rail-divider"/><div className="rail-active">▦</div><div className="rail-bottom">?</div></aside><section className="board-main"><div className="board-heading"><div><div className="breadcrumb">WORKSPACE <span>/</span> TABLERO</div>{loading ? <h1>Cargando tablero…</h1> : <h1>{board?.title || 'Tablero'}</h1>}</div><div className="board-tools"><span className="member-stack"><i>J</i><i>M</i><i>+</i></span><button className="outline-button" disabled={saving} onClick={() => setDialog({ type: 'column' })}>＋ Añadir columna</button></div></div>{error ? <div className="board-state"><div className="state-icon">!</div><h2>No pudimos abrir el tablero</h2><p>{error}</p><button className="primary-button" onClick={load}>Intentar de nuevo</button></div> : loading ? <div className="board-state"><span className="loader"/><p>Cargando tablero…</p></div> : <div className="kanban-scroll"><div className="kanban">{(board?.columns || []).map((column, index) => <section className="column" key={column._id}><header className="column-head"><div className="column-title"><span className={`column-marker marker-${index % 4}`}/><h2>{column.title}</h2><span className="count">{column.tickets?.length || 0}</span></div><button className="more-button" disabled={saving} onClick={() => removeColumn(column)} aria-label={`Eliminar columna ${column.title}`}>···</button></header><div className="ticket-list" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const data = JSON.parse(e.dataTransfer.getData('text/plain') || '{}'); const source = board.columns.find((c) => c._id === data.columnId); const ticket = source?.tickets.find((t) => t._id === data.ticketId); if (source && ticket) moveTicket(source, ticket, column); }}>{(column.tickets || []).map((ticket) => <article className="ticket" key={ticket._id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ columnId: column._id, ticketId: ticket._id }))}><div className="ticket-top"><span className="ticket-type">TICKET</span><button className="ticket-delete" disabled={saving} onClick={() => removeTicket(column, ticket)} aria-label={`Eliminar ${ticket.title}`}>×</button></div><h3>{ticket.title}</h3>{ticket.description && <p>{ticket.description}</p>}<footer><span className="avatar">{ticket.title.charAt(0).toUpperCase()}</span><time>{new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</time><label className="move-select"><span className="sr-only">Mover {ticket.title}</span><select disabled={saving} value={column._id} onChange={(e) => moveTicket(column, ticket, board.columns.find((c) => c._id === e.target.value))} aria-label={`Mover ${ticket.title}`}><option value={column._id}>Mover a…</option>{board.columns.filter((c) => c._id !== column._id).map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}</select></label></footer></article>)}<button className="add-ticket" disabled={saving} onClick={() => { ticketForm.reset({ title: '', description: '' }); setDialog({ type: 'ticket', column }); }}>＋ Añadir ticket</button></div></section>)}{!board?.columns?.length && <div className="empty-board"><span>▤</span><h2>Tu tablero empieza con una columna</h2><p>Agrupa el trabajo por etapa y añade el primer ticket.</p><button className="primary-button" disabled={saving} onClick={() => setDialog({ type: 'column' })}>Crear columna</button></div>}</div></div>}</section>{toast && <div role="status" className="toast">{toast}</div>}{dialog?.type === 'column' && <Modal title="Añadir columna" onClose={() => setDialog(null)}><form className="modal-form" onSubmit={columnForm.handleSubmit(addColumn)}><label htmlFor="column-name">Nombre</label><input id="column-name" autoFocus placeholder="Por hacer" {...columnForm.register('title')}/>{columnForm.formState.errors.title && <small className="field-error">{columnForm.formState.errors.title.message}</small>}<button className="primary-button" disabled={saving}>{saving ? 'Guardando…' : 'Crear columna'}</button></form></Modal>}{dialog?.type === 'ticket' && <Modal title={`Nuevo ticket en ${dialog.column.title}`} onClose={() => setDialog(null)}><form className="modal-form" onSubmit={ticketForm.handleSubmit(addTicket)}><label htmlFor="ticket-title">Título</label><input id="ticket-title" autoFocus placeholder="¿Qué hay que hacer?" {...ticketForm.register('title')}/>{ticketForm.formState.errors.title && <small className="field-error">{ticketForm.formState.errors.title.message}</small>}<label htmlFor="ticket-description">Descripción <span>(opcional)</span></label><textarea id="ticket-description" rows="3" placeholder="Añade un poco de contexto" {...ticketForm.register('description')}/><button className="primary-button" disabled={saving}>{saving ? 'Guardando…' : 'Crear ticket'}</button></form></Modal>}</main>;
}

function NotFound() { return <main className="not-found"><span>404</span><h1>Esta página no existe.</h1><Link to="/">Volver al inicio</Link></main>; }
export default function App() { return <Shell><Routes><Route path="/" element={<Home/>}/><Route path="/boards/:boardId" element={<BoardPage/>}/><Route path="*" element={<NotFound/>}/></Routes></Shell>; }
