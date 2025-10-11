const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const appName = 'sistema-tesoreria'; // Asegúrate que este nombre sea correcto

// --- CONFIGURACIÓN DEL PROXY (CORREGIDA) ---
const apiProxy = createProxyMiddleware({
    target: 'https://comercial.devsbee.com', // El destino de la API
    changeOrigin: true, // Necesario para evitar problemas de CORS y host
    // No necesitamos pathRewrite porque la ruta /api debe pasarse al target
    logLevel: 'debug', // Muestra logs detallados del proxy en la consola de Railway
});

// --- APLICAR EL PROXY A LA RUTA /api ---
// Todas las peticiones que empiecen con /api serán manejadas por el proxy.
// ESTO DEBE IR ANTES DE SERVIR LOS ARCHIVOS ESTÁTICOS.
app.use('/api', apiProxy);

// --- SERVIR LOS ARCHIVOS ESTÁTICOS DE ANGULAR ---
const distDir = path.join(__dirname, `dist/${appName}/browser`);
app.use(express.static(distDir));

// --- MANEJAR LAS RUTAS DE ANGULAR ---
// Cualquier otra petición GET que no sea a /api se redirige al index.html
// Esto permite que el enrutador de Angular funcione correctamente.
app.get('/*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

// --- INICIAR EL SERVIDOR ---
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor de Angular con proxy iniciado en el puerto ${port}`);
    console.log(`Las peticiones a /api se redirigirán a https://comercial.devsbee.com`);
});