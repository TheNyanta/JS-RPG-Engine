// TODO: Would be nice to make the structure nicer - the way how you add different types of control like keyboard input, mouse-click, npc-follow

// TODO: Add goto a given position

// TODO: Maybe fuse into component.js

/**
* attach it to a component to add control: Following, Mouse Control -> goto click
* @param obj
*/
function control(obj) {
    this.obj = obj;
    
    // Follow Properties
    this.doFollow = false;
    this.route;
    this.routeIndex;
    
    // Mouse/Touch move
    this.swipMove = false;
    
    // Goto Click
    this.goto = false;
    
    this.finished = true;
    
    this.setTarget = function(target) {
        this.target = target;
        
        return this;
    }
    
    this.update = function() {
        if (this.target != undefined && this.doFollow) {
            this.destX = Math.floor((this.target.x+this.target.offset_x)/16);
            this.destY = Math.floor((this.target.y+this.target.offset_y)/16);
            this.follow();
        }
        
        if (this.swipMove && myGameArea.mousedown) {
            this.gestureMove();
        }
        
        if (this.goto) {
            if (myGameArea.clicked) {
                // Update new click only if finished
                if (this.finished) {
                    this.destX = Math.floor((myGameArea.clickdownX+gameCamera.x)/16);
                    this.destY = Math.floor((myGameArea.clickdownY+gameCamera.y)/16);
                    this.finished = false;
                }
                // Disable Key Control while going to obj
                obj.disableControls = true;
                
                this.gotoClick();
            }
            
        }
    }
    
    this.drawRoute = function() {
        if (this.rects)
            for (i = this.routeIndex; i < this.rects.length; i++) this.rects[i].draw(myGameArea.context);
    }
    
    // Follow a given object
    this.follow = function() {
        
        // No collision: Take direct route
        if (!this.obj.collidable) {
            this.directPath();
        }
        
        // Map collision: Take astar route
        else {
            if (!this.obj.componentCollision(this.target)) {
                // Create / Update route
                this.createRoute(this.destX, this.destY);
                
                // Follow the route
                this.followRoute();
            }                         
        }
    }
    
    // Go to a clicked position
    this.gotoClick = function() {
        // Create routet
        if (this.route == undefined) {
            this.createRoute(this.destX, this.destY);
        }
        
        // Follow the route
        this.followRoute();
        
        if (this.finished) {
            myGameArea.clicked = false; 
        }
    }
    
    this.directPath = function() {
        if (Math.floor((this.obj.x+this.obj.offset_x)/16) < Math.floor((this.target.x+this.target.offset_x)/16))
            this.obj.speedX = this.obj.speed;
        else if (Math.floor((this.obj.x+this.obj.offset_x)/16) > Math.floor((this.target.x+this.target.offset_x)/16))
            this.obj.speedX = -this.obj.speed;
        else if (Math.floor((this.obj.y+this.obj.offset_y)/16) < Math.floor((this.target.y+this.target.offset_y)/16))
            this.obj.speedY = this.obj.speed;
        else if (Math.floor((this.obj.y+this.obj.offset_y)/16) > Math.floor((this.target.y+this.target.offset_y)/16)) 
            this.obj.speedY = -this.obj.speed;
    }
    
    this.createRoute = function(x, y) {
        this.route = astarPath(Math.floor((this.obj.x+this.obj.offset_x)/16), Math.floor((this.obj.y+this.obj.offset_y)/16), x, y);
        this.routeIndex = 0;
    }
    
    this.followRoute = function() {
        if (this.route != undefined) {
            if (this.route.length != 0) {
               
                // else-if to prevent diagonal movement
                if (Math.floor((this.obj.x+this.obj.offset_x)/16) < this.route[this.routeIndex].x)
                    this.obj.speedX = this.obj.speed;
                else if (Math.floor((this.obj.x+this.obj.offset_x)/16) > this.route[this.routeIndex].x)
                    this.obj.speedX -= this.obj.speed;
                else if (Math.floor((this.obj.y+this.obj.offset_y)/16) < this.route[this.routeIndex].y)
                    this.obj.speedY = this.obj.speed;
                else if (Math.floor((this.obj.y+this.obj.offset_y)/16) > this.route[this.routeIndex].y)
                    this.obj.speedY = -this.obj.speed;    
                
                // To show the Path
                if (debug) {
                    this.rects = [];
                    for (i = 0; i < this.route.length; i++) this.rects[i] = new component(this.route[i].x * 16, this.route[i].y * 16).rectangle(16, 16, "black", false, "yellow", true);
                }
                
                // Increase routeIndex to follow the given path until the destination is reached    
                if ((Math.abs(this.route[this.routeIndex].x-((this.obj.x+this.obj.offset_x)/16)) < 1.0) && (Math.abs(this.route[this.routeIndex].y-((this.obj.y+this.obj.offset_y)/16)) < 1.0)) {
                    // Target not reached
                    if (this.route.length - 1 > this.routeIndex) {
                        this.routeIndex++;
                    }
                    // Target reached
                    else {
                        //console.log("Reached");
                        this.route = undefined;
                        this.rects = undefined;
                        this.obj.disableControls = false;
                        this.finished = true;
                    }
                }
            }
            // Not reachable
            else {
                //console.log("Not reachable!")
                this.route = undefined;
                this.rects = undefined;
                this.obj.disableControls = false;
                this.finished = true;
            }
            if (this.obj.collided) {
                //console.log("Collided");
                this.route = undefined;
                this.obj.disableControls = false;
                this.rects = undefined;
                this.finished = true;
            }
        }
    }
    
    // ###############################################
    // ### Doesn't works so well with tablet touch ###
    // ###############################################
    
    this.gestureMove = function() {
        if (Math.abs(myGameArea.x - myGameArea.clickdownX) > Math.abs(myGameArea.y - myGameArea.clickdownY)) {
            if (myGameArea.x < myGameArea.clickdownX - 4)
                obj.speedX -= obj.speed;
            else if (myGameArea.x > myGameArea.clickdownX + 4)
                obj.speedX += obj.speed;
        }
        else {
            if (myGameArea.y < myGameArea.clickdownY - 4)
                obj.speedY -= obj.speed;
            else if (myGameArea.y > myGameArea.clickdownY + 4) 
                obj.speedY += obj.speed;
        }
    }
    
    this.drawSwip = function() {
        if (myGameArea.mousedown) {
            ctx = myGameArea.context;
            ctx.beginPath();
            ctx.arc(myGameArea.clickdownX, myGameArea.clickdownY, 5, 0, 2 * Math.PI, true);
            ctx.arc(myGameArea.x, myGameArea.y, 5, 0, 2 * Math.PI, true);
            // Fill
            ctx.fillStyle = "black";
            ctx.fill();
            // Outline
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
}