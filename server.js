const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const appName = 'sistema-tesoreria';

// --- CONFIGURACIÓN DEL PROXY (CON LÓGICA ALTERNATIVA) ---
const apiProxy = createProxyMiddleware({
    // CAMBIO 1: El target ahora incluye /api
    target: 'https://comercial.devsbee.com/api', 
    changeOrigin: true,
    logLevel: 'debug',
    // CAMBIO 2: pathRewrite ahora quita /api de la ruta
    pathRewrite: {
        '^/api': '', // Reemplaza /api con una cadena vacía
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
    console.log(`Las peticiones a /api se redirigirán a https://comercial.devsbee.com/api`);
});