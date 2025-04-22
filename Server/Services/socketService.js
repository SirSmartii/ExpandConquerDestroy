const http = require('http');
const socket = require('socket.io');
const express = require('express');
const fs = require("node:fs");
const path = require('path'); // Importiere das path-Modul

const app = express();
const server = http.createServer(app);
global.io = socket(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html')); // Korrigierter Pfad
});
app.use('/Client', express.static(path.join(__dirname, '../../Client'))); // Korrigierter Pfad

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server is running on port ' + port);
});

module.exports = { io, getSocket: () => socket };