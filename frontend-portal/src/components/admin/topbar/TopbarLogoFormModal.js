'use client';

export default function TopbarLogoFormModal({ form, onChange, onSubmit, onClose, isEdit }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? 'Editar' : 'Agregar'} Logo del Topbar</h3>

        <form onSubmit={onSubmit} encType="multipart/form-data">
          <label>
            Imagen del logo (PNG / SVG):
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={onChange}
              required={!isEdit}
            />
          </label>

          <label>
            <input
              type="checkbox"
              name="enabled"
              checked={!!form.enabled}
              onChange={onChange}
            />
            Habilitado
          </label>

          <div style={{ marginTop: 12 }}>
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
