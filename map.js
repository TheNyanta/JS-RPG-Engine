function map(image, tileset, mapWidth, mapHeight, tileWidth, tileHeight, tilesX, tilesY, layer1, layer2, layer3, layerC) {
    
    // Panorama Image
    if (image != undefined) {
        this.image = new Image();
        this.image.src = image;
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
    
    // "Cache" Map on an hidden canvas
    this.panorama = document.createElement('canvas');
    this.cgx1 = this.panorama.getContext("2d");
    
    this.background = document.createElement('canvas');
    this.cgx2 = this.background.getContext("2d");
    
    this.foreground = document.createElement('canvas');
    this.cgx3 = this.foreground.getContext("2d");
    
    this.background.width = this.mapWidth * 16;
    this.background.height = this.mapHeight * 16;
    
    this.foreground.width = this.mapWidth * 16;
    this.foreground.height = this.mapHeight * 16;
    
    /**
    * Draws Panorama, Background and Foreground only 'one single time' on extra canvas
    * TODO: Maybe troublesome if all maps are initalized at the beginning instead init-on-demand?
    */
    this.init = function() {
        // Panorama
        if (this.image != undefined) {
            this.panorama.width = myGameArea.canvas.width;
            this.panorama.height = myGameArea.canvas.height;
            
            this.cgx1.drawImage(this.image, this.x, this.y, this.panorama.width, this.panorama.height);
            // TODO: Moving background image, see https://www.w3schools.com/graphics/game_images.asp
            //ctx.drawImage(this.image, this.x + myGameArea.canvas.width, this.y, myGameArea.canvas.width, myGameArea.canvas.height);
        }
        
        //ctx.drawImage("image", "canvas x", "canvas y", "on canvas width", "on canvas height", "image x", "image y", "on image x", "on image y");
        
        // Layer 1: Ground + Layer 2: Map Objects on the ground (i.E. stones, ...)
        var mapIndex = 0;
        var res, tile_w, tile_h;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                tile_w = w * this.tileWidth - gameCamera.x;
                tile_h = h * this.tileHeight - gameCamera.y;
                res = i2xy(this.layer1[mapIndex]-1, Math.max(this.tilesX, this.tilesY));
                this.cgx2.drawImage(this.tileset, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);
                res = i2xy(this.layer2[mapIndex]-1, Math.max(this.tilesX, this.tilesY));
                this.cgx2.drawImage(this.tileset, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);                
            }
        }
        
        // Layer 3: Part of the map that is above objects
        var mapIndex = 0;
        var res, tile_w, tile_h;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                tile_w = w * this.tileWidth - gameCamera.x;
                tile_h = h * this.tileHeight - gameCamera.y;
                res = i2xy(this.layer3[mapIndex]-1, Math.max(this.tilesX, this.tilesY));
                this.cgx3.drawImage(this.tileset, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);                
            }
        }
    }
    
    /**
    * Draws the Panorama & the background of the map
    */
    this.drawBackground = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.panorama, 0, 0);
        ctx.drawImage(this.background, -gameCamera.x, -gameCamera.y);
    }
    
    /**
    * Draws the foreground of the map
    */
    this.drawForeground = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.foreground, -gameCamera.x, -gameCamera.y);
    }      
}