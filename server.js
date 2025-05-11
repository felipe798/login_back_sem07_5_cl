import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import path from "path";
import { fileURLToPath } from "url";

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:8080" // Usar el mismo puerto que el servidor
};

app.use(cors(corsOptions));

// Parsear solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Sincronizar base de datos
db.sequelize.sync();

// Rutas de la API - IMPORTANTE: estas deben definirse ANTES de la ruta catch-all
authRoutes(app);
userRoutes(app);

// Ruta simple para la API
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to node-jwt-auth application." });
});

// Ruta para el frontend (debe ir después de todas las rutas API)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});