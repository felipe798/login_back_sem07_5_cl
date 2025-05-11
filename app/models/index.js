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
        rejectUnauthorized: false // Necesario para algunas configuraciones de Render
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