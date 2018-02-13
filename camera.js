function camera(x, y) {
    this.x = x;
    this.y = y;
    
    this.setTarget = function(target) {
        this.target = target;
        return this;
    }
    
    this.update = function() {
        // Follow target
        if (this.target != undefined) {
            this.x = this.target.x - myGameArea.canvas.width/2;
            this.y = this.target.y - myGameArea.canvas.height/2;
        }
        // Keep camera view inside the map
        if (this.x < 0)
            this.x = 0;
        if (this.x > maps[mapID].mapWidth * maps[mapID].tileWidth-myGameArea.canvas.width)
            this.x = maps[mapID].mapWidth * maps[mapID].tileWidth-myGameArea.canvas.width;
        if (this.y < 0)
            this.y = 0;
        if (this.y > maps[mapID].mapHeight * maps[mapID].tileHeight-myGameArea.canvas.height)
            this.y = maps[mapID].mapHeight * maps[mapID].tileHeight-myGameArea.canvas.height;
        // Camera 0 if map smaller than canvas
        if (maps[mapID].mapWidth * maps[mapID].tileWidth-myGameArea.canvas.width < 0)
            this.x = 0;
        if (maps[mapID].mapHeight * maps[mapID].tileHeight-myGameArea.canvas.height < 0)
            this.y = 0;
        
    }
}