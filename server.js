const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const appName = 'sistema-tesoreria'; // Asegúrate de que este nombre sea correcto

// --- CONFIGURACIÓN DEL PROXY ---
const apiProxy = createProxyMiddleware({
    target: 'https://comercial.devsbee.com',
    changeOrigin: true,
    logLevel: 'debug', 
});

// --- APLICAR EL PROXY A LA RUTA /api ---
// Todas las peticiones que empiecen con /api serán manejadas por el proxy.
app.use('/api', apiProxy);

// --- SERVIR LOS ARCHIVOS ESTÁTICOS DE ANGULAR ---
const distDir = path.join(__dirname, `dist/${appName}/browser`);
app.use(express.static(distDir));

// --- MANEJAR LAS RUTAS DE ANGULAR (MÉTODO CORREGIDO) ---
// Esta ruta debe ser la ÚLTIMA. Captura cualquier petición que no haya sido
// manejada por el proxy o por los archivos estáticos y la envía a index.html.
app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

// --- INICIAR EL SERVIDOR ---
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor de Angular con proxy iniciado en el puerto ${port}`);
    console.log(`Las peticiones a /api se redirigirán a https://comercial.devsbee.com`);
});