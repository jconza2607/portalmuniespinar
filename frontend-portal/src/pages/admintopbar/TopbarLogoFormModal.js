'use client';

export default function TopbarLogoFormModal({ form, onChange, onSubmit, onClose, isEdit }) {
  return (
    <div className="modal-overlay" onClick={() => onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? 'Editar' : 'Agregar'} Logo del Topbar</h3>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <label>
            Imagen del logo (PNG o SVG):
            <input
              type="file"
              name="file"
              accept="image/png,image/svg+xml,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={onChange}
              required={!isEdit} // obligatorio solo en "crear"
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
