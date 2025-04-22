import { Game } from "../game.js"; // Importiere die Game-Klasse aus der game.js-Datei

export class Player{
    constructor(name, socketID) {
        this.id = -1; // Erzeuge eine neue ID für den Spieler
        this.name = name;
        this.socketID = socketID; // Socket-ID des Spielers
        this.color = 0xFF0000; // Standardfarbe (Rot)
        this.territorySize = 0; // Standardgröße des Territoriums
        this.isAlive = false; // Standardmäßig ist der Spieler am Leben
        this.gold = 50; // Gold des Spielers
        this.iron = 0; // Eisen des Spielers
        this.stone = 0; // Stein des Spielers
        this.growthStyle = 3; // Wachstumsstil des Spielers
    }

    getGrowthStyle() {
        return this.growthStyle; // Gib den Wachstumsstil des Spielers zurück
    }

    getSocketID() {
        return this.socketID; // Gib die Socket-ID des Spielers zurück
    }

    updateTerritorySize(size) {
        this.territorySize = size; // Aktualisiere die Größe des Territoriums
    }

    getTerritorySize() {
        return this.territorySize; // Gib die Größe des Territoriums zurück
    }

    getGold(){
        return this.gold; // Gib die Goldressourcen des Spielers zurück
    }

    getIron(){
        return this.iron; // Gib die Eisenressourcen des Spielers zurück
    }

    getStone(){
        return this.stone; // Gib die Steinressourcen des Spielers zurück
    }

    addGold(amount) {
        this.gold += amount; // Füge Gold zu den Ressourcen des Spielers hinzu
    }

    addIron(amount) {
        this.iron += amount; // Füge Eisen zu den Ressourcen des Spielers hinzu
    }

    addStone(amount) {
        this.stone += amount; // Füge Stein zu den Ressourcen des Spielers hinzu
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount; // Ziehe Gold von den Ressourcen des Spielers ab
            return true; // Rückgabe true, wenn genug Gold vorhanden ist
        } else {
            return false; // Rückgabe false, wenn nicht genug Gold vorhanden ist
        }
    }

    spendIron(amount) {
        if (this.iron >= amount) {
            this.iron -= amount; // Ziehe Eisen von den Ressourcen des Spielers ab
            return true; // Rückgabe true, wenn genug Eisen vorhanden ist
        } else {
            return false; // Rückgabe false, wenn nicht genug Eisen vorhanden ist
        }
    }

    spendStone(amount) {
        if (this.stone >= amount) {
            this.stone -= amount; // Ziehe Stein von den Ressourcen des Spielers ab
            return true; // Rückgabe true, wenn genug Stein vorhanden ist
        } else {
            return false; // Rückgabe false, wenn nicht genug Stein vorhanden ist
        }
    }



    
    checkIsAlive() {
        return this.isAlive; // Gib zurück, ob der Spieler am Leben ist
    }

    kill() {
        this.isAlive = false; // Setze den Spieler auf tot
    }

    resetPlayer() {
        this.score = 0; // Setze die Punktzahl zurück
        this.territorySize = 0; // Setze die Größe des Territoriums zurück
        this.isAlive = true; // Setze den Spieler auf lebendig
        this.resources = {gold: 0, iron: 0, stone: 0}; // Setze die Ressourcen zurück
    }
    
    getName() {
        return this.name; // Gib den Namen des Spielers zurück
    }

    setName(name) {
        this.name = name; // Setze den Namen des Spielers
    }

    getID() {
        return this.id; // Gib die ID des Spielers zurück
    }

    setID(id) {
        this.id = id; // Setze die ID des Spielers
    }

    getColor() {
        return this.color; // Gib die Farbe des Spielers zurück
    }

    setColor(color) {
        this.color = color; // Setze die Farbe des Spielers
    }

    getInfos() {
        return {
            id: this.id,
            name: this.name,
            socketID: this.socketID,
            color: this.color,
            territorySize: this.territorySize,
            isAlive: this.isAlive,
            resources: this.resources
        }; // Gib die Informationen des Spielers zurück
    }
}