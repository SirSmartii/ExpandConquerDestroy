import { PlayerManager } from "./models/playerManager.js"; // Importiere die PlayerManager-Klasse

export class Game {
    constructor(rows = 10, cols = 10) {
        this.playerManager = new PlayerManager(); // Instanz von PlayerManager erstellen
        this.rows = rows; // Zeilenanzahl
        this.cols = cols; // Spaltenanzahl

        this.gameField = Array.from({ length: rows }, () => Array(cols).fill(0)); // 10x10 Spielfeld mit 0 initialisiert 
        console.log("Game created with dimensions: " + rows + "x" + cols);
    }

    intializeGame() {

    }

    updatePlayerScore() {
        Object.values(this.playerManager.getAllPlayers()).forEach(player => {
            player.updateTerritorySize(this.getPlayerCellCount(player.socketID)); // Aktualisiere die Größe des Territoriums
        });
    }

    addPlayer(socketID, name = "default") {
        if (this.playerManager.getPlayer(socketID)) {
            console.log("Player already exists"); // Fehler werfen, wenn der Spieler bereits existiert
        }
        this.playerManager.addPlayer(socketID, name); // Füge den Spieler zur Map hinzu
        return { id: this.playerManager.getPlayerId(socketID), color: this.playerManager.getPlayerColor(socketID) }; // Gib die SpielerID zurück
    }

    getPlayer(socketID) {
        if (this.playerManager.getPlayer(socketID)) {
            return this.playerManager.getPlayer(socketID); // Gib den Spieler zurück, wenn er existiert
        } else {
            console.log("Player not found"); // Fehler werfen, wenn der Spieler nicht gefunden wird
            return null;
        }
    }

    getPlayerCount() {
        return Object.keys(this.playerManager.getAllPlayers).length; // Gibt die Anzahl der Spieler zurück
    }

    getPlayerCellCount(socketID) {
        if (this.playerManager.getPlayer(socketID) !== null) {
            let count = 0;
            let playerID = this.playerManager.getPlayerId(socketID); // Hole die ID des Spielers
            for (let row = 0; row < this.gameField.length; row++) {
                for (let col = 0; col < this.gameField[0].length; col++) {
                    if (this.gameField[row][col] === playerID) {
                        count++;
                    }
                }
            }
            return count; // Gibt die Anzahl der Zellen zurück, die dem Spieler gehören
        }
        return 0; // Gibt 0 zurück, wenn der Spieler nicht existiert
    }

    Tick() {
        this.updatePlayerScore();
        this.playerManager.getAllPlayers().forEach(player => {
            if (player.getID() === -1) return; // Spieler existiert nicht
            player.addGold(player.getTerritorySize()); // Erhöhe die Menge der Ressource
        });
    }

    growTerritory() {
        const directions = [
            [-1, 0], // oben
            [1, 0],  // unten
            [0, -1], // links
            [0, 1]   // rechts
        ];

        const newGameField = this.gameField.map(row => [...row]);
        this.playerManager.getAllPlayers().forEach(player => {
            let growthTick = player.getGrowthStyle(); // Hole den Wachstumsstil des Spielers
            if (player.getID() === -1) return; // Spieler existiert nicht
            const playerID = player.getID(); // Assuming 'id' is a property of the player object
            let growthCount = 0; // Zähler für das Wachstum des Spielers
            if (player.getGold() <= growthTick * 3) { // Assuming 'resources' is an object with a 'gold' property
                growthTick = 0;
            }

            player.spendGold(growthTick * 3); // Deduct gold directly if 'spendResource' is not defined
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    if (this.gameField[row][col] === playerID) {
                        directions.forEach(([dRow, dCol]) => {
                            if (growthCount >= growthTick) return; // Begrenze das Wachstum
                            const newRow = row + dRow;
                            const newCol = col + dCol;

                            if (this.isValidCell(newRow, newCol) && this.gameField[newRow][newCol] === 0) {
                                newGameField[newRow][newCol] = playerID;
                                growthCount++; // Erhöhe den Zähler
                            }
                        });
                    }
                }
            }
        });

        this.gameField = newGameField;
    }

    removePlayer(socketID) {
        if (this.playerManager.getPlayer(socketID)) {
            this.playerManager.removePlayer(socketID); // Entferne den Spieler aus der Map
            const playerID = this.playerManager.getPlayerId(socketID); // Hole die ID des Spielers
            for (let row = 0; row < this.gameField.length; row++) {
                for (let col = 0; col < this.gameField[0].length; col++) {
                    if (this.gameField[row][col] == playerID) {
                        this.gameField[row][col] = 0; // Setze die Zelle auf 0, wenn der Spieler entfernt wird
                    }
                }
            }
            console.log("Player removed: " + socketID);
        }
        else {
            throw new Error("Player does not exist");
        }
    }

    /*removePlayer(socketID) {
        if (this.playerList[socketID]) {
            const playerID = this.playerList[socketID].id;
            delete this.playerList[socketID]; // Entferne den Spieler aus der Liste
            this.gameField.forEach(row => {
                row.forEach((cell, colIndex) => {
                    if (cell === playerID) {
                        row[colIndex] = 0; // Setze die Zelle auf 0, wenn der Spieler entfernt wird
                    }
                });
            });
            console.log("Player removed: " + socketID);
        }
        else {
            throw new Error("Player does not exist");
        }
    }*/

    setCellOwner(row, col, socketID) {
        if (this.isValidCell(row, col)) {
            const playerID = this.playerManager.getPlayerId(socketID); // Hole die ID des Spielers
            if(this.playerManager.getPlayer(socketID).isAlive === true) return; // Spieler ist tot{
            if (this.gameField[row][col] === 0) {
                this.gameField[row][col] = playerID; // Setze den Besitzer der Zelle
                console.log("Cell updated: " + row + ", " + col + " -> " + " PLAYER: " + this.gameField[row][col]);
                this.playerManager.getPlayer(socketID).isAlive = true; // Deduct gold directly if 'spendResource' is not defined
            }
        }
    }


    /*setCellOwner(row, col, socketID) {
        if (this.isValidCell(row, col)) {
            const playerID = this.playerList[socketID].id;
            if (this.gameField[row][col] != 0) {
                throw new Error("Cell already owned by another player");
            }
            this.gameField[row][col] = playerID; // Setze den Besitzer der Zelle
            console.log("Cell updated: " + row + ", " + col + " -> " + " PLAYER: " + this.gameField[row][col]);
        }
    }*/

    isValidCell(row, col) {
        return row >= 0 && row < this.gameField.length && col >= 0 && col < this.gameField[0].length;
    }

    resetGame() {
        this.gameField = Array.from({ length: this.gameField.length }, () => Array(this.gameField[0].length).fill(0)); // Setze das Spielfeld zurück
        console.log("Game reset");
    }
}