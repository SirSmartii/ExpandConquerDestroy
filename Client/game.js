export class Game {
    constructor(rows = 10, cols = 10, _app, _socket = null, _gridSize) {
        this.app = _app;
        this.socket = _socket;
        this.gridSize = _gridSize;
        this.gameField = Array.from({ length: rows }, () => Array(cols).fill(0));
        this.players = new Map(); // Map für Spieler erstellen
    }

    attack(row, col) {
        this.socket.emit("game:attack", { row: row, col: col }); // Sende die Attacke an den Server
    }

    setCellOwner(row, col, OwnerID, color) {
        if (this.isValidCell(row, col)) {
            this.players.set(OwnerID, color); // Setze die Farbe des Spielers
            this.gameField[row][col] = OwnerID; // Setze den Besitzer der Zelle
            //this.socket.emit("game:cellUpdate", { row, col, OwnerID }); // Sende die Aktualisierung an den Server
            let box = new PIXI.Graphics()
                .rect(0, 0, this.gridSize, this.gridSize) // Rechteck zeichnen
                .fill(color); // Rot
            box.x = row * this.gridSize; // Positioniere die Box im Raster
            box.y = col * this.gridSize; // Positioniere die Box im Raster
            this.app.stage.addChild(box); // Füge die Box zur Stage hinzu
        } else {
            throw new Error("Invalid cell coordinates");
        }
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.gameField.length && col >= 0 && col < this.gameField[0].length;
    }
    
    deltaUpdate(gameField) {
        
    }

    updateGameField(newGameField) {
        if(this.players.size === 0) {
            return;
        }
        for (let row = 0; row < this.gameField.length; row++) {
            for (let col = 0; col < this.gameField[0].length; col++) {
                if (this.gameField[row][col] !== newGameField[row][col]) {
                    this.setCellOwner(row, col, newGameField[row][col], this.players.get(newGameField[row][col])); // Aktualisiere die Zelle mit setCellOwner
                }
            }
        }
    }

    printGameField() {
        console.log(this.gameField.map(row => row.join(' ')).join('\n'));
    }

}