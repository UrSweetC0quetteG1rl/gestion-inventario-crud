export default function InventoryItem({ item, onDelete, onEdit }) {
  ///devolvera el modelo de datos para el formulario
  return (
    <div className="inventory-item">
      <h3>{item.name}</h3>
      <p>
        <strong>Categoría:</strong> {item.category}
      </p>
      <p>
        <strong>Descripción:</strong> {item.description}
      </p>
      <p>
        <strong>Cantidad:</strong> {item.quantity}
      </p>
      <p>
        <strong>Precio:</strong> ${item.price.toFixed(2)}
      </p>

      <div className="item-actions">
        <button onClick={() => onEdit(item)} className="btn-secondary">
          Edit
        </button>
        <button onClick={() => onDelete(item.id)} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}
