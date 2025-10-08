// server.js
const express = require('express');
const path = require('path');
const app = express();

// El nombre de tu app, que coincide con la carpeta en 'dist'
const appName = 'sistema-tesoreria';

// Servir archivos estáticos desde la carpeta 'browser' dentro de la carpeta de distribución
const distDir = path.join(__dirname, `dist/${appName}/browser`);
app.use(express.static(distDir));

// --- ESTA ES LA LÍNEA CORREGIDA ---
// En lugar de '/*', usamos una expresión regular que captura todo
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

// Iniciar el servidor en el puerto que Railway nos asigne
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor de la aplicación Angular iniciado en el puerto ${port}`);
});