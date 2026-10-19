import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { Save } from 'lucide-react';

export function EditTicketModal({
  isOpen,
  onClose,
  ticket,
  columns = [],
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetColumnId, setTargetColumnId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title || '');
      setDescription(ticket.description || '');
      setTargetColumnId(ticket.column || '');
      setErrors({});
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'El título del ticket no puede estar vacío';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        columnId: targetColumnId
      });
      onClose();
    } catch (err) {
      const message = err.friendlyMessage || err.response?.data?.error || 'Error al actualizar el ticket';
      setErrors({ title: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Ticket"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <Input
            label="Título"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            disabled={isSubmitting}
            autoFocus
          />

          <Input
            as="textarea"
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={4}
          />

          {columns.length > 1 && (
            <div className="form-group">
              <label className="form-label" htmlFor="select-col">
                Columna
              </label>
              <select
                id="select-col"
                className="form-select"
                value={targetColumnId}
                onChange={(e) => setTargetColumnId(e.target.value)}
                disabled={isSubmitting}
              >
                {columns.map((col) => (
                  <option key={col._id} value={col._id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={Save}
            isSubmitting={isSubmitting}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditTicketModal;
