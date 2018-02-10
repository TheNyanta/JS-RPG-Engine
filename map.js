function map(image, tileset, mapWidth, mapHeight, tileWidth, tileHeight, tilesX, tilesY) {
    
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
    
    // Map Layers
    this.layers = [[],[],[]];
    this.layerC = [];
    
    // "Cache" Map on an hidden canvas
    this.panorama = document.createElement('canvas');
    this.cgx1 = this.panorama.getContext("2d");
    
    this.background = document.createElement('canvas');
    this.cgx2 = this.background.getContext("2d");
    
    this.foreground = document.createElement('canvas');
    this.cgx3 = this.foreground.getContext("2d");
    
    this.background.width = this.mapWidth * this.tileWidth;
    this.background.height = this.mapHeight * this.tileHeight;
    
    this.foreground.width = this.mapWidth * this.tileWidth;
    this.foreground.height = this.mapHeight * this.tileHeight;
    
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
        
        // Create a components that represents each tile on the map
        var mapIndex = 0;
        var tile_w, tile_h;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                // Components position
                tile_w = w * this.tileWidth;
                tile_h = h * this.tileHeight;
                for (var i = 0; i < this.layers.length; i++) {
                    this.layers[i][mapIndex] = new component(tile_w, tile_h).sprite(tileset, this.tileWidth, this.tileHeight, this.tilesX, this.tilesY);
                    this.layers[i][mapIndex].static = true;
                }
            }
        }
        
        // Draw the tiles on the cached canvas'
        this.drawCache();
    }
    
    /**
    * Load layers into the the map
    * @param layer1 (background)
    * @param layer2 (background)
    * @param layer3 (foreground)
    * @param collision layer
    */
    this.loadLayers = function(l1, l2, l3, lc) {        
        var mapIndex = 0;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                // Layer 1: Background 1
                this.layers[0][mapIndex].sequence = l1[mapIndex]-1;
                // Layer 2: Background 2
                this.layers[1][mapIndex].sequence = l2[mapIndex]-1;
                // Layer 3: Foreground
                this.layers[2][mapIndex].sequence = l3[mapIndex]-1;
            }
        }
        // Collision Layer
        this.layerC = lc;
        
        // Draw the tiles on the cached canvas'
        this.drawCache();
    }
    
    /**
    * If the cached images need to be updated
    */
    this.drawCache = function() {
        this.cgx2.clearRect(0, 0, this.background.width, this.background.height);
        this.cgx3.clearRect(0, 0, this.foreground.width, this.foreground.height);
        // Assume all layers have the same size!
        for (var i = 0; i < this.layers[0].length; i++) {
            this.layers[0][i].draw(this.cgx2);
            this.layers[1][i].draw(this.cgx2);
            this.layers[2][i].draw(this.cgx3);
        }
    }
    
    /**
    * Draws the Panorama & the background of the map
    */
    this.drawBackground = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.panorama, 0, 0);
        ctx.drawImage(this.background, -gameCamera.x, -gameCamera.y);
        /*
        // To Draw animated tiles: sequence has to be an array and you have to set the components animationTime (i.e = 20)
        for (var i = 0; i < this.layer1.length; i++) {
            if (this.layers[0][i] != undefined) {
                if (this.layers[0][i].sequence != undefined)
                    if (this.layers[0][i].sequence.length != undefined)
                        this.layers[0][i].draw(ctx);            
            }
        }*/
    }
    
    /**
    * Draws the foreground of the map
    */
    this.drawForeground = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.foreground, -gameCamera.x, -gameCamera.y);
    }      
}