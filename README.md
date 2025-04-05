# ⊹ ࣪ ˖ Sistema de Gestión de Inventario ⋆˙⟡

Un sistema básico de gestión de inventario desarrolado con React-Vite para el frontend y una API en Node.js para el backend. Permite realizar operaciones CRUD sobre una lista de productos.
Tiene como fin ayudar a mantener el orden de los productos que se agregan al inventario de un comercio pequeño.

## .ᐟ⋆Tecnologías Utilizadas

- React
- JavaScript
- HTML / CSS
- Node.js (API)
- Express
- SQL server
- Git & GitHub

## Funciones que cubre
- **Agregar**  productos al inventario
- **Editar** productos
- **Eliminar** productos
- **Buscar** productos por nombre
- **Filtrar** productos por categoría
- Comunicación entre interfaz de usuario y la base de datos.

##Instalación del proyecto

- Clonar el repositorio.
- Instalar las dependencias utilizando: npm install
- En una consola con la ubicación del proyecto ejecutar: npm run dev
- Abrir el proyecto en el puerto que le indica en la consola.

# ᯓᡣ𐭩Base de datos y servidor

- Crear base de datos utilizando el script(se encuentra abajo).
- Configurar el stringConnection en el archivo de Server.js
- Inicializar servidor: node Server.js

## ⋆˚࿔ Script SQL server

CREATE DATABASE inventory_management;
GO

USE inventory_management;
GO

CREATE TABLE inventory (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  description NVARCHAR(MAX),
  category NVARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);
GO


CREATE INDEX idx_inventory_category ON inventory(category);
GO


INSERT INTO inventory (name, description, category, quantity, price) VALUES
('Laptop', 'Dell XPS 13 laptop', 'Electronics', 10, 999.99),
('T-shirt', 'Cotton t-shirt, size M', 'Clothing', 50, 19.99),
('Notebook', 'Spiral notebook, 200 pages', 'Office Supplies', 100, 4.99),
('Coffee', 'Coffee beans, 1lb bag', 'Food', 25, 12.99);
GO


CREATE VIEW low_stock_items AS
SELECT * FROM inventory WHERE quantity < 10;
GO


CREATE TRIGGER trg_inventory_update
ON inventory
AFTER UPDATE
AS
BEGIN
    UPDATE inventory
    SET updated_at = GETDATE()
    FROM inventory i
    INNER JOIN inserted ins ON i.id = ins.id
END
GO

By: Naomi Meran [2023-1514]
