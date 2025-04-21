const express = require('express');
const http = require('http');
const socketService = require('./Server/Services/socketService');
const { Game } = require('./Server/game.js');
const io = global.io;


let gameLoop = false;

const gridSize = 5;
let game = new Game(160, 120); // Erstelle ein neues Spiel mit 10x10 Spielfeld
io.on('connection', (socket) => {
    game.addPlayer("default",socket.id)

    let playerInfo = game.getPlayer(socket.id); // Hole die Spielerinformationen
    socket.emit('connected', { gridSize: gridSize, id: playerInfo.getID(), color: playerInfo.getColor() }); // Füge den Spieler hinzu und sende die ID zurück

    socket.on('game:attack', (data) => {
        try {
            game.setCellOwner(data.row, data.col, socket.id); // Setze den Besitzer der Zelle
            io.emit('game:cellUpdate', { row: data.row, col: data.col, OwnerID: game.getPlayer(socket.id).getID(), color: game.getPlayer(socket.id).getColor() }); // Sende die Aktualisierung an den Spieler
            console.log("PLAYERID: " + game.getPlayer(socket.id).getID() + "->> " + game.getPlayer(socket.id).getGold()); // Gebe die Ressourcen des Spielers aus
        }
        catch (error) {
            console.error(error.message); // Fehlerbehandlung
        }
    });

    if (!gameLoop) {
        gameLoop = true; // Setze die Spielschleife auf true
        setInterval(() => {
            game.Tick(); // Verdiene Ressourcen
            game.growTerritory(); // Wachsen des Territoriums
            //io.emit('game:resourceUpdate', { gold: game.getPlayer(socket.id).getGold(), iron: game.getPlayer(socket.id).getIron(), stone: game.getPlayer(socket.id).getStone() }); // Sende die Aktualisierung an den Spieler
            io.emit('game:territoryUpdate', (game.gameField)); // Sende die Aktualisierung an alle Spieler
        }, 1000); // Alle 1 Sekunde Ressourcen verdienen
    }

    socket.on('disconnect', () => {
        game.removePlayer(socket.id); // Entferne den Spieler aus dem Spiel
        if (game.getPlayerCount() < 2) {
            game.resetGame(); // Setze das Spiel zurück, wenn weniger als 2 Spieler vorhanden sind
        }; // Wenn weniger als 2 Spieler vorhanden sind, beende die Funktion
        //console.log('Player disconnected: ' + socket.id);
    });
});


