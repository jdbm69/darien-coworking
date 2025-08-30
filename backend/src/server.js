// src/server.js
// Punto de entrada del backend. Levanta el servidor Express en el puerto configurado en .env

const app = require('./app');
const { testConnection } = require('./db');

const PORT = process.env.PORT || 3001;

// Funcion async para ver que levanto el servidor correctamente
(async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
})();