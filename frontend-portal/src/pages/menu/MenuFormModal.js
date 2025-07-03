'use client';

export default function MenuFormModal({
  form,
  parentOptions,
  onChange,
  onSubmit,
  onClose,
  isEdit,
  resetForm,
}) {
  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="admin-modal-backdrop" onClick={handleClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Editar' : 'Crear'} Menú</h2>

        <form onSubmit={onSubmit}>
          <label>
            Etiqueta:
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Ruta (href):
            <input
              type="text"
              name="href"
              value={form.href}
              onChange={onChange}
            />
          </label>

          <label>
            Ícono (ej. icofont-users):
            <input
              type="text"
              name="icon"
              value={form.icon}
              onChange={onChange}
            />
          </label>

          <label>
            Menú Padre:
            <select
              name="parent_id"
              value={form.parent_id ?? ''}
              onChange={onChange}
            >
              <option value="">-- Sin padre --</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
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

          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
