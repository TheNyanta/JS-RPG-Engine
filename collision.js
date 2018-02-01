/**
* attach it to a component to add collision: "rectangle-rectangle collision"
* @param target
* @param x-position relative to image
* @param y-position relative to image
* @param width
* @param height
*/
function collision(target, x, y, width, height) {
    // Standard Properties of any component
    this.target = target;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    // Debugging Map Collision
    this.rect1 = new component(); this.rect1.rectangle(16, 16, "black", false, "blue", true);
    this.rect2 = new component(); this.rect2.rectangle(16, 16, "black", false, "blue", true);
    this.rect3 = new component(); this.rect3.rectangle(16, 16, "black", false, "blue", true);
    this.rect4 = new component(); this.rect4.rectangle(16, 16, "black", false, "blue", true);
    
    this.draw = function() {
        this.rect1.draw();
        this.rect2.draw();
        this.rect3.draw();
        this.rect4.draw();
    }
    
    // Only for width/height=16: => with tile-height/width=16 only max 4 tiles to stand on; TODO: Adept for all sizes
    this.isMapWalkable = function() {
        if (this.target.walkthrough) return true;
        
        var x1 = Math.floor((this.x+this.target.x+this.target.speedX)/16);
        var y1 = Math.floor((this.y+this.target.y+this.target.speedY)/16);
        var x2 = x1 + 1;
        var y2 = y1 + 1;
        
        // Check if standing exactly on a tile-axis; tolarance=0.1
        if (Math.abs(x1-(this.x+this.target.x+this.target.speedX)/16) < 0.1) x2 = x1;
        if (Math.abs(y1-(this.y+this.target.y+this.target.speedY)/16) < 0.1) y2 = y1;
        
        this.rect1.x = x1*16-gameCamera.x; this.rect1.y = y1*16-gameCamera.y;
        this.rect2.x = x1*16-gameCamera.x; this.rect2.y = y2*16-gameCamera.y;
        this.rect3.x = x2*16-gameCamera.x; this.rect3.y = y1*16-gameCamera.y;
        this.rect4.x = x2*16-gameCamera.x; this.rect4.y = y2*16-gameCamera.y;
        
        // Check map borders
        if (x1 < 0 || y1 < 0 || x2 > maps[mapID].mapWidth - 1 || y2 > maps[mapID].mapHeight - 1)
            return false;
        
        if (maps[mapID].layerC[xy2i(x1,y1,maps[mapID].mapWidth)]) this.rect1.outlineColor = "blue"; else this.rect1.outlineColor = "red";
        if (maps[mapID].layerC[xy2i(x1,y2,maps[mapID].mapWidth)]) this.rect2.outlineColor = "blue"; else this.rect2.outlineColor = "red";
        if (maps[mapID].layerC[xy2i(x2,y1,maps[mapID].mapWidth)]) this.rect3.outlineColor = "blue"; else this.rect3.outlineColor = "red";
        if (maps[mapID].layerC[xy2i(x2,y2,maps[mapID].mapWidth)]) this.rect4.outlineColor = "blue"; else this.rect4.outlineColor = "red";
        
        return (maps[mapID].layerC[xy2i(x1,y1,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x1,y2,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x2,y1,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x2,y2,maps[mapID].mapWidth)]);
    }
    
    // Map Collision Resolver
    // [TODO: Check if there is no collision between the old and the new position (only happens if moving really fast!)]
    this.mapCollsion = function() {
        // Half the move distance and check again
        if(!this.isMapWalkable()) {
            this.target.speedX /= 2;
            this.target.speedY /= 2;
        }
        // Collision even with component moves only half way
        if (!this.isMapWalkable()) {
            this.target.isFacing();
            this.target.speedX = 0;
            this.target.speedY = 0;
            this.target.collided = true;
        }
        else this.target.collided = false;
    }
    
    // Object Collision Resolver
    // Use maps tile width & height for collision
    this.crashWith = function(otherobj, x2, y2) {
        if (this.walkthrough) return false;
        if (otherobj.walkthrough) return false;
        
        var myleft = this.x + x2;
        var myright = this.x + x2 + (this.width);
        if (this.type == "sprite") myright = this.x +x2 + 16;
        var mytop = this.y + y2;
        var mybottom = this.y + y2 + (this.height);
        if (this.type == "sprite") mybottom = this.y +y2 + 16;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        if (this.type == "sprite") otherright = otherobj.x + 16;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        if (this.type == "sprite") otherbottom = otherobj.y + 16;
        var crash = true;
        if ((mybottom <= othertop) ||
               (mytop >= otherbottom) ||
               (myright <= otherleft) ||
               (myleft >= otherright)) {
           crash = false;
        }
        return crash;
    }
}