'use client';

export default function TopbarFormModal({ form, onChange, onSubmit, onClose, isEdit }) {
  return (
    <div
      className="modal-overlay"
      onClick={() => onClose()}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? 'Editar' : 'Agregar'} Correo</h3>
        <form onSubmit={onSubmit}>
          <label>
            Correo electrónico:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>
          <label>
            <input
              type="checkbox"
              name="enabled"
              checked={form.enabled}
              onChange={onChange}
            />
            Habilitado
          </label>
          <div style={{ marginTop: '12px' }}>
            <button type="submit">Guardar</button>{' '}
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
