import { Player } from "./player.js"; // Importiere die Player-Klasse

export class PlayerManager {
    constructor() {
        this.players = {}; // Map zur Speicherung der Spieler
    }

    // Spieler hinzufügen und entfernen
    addPlayer(socketID, name = "default") {
        if (this.players[socketID]) {
            console.log("Player already exists"); // Fehler werfen, wenn der Spieler bereits existiert
        }
        const player = new Player(name, socketID); // Erstelle einen neuen Spieler
        player.setID(this.getNextPlayerId()); // Weise eine neue ID zu
        player.setColor(this.getRandomUnusedColor()); // Weise eine zufällige Farbe zu
        this.players[socketID] = player; // Füge den Spieler zur Map hinzu
    }

    removePlayer(socketID) {
        delete this.players[socketID]; // Entferne den Spieler aus der Map
        console.log("Player removed: " + socketID); // Gebe eine Nachricht aus, dass der Spieler entfernt wurde
    }

    // Spieler abrufen
    getPlayer(socketID) {
        if (this.players[socketID]) {
            return this.players[socketID]; // Gib den Spieler zurück, wenn er existiert
        } else {
            return null;
        }
    }

    getAllPlayers() {
        return Object.values(this.players); // Gib alle Spieler zurück
    }

    getPlayerId(socketID) {
        if (this.players[socketID]) {
            return this.players[socketID].getID(); // Gib die ID des Spielers zurück, wenn er existiert
        }
    }

    getPlayerColor(socketID) {
        if (this.players[socketID]) {
            return this.players[socketID].getColor(); // Gib die Farbe des Spielers zurück, wenn er existiert
        }
    }


    getPlayerById(playerId) {
        for (const player of Object.values(this.players)) {
            if (player.id === playerId) {
                return player; // Gib den Spieler zurück, wenn die ID übereinstimmt
            }
        }
        console.log("Player not found"); // Fehler werfen, wenn der Spieler nicht gefunden wird
        return null;
    }

    getPlayerBySocketId(socketID) {
        return this.players[socketID] || null; // Gib den Spieler zurück, wenn die Socket-ID übereinstimmt
    }

    getPlayerByName(name) {
        for (const player of Object.values(this.players)) {
            if (player.name === name) {
                return player; // Gib den Spieler zurück, wenn der Name übereinstimmt
            }
        }
        console.log("Player not found"); // Fehler werfen, wenn der Spieler nicht gefunden wird
        return null;
    }

    // Spielerlisten und Zähler
    getAllPlayers() {
        return Object.values(this.players); // Gib alle Spieler zurück
    }

    getPlayerCount() {
        return Object.keys(this.players).length; // Gib die Anzahl der Spieler zurück
    }

    // Hilfsmethoden
    getRandomUnusedColor() {
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF]; // Liste der verfügbaren Farben
        const usedColors = new Set(Object.values(this.players).map(player => player.color)); // Setze der verwendeten Farben
        const unusedColors = colors.filter(color => !usedColors.has(color)); // Filtere die nicht verwendeten Farben
        return unusedColors[Math.floor(Math.random() * unusedColors.length)]; // Gib eine zufällige nicht verwendete Farbe zurück
    }

    getNextPlayerId() {
        return Object.keys(this.players).length + 1; // Gib die nächste Spieler-ID zurück
    }

}