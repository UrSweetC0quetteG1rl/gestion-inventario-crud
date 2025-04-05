"use client";

import { useState, useEffect } from "react";

export default function InventoryForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        quantity: 0,
        price: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity" || name === "price") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!initialData) {
      setFormData({
        name: "",
        description: "",
        category: "",
        quantity: 0,
        price: 0,
      });
    }
  };

  return (
    <form className="inventory-form" onSubmit={handleSubmit}>
      <div className="form-group">
        
      </div>
    </form>
  );
}
