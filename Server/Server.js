const express = require("express");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  connectionString:
    "Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-PLQIUI8;Database=inventory_management;Trusted_Connection=Yes;TrustServerCertificate=yes;",
  driver: "msnodesqlv8",
};

sql
  .connect(dbConfig)
  .then(() => {
    console.log("Conexión exitosa a SQL Server");
  })
  .catch((err) => {
    console.error("Error conectando a la base de datos:", err);
  });

async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log("Conectado a la base de datos SQL.");
  } catch (err) {
    console.error("Error connectandose a la base de datos SQL Server:", err);
    process.exit(1);
  }
}

connectToDatabase();

// API

app.get("/api/inventory", async (req, res) => {
  try {
    const result = await sql.query(`SELECT * FROM inventory`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error obteniendo inventario:", err);
    res.status(500).json({ error: "Error cargando inventario." });
  }
});

app.get("/api/inventory/:id", async (req, res) => {
  try {
    const result = await sql.query(
      `SELECT * FROM inventory WHERE id = ${req.params.id}`
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error obteniendo inventario:", err);
    res.status(500).json({ error: "Error cargando inventario." });
  }
});

app.post("/api/inventory", async (req, res) => {
  const { name, description, category, quantity, price } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "Nombre y categoria son campos necesarios." });
  }

  try {
    const result = await sql.query(`
      INSERT INTO inventory (name, description, category, quantity, price)
      OUTPUT INSERTED.id
      VALUES ('${name}', '${description}', '${category}', ${quantity}, ${price})
    `);

    const newItemId = result.recordset[0].id;

    res.status(201).json({
      id: newItemId,
      name,
      description,
      category,
      quantity,
      price,
    });
  } catch (err) {
    console.error("Error creando producto:", err);
    res.status(500).json({ error: "Error creando producto" });
  }
});

app.put("/api/inventory/:id", async (req, res) => {
  const { name, description, category, quantity, price } = req.body;
  const id = req.params.id;

  if (!name || !category) {
    return res.status(400).json({ error: "Nombre y categoria son campos necesarios." });
  }

  try {
    const result = await sql.query(`
      UPDATE inventory 
      SET name = '${name}', 
          description = '${description}', 
          category = '${category}', 
          quantity = ${quantity}, 
          price = ${price} 
      WHERE id = ${id}
    `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({
      id,
      name,
      description,
      category,
      quantity,
      price,
    });
  } catch (err) {
    console.error("Error actualizando inventario: ", err);
    res.status(500).json({ error: "Error actualizando inventario." });
  }
});

app.delete("/api/inventory/:id", async (req, res) => {
  try {
    const result = await sql.query(
      `DELETE FROM inventory WHERE id = ${req.params.id}`
    );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({ message: "Producto eliminado exitosamente." });
  } catch (err) {
    console.error("Error eliminando el producto:", err);
    res.status(500).json({ error: "Error eliminado el producto." });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo el el puerto: ${port}`);
});
