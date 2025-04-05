import { useState, useEffect } from "react";
import InventoryList from "./components/Inventory_List";
import InventoryForm from "./components/Inventory_Form";
import SearchAndFilter from "./components/Search";
import "./App.css";

const API_URL = "http://localhost:5000/api/inventory";

export default function App() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Fallo a la hora de cargar los elementos.");
      }

      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar elementos:", err);
      setError(
        "No se han podido cargar los artículos del inventario. Vuelva a intentarlo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Crear objeto
  const addItem = async (item) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Error al crear el elemento");
      }

      const newItem = await response.json();
      setItems([...items, newItem]);
    } catch (err) {
      console.error("Error agregando el elemento:", err);
      alert(
        "No se ha podido añadir el artículo. Por favor, inténtalo de nuevo."
      );
    }
  };

  // Actualizar objeto
  const updateItem = async (updatedItem) => {
    try {
      const response = await fetch(`${API_URL}/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el elemento");
      }

      const data = await response.json();
      setItems(items.map((item) => (item.id === data.id ? data : item)));
      setEditingItem(null);
    } catch (err) {
      console.error("Error al actualizar el artículo:", err);
      alert("No se ha podido actualizar el artículo. Inténtelo de nuevo.");
    }
  };

  // Eliminar el elemento
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se ha podido eliminar el elemento");
      }

      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error al borrar un elemento:", err);
      alert(
        "No se ha podido eliminar el elemento. Por favor, inténtelo de nuevo."
      );
    }
  };

  const editItem = (item) => {
    setEditingItem(item);
  };

  // filtrar los elementos
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // obtener las categorias
  const categories = ["", ...new Set(items.map((item) => item.category))];

  return (
    <main className="container">
      <h1>Sistema de inventario</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="app-container">
        <div className="form-container">
          <h2>{editingItem ? "Editar producto" : "Agrega un producto"}</h2>
          <InventoryForm
            onSubmit={editingItem ? updateItem : addItem}
            initialData={editingItem}
            onCancel={() => setEditingItem(null)}
          />
        </div>

        <div className="list-container">
          <h2>Productos</h2>
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
          {loading ? (
            <div className="loading-message">Cargando productos...</div>
          ) : (
            <InventoryList
              items={filteredItems}
              onDelete={deleteItem}
              onEdit={editItem}
            />
          )}
        </div>
      </div>
    </main>
  );
}
