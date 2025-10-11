const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const appName = 'sistema-tesoreria'; // Asegúrate que este nombre sea correcto

// --- CONFIGURACIÓN DEL PROXY ---
const apiProxy = createProxyMiddleware({
    target: 'https://comercial.devsbee.com',
    changeOrigin: true,
    logLevel: 'debug', 
});

// --- APLICAR EL PROXY A LA RUTA /api ---
// ESTO DEBE IR ANTES DE SERVIR LOS ARCHIVOS ESTÁTICOS.
app.use('/api', apiProxy);

// --- SERVIR LOS ARCHIVOS ESTÁTICOS DE ANGULAR ---
const distDir = path.join(__dirname, `dist/${appName}/browser`);
app.use(express.static(distDir));

// --- MANEJAR LAS RUTAS DE ANGULAR (CORREGIDO) ---
// Cualquier otra petición GET que no sea a /api o un archivo estático,
// debe ser manejada por Angular.
// CAMBIO: Usamos '*' en lugar de '/*'.
app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

// --- INICIAR EL SERVIDOR ---
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor de Angular con proxy iniciado en el puerto ${port}`);
    console.log(`Las peticiones a /api se redirigirán a https://comercial.devsbee.com`);
});