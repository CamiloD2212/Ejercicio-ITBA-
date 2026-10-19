import React, { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { Plus } from 'lucide-react';

export function CreateBoardModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setTitle('');
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrors({ title: 'El título del tablero es obligatorio' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit({ title: title.trim() });
      handleClose();
    } catch (err) {
      const message = err.friendlyMessage || err.response?.data?.error || 'Error al crear el tablero';
      setErrors({ title: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nuevo Tablero"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <Input
            label="Título del tablero"
            required
            placeholder="Ej: Sprint 43 — Infraestructura Cloud"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            disabled={isSubmitting}
            autoFocus
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
            Crear Tablero
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateBoardModal;
