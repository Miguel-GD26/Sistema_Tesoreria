const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/sistema-tesoreria')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/sistema-tesoreria/index.html'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});