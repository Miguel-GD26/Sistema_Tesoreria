// server.js
const express = require('express');
const path = require('path');
const app = express();

// Define el nombre de la carpeta de distribución de Angular
const appName = 'sistema-tesoreria'; // Asegúrate que coincida con el nombre de tu proyecto

// Servir los archivos estáticos desde la carpeta de Angular compilada
app.use(express.static(path.join(__dirname, `dist/${appName}/browser`)));

// Para cualquier otra ruta, servir el archivo index.html (¡esto es clave para que las rutas de Angular funcionen!)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, `dist/${appName}/browser/index.html`));
});

// Iniciar el servidor en el puerto que Railway nos asigne
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});