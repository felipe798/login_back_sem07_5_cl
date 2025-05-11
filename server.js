// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import bcrypt from "bcryptjs";

// Configurar dotenv
dotenv.config();

const app = express();

// Configuración de CORS dinámica basada en entorno
let corsOptions;
if (process.env.NODE_ENV === 'production') {
  // En producción, permite solicitudes desde tu frontend desplegado
  corsOptions = {
    origin: process.env.FRONTEND_URL || "https://react-jwt-auth-frontend.onrender.com",
    credentials: true
  };
} else {
  // En desarrollo, permite solicitudes desde localhost
  corsOptions = {
    origin: "http://localhost:5173" // Puerto por defecto de Vite
  };
}

app.use(cors(corsOptions));

// Parsear solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función para inicializar roles y usuario admin
async function initial() {
  try {
    // Verificar si los roles ya existen
    const count = await db.role.count();
    
    if (count === 0) {
      // Crear roles si no existen
      await db.role.create({
        id: 1,
        name: "user"
      });
      
      await db.role.create({
        id: 2,
        name: "moderator"
      });
      
      await db.role.create({
        id: 3,
        name: "admin"
      });
      
      console.log("Roles inicializados correctamente");
      
      // Crear usuario administrador inicial
      try {
        const adminUser = await db.user.create({
          username: "admin",
          email: "admin@example.com",
          password: bcrypt.hashSync("admin123", 8)
        });
        
        const adminRole = await db.role.findOne({
          where: { name: "admin" }
        });
        
        await adminUser.setRoles([adminRole]);
        console.log("Usuario administrador creado");
      } catch (userError) {
        // Si hay error al crear el usuario, puede que ya exista
        console.log("Error o usuario admin ya existe:", userError.message);
      }
    } else {
      console.log("Los roles ya están inicializados");
    }
  } catch (err) {
    console.log("Error al inicializar roles:", err);
  }
}

// Sincronizar base de datos y luego inicializar roles
db.sequelize.sync().then(() => {
  console.log("Base de datos sincronizada");
  initial();
}).catch(err => {
  console.error("Error al sincronizar la base de datos:", err);
});

// Rutas de la API
authRoutes(app);
userRoutes(app);

// Ruta simple para la API
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to node-jwt-auth application." });
});

// Ruta de prueba para comprobar que las rutas protegidas funcionan
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API test endpoint", 
    env: process.env.NODE_ENV,
    dbHost: process.env.DB_HOST
  });
});

// Manejar todas las rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    message: "Ruta no encontrada", 
    path: req.path 
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});