// app/models/index.js
import { Sequelize } from "sequelize";
import { DB_CONFIG } from "../config/db.config.js";
import userModel from "./user.model.js";
import roleModel from "./role.model.js";

const sequelize = new Sequelize(
  DB_CONFIG.DB,
  DB_CONFIG.USER,
  DB_CONFIG.PASSWORD,
  {
    host: DB_CONFIG.HOST,
    port: DB_CONFIG.PORT,
    dialect: DB_CONFIG.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: DB_CONFIG.pool.max,
      min: DB_CONFIG.pool.min,
      acquire: DB_CONFIG.pool.acquire,
      idle: DB_CONFIG.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);

// Definir relación muchos a muchos entre User y Role
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

// Cambiar esto para usar export default
export default db;