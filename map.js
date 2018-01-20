function map(chipset, mapWidth, mapHeight, x, y, tileWidth, tileHeight, spritesX, spritesY, layer1, layer2, layer3, layerC) {
    // Standard Properties
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;
    
    // Map Image
    this.image = new Image();
    this.image.src = chipset;
    
    // Map Properties
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.spritesX = spritesX;
    this.spritesY = spritesY;
    
    // Layers
    this.layer1 = layer1;
    this.layer2 = layer2;
    this.layer3 = layer3;
    this.layerC = layerC;
    
    this.updateBackground = function() {
        ctx = myGameArea.context;
        
        //ctx.drawImage("image", "canvas x", "canvas y", "on canvas width", "on canvas height", "image x", "image y", "on image x", "on image y");
        
        var mapIndex = 0;
        var res, tile_w, tile_h;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                tile_w = w * this.tileWidth - gameCamera.x;
                tile_h = h * this.tileHeight - gameCamera.y;
                res = i2xy(this.layer1[mapIndex]-1, Math.max(this.spritesX, this.spritesY));
                ctx.drawImage(this.image, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);
                res = i2xy(this.layer2[mapIndex]-1, Math.max(this.spritesX, this.spritesY));
                ctx.drawImage(this.image, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);                
            }
        }
    }
    
    this.updateForeground = function() {
        ctx = myGameArea.context;
        
        //ctx.drawImage("image", "canvas x", "canvas y", "on canvas width", "on canvas height", "image x", "image y", "on image x", "on image y");
        
        var mapIndex = 0;
        var res, tile_w, tile_h;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                tile_w = w * this.tileWidth - gameCamera.x;
                tile_h = h * this.tileHeight - gameCamera.y;
                res = i2xy(this.layer3[mapIndex]-1, Math.max(this.spritesX, this.spritesY));
                ctx.drawImage(this.image, res[0]*this.tileWidth, res[1]*this.tileHeight, this.tileWidth, this.tileHeight, tile_w, tile_h, this.tileWidth, this.tileHeight);                
            }
        }
    }
    
    // Character can stand on atmost 4 different tiles, only returns true if all 4 are walkable
    this.isWalkable = function(param1, param2) {
        var x = (param1+gameCamera.x+ 4)/16;
        var y = (param2+gameCamera.y+16)/16;
        var x1 = Math.floor(x);
        var y1 = Math.floor(y);
        var x2 = x1 + 1;
        var y2 = y1 + 1;
        
        // Check if standing exactly on a tile-axis
        if (x1 - x == 0) x2 = x1;
        if (y1 - y == 0) y2 = y1;
        
        if (x1 < 0 || y1 < 0 || x2 > this.mapWidth - 1 || y2 > this.mapHeight - 1)
            return false;  
        
        return (this.layerC[xy2i(x1,y1,this.mapWidth)] && this.layerC[xy2i(x1,y2,this.mapWidth)] && this.layerC[xy2i(x2,y1,this.mapWidth)] && this.layerC[xy2i(x2,y2,this.mapWidth)]);
    }
}