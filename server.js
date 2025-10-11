const express = require('express');
const path = require('path');
const app = express();


const appName = 'sistema-tesoreria';

const distDir = path.join(__dirname, `dist/${appName}/browser`);
app.use(express.static(distDir));

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

// Iniciar el servidor en el puerto que Railway nos asigne
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor de la aplicación Angular iniciado en el puerto ${port}`);
});