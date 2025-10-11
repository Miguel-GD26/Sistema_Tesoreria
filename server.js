const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const appName = 'sistema-tesoreria';

// --- CONFIGURACIÓN DEL PROXY (CORREGIDA) ---
const apiProxy = createProxyMiddleware({
    target: 'https://comercial.devsbee.com',
    changeOrigin: true,
    logLevel: 'debug',
    /**
     * --- ¡CAMBIO CRUCIAL AQUÍ! ---
     * pathRewrite le dice al proxy cómo modificar la ruta antes de enviarla.
     * En este caso, le decimos que reemplace '^/api' con '/api'.
     * Esto parece redundante, pero efectivamente le dice al proxy:
     * "Usa '/api' para identificar qué peticiones redirigir, pero NO lo quites de la URL final".
     */
    pathRewrite: {
        '^/api': '/api',
    },
});

// --- APLICAR EL PROXY A LA RUTA /api ---
app.use('/api', apiProxy);

// --- SERVIR LOS ARCHIVOS ESTÁTICOS DE ANGULAR ---
const distDir = path.join(__dirname, `dist/${appName}/browser`);
app.use(express.static(distDir));

// --- MANEJAR LAS RUTAS DE ANGULAR ---
app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

// --- INICIAR EL SERVIDOR ---
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor de Angular con proxy iniciado en el puerto ${port}`);
    console.log(`Las peticiones a /api se redirigirán a https://comercial.devsbee.com`);
});