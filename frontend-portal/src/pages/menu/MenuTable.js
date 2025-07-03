'use client';

export default function MenuTable({ menus, onEdit, onDelete }) {
  return (
    <table border="1" cellPadding="6">
      <thead>
        <tr>
          <th>ID</th>
          <th>Etiqueta</th>
          <th>Ruta</th>
          <th>Ícono</th>
          <th>Padre</th>
          <th>Habilitado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {menus.map((m) => (
          <tr key={m.id}>
            <td>{m.id}</td>
            <td>{m.label}</td>
            <td>{m.href || '-'}</td>
            <td>
              {m.icon ? (
                <i className={m.icon} style={{ fontSize: '1.2rem' }}></i>
              ) : (
                '-'
              )}
            </td>
            <td>{m.parent_id ?? 'N/A'}</td>
            <td>{m.enabled ? 'Sí' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(m)}>Editar</button>{' '}
              <button onClick={() => onDelete(m.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
