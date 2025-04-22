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
        }
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.gameField.length && col >= 0 && col < this.gameField[0].length;
    }
    

    updateGameField(newGameField) {
        if (this.players.size === 0) return;
    
        const rows = this.gameField.length;
        const cols = this.gameField[0].length;
    
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const currentCell = this.gameField[row][col];
                const newCell = newGameField[row][col];
    
                if (currentCell !== newCell) {
                    const ownerColor = this.players.get(newCell);
                    if (ownerColor) {
                        this.gameField[row][col] = newCell; // Aktualisiere die Zelle im Spielfeld
                        const box = new PIXI.Graphics()
                            .rect(0, 0, this.gridSize, this.gridSize)
                            .fill(ownerColor); // Färbe die Zelle mit der Farbe des Besitzers
                        box.x = row * this.gridSize;
                        box.y = col * this.gridSize;
                        this.app.stage.addChild(box); // Füge die Box zur Stage hinzu
                    } else {
                        console.error(`Owner color not found for cell (${row}, ${col})`);
                    }
                }
            }
        }
    }
    

    printGameField() {
        console.log(this.gameField.map(row => row.join(' ')).join('\n'));
    }

}