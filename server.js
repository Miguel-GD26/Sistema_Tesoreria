const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware'); // <-- 1. Importamos el middleware de proxy

const app = express();
const appName = 'sistema-tesoreria';

// --- 2. CONFIGURACIÓN DEL PROXY ---
const targetApiUrl = 'https://comercial.devsbee.com';
const apiProxy = createProxyMiddleware('/api', {
    target: targetApiUrl,
    changeOrigin: true, // Fundamental para evitar errores de CORS
    pathRewrite: {
        // No necesitamos reescribir la ruta, ya que /api existe en el target
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] Redirigiendo ${req.method} a ${targetApiUrl}${proxyReq.path}`);
    }
});

// --- 3. APLICAMOS EL PROXY A LAS RUTAS /api ---
// Cualquier petición que empiece con /api será manejada por el proxy
app.use(apiProxy);

// --- 4. SERVIR LOS ARCHIVOS ESTÁTICOS DE ANGULAR ---
const distDir = path.join(__dirname, `dist/${appName}/browser`);
app.use(express.static(distDir));

// --- 5. MANEJAR LAS RUTAS DE ANGULAR (DEBE IR DESPUÉS DEL PROXY Y LOS ESTÁTICOS) ---
// Cualquier otra petición GET que no sea a /api se redirige al index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

// --- 6. INICIAR EL SERVIDOR ---
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor de Angular con proxy iniciado en el puerto ${port}`);
});