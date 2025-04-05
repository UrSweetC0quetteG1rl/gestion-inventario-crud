export default function InventoryList({ items, onDelete, onEdit }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="inventory-list">
        <p className="empty-message">
          No se han encontrado artículos en el inventario.
        </p>
      </div>
    );
  }

  return (
    <div className="inventory-list">
      <div className="list-header">
        <p className="item-count">Mostrando {items.length} producto(s)</p>
      </div>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{formatPrice(item.price)}</td>
              <td className="action-buttons">
                <button className="btn-secondary" onClick={() => onEdit(item)}>
                  Editar
                </button>
                <button
                  className="btn-danger"
                  onClick={() => onDelete(item.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
