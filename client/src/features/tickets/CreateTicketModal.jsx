import React, { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { Plus } from 'lucide-react';

export function CreateTicketModal({
  isOpen,
  onClose,
  columnTitle,
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'El título del ticket es obligatorio';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      handleClose();
    } catch (err) {
      // Mapeo directo de error devuelto por la API (ej. 400 Bad Request) al input visual
      const message = err.friendlyMessage || err.response?.data?.error || 'Error al crear el ticket';
      setErrors({ title: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Nuevo Ticket en "${columnTitle || 'Columna'}"`}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <Input
            label="Título de la tarea"
            required
            placeholder="Ej: Implementar endpoint de autenticación"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            disabled={isSubmitting}
            autoFocus
          />

          <Input
            as="textarea"
            label="Descripción (opcional)"
            placeholder="Añade detalles, criterios de aceptación o notas de implementación..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={4}
          />
        </div>

        <div className="modal-footer">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={Plus}
            isSubmitting={isSubmitting}
          >
            Crear Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTicketModal;
