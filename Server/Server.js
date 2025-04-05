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
    console.log("✅ Conexión exitosa a SQL Server");
  })
  .catch((err) => {
    console.error("❌ Error conectando a la base de datos:", err);
  });

async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log("Connected to SQL Server database");
  } catch (err) {
    console.error("Error connecting to SQL Server database:", err);
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
    console.error("Error fetching inventory items:", err);
    res.status(500).json({ error: "Error fetching inventory items" });
  }
});

app.get("/api/inventory/:id", async (req, res) => {
  try {
    const result = await sql.query(
      `SELECT * FROM inventory WHERE id = ${req.params.id}`
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching inventory item:", err);
    res.status(500).json({ error: "Error fetching inventory item" });
  }
});

app.post("/api/inventory", async (req, res) => {
  const { name, description, category, quantity, price } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
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
    console.error("Error creating inventory item:", err);
    res.status(500).json({ error: "Error creating inventory item" });
  }
});

app.put("/api/inventory/:id", async (req, res) => {
  const { name, description, category, quantity, price } = req.body;
  const id = req.params.id;

  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
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
      return res.status(404).json({ error: "Item not found" });
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
    console.error("Error updating inventory item:", err);
    res.status(500).json({ error: "Error updating inventory item" });
  }
});

app.delete("/api/inventory/:id", async (req, res) => {
  try {
    const result = await sql.query(
      `DELETE FROM inventory WHERE id = ${req.params.id}`
    );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting inventory item:", err);
    res.status(500).json({ error: "Error deleting inventory item" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
