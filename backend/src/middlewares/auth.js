// src/middleware/auth.js
// Middleware de autenticación por API Key. Rechaza las peticiones sin la cabecera correcta

module.exports = function apiKeyAuth(req, res, next) {
  const incoming = req.header('x-api-key');
  if (!incoming || incoming !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: invalid API key' });
  }
  next();
};