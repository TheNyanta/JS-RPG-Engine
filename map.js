function map(panorama, tileset, mapWidth, mapHeight, tileWidth, tileHeight, tilesX, tilesY, layer1, layer2, layer3, layerC) {
    
    // Panorama Image
    if (panorama != undefined) {
        this.panorama = new Image();
        this.panorama.src = panorama;
        // Panorama Properties
        this.x = 0;
        this.y = 0;    
        this.speedX = 0;
        this.speedY = 0;
    } 
    
    // Tileset Image
    this.tileset = new Image();
    this.tileset.src = tileset;    
    
    // Map Properties
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tilesX = tilesX;
    this.tilesY = tilesY;
    
    // Layers
    this.layer1 = layer1;
    this.layer2 = layer2;
    this.layer3 = layer3;
    this.layerC = layerC;
    
    this.updateBackground = function() {
        ctx = myGameArea.context;
        
        // Panorama
        if (this.panorama != undefined) {
            ctx.drawImage(this.panorama, this.x, this.y, myGameArea.canvas.width, myGameArea.canvas.height);
            // TODO: Moving background image, see https://www.w3schools.com/graphics/game_images.asp
            //ctx.drawImage(this.panorama, this.x + myGameArea.canvas.width, this.y, myGameArea.canvas.width, myGameArea.canvas.height);
        }
        
        //ctx.drawImage("image", "canvas x", "canvas y", "on canvas width", "on canvas height", "image x", "image y", "on image x", "on image y");
        
        // Layer 1: Ground + Layer 2: Map Objects on the ground
        var mapIndex = 0;
        var res, tile_w, tile_h;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                tile_w = w * this.tileWidth - gameCamera.x;
                tile_h = h * this.tileHeight - gameCamera.y;
                res = i2xy(this.layer1[mapIndex]-1, Math.max(this.tilesX, this.tilesY));
                ctx.drawImage(this.tileset, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);
                res = i2xy(this.layer2[mapIndex]-1, Math.max(this.tilesX, this.tilesY));
                ctx.drawImage(this.tileset, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);                
            }
        }
    }
    
    this.updateForeground = function() {
        ctx = myGameArea.context;
        
        // Layer 3: Part of the map that is above objects
        var mapIndex = 0;
        var res, tile_w, tile_h;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                tile_w = w * this.tileWidth - gameCamera.x;
                tile_h = h * this.tileHeight - gameCamera.y;
                res = i2xy(this.layer3[mapIndex]-1, Math.max(this.tilesX, this.tilesY));
                ctx.drawImage(this.tileset, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);                
            }
        }
    }
    
}