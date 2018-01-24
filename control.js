// TODO: Would be nice to make the structure nicer - the way how you add different types of control like keyboard input, mouse-click, npc-follow
/**
* attach it to a component to add control: Keyboard Control, Following, Mouse Control, [TODO: Physics(Gravity & Bouncing)]
* @param target
*/
function control(target, up, down, left, right, followee) {
    this.target = target;
    // Key Control Properties
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    
    // Follow Properties
    this.followee = followee;
    this.doFollow = false;
    this.route;
    this.routeIndex;
    
    // Mouse/Touch move
    this.swipMove = false;
    
    // Goto Click
    this.goto = false;
    
    // Gravity
    this.gravity = false;
    this.gravityX = 0.0;
    this.gravityY = 0.01;
    this.gravitySpeedX = 0;
    this.gravitySpeedY = 0;
    // Bounce
    this.bounce = false;
    this.bounceX = 0.0;
    this.bounceY = 0.0;
    
    this.update = function() {
        if (this.target != undefined) {
            // Key Control: Else if for 4-direction movement
            if (myGameArea.keys) {
                if (myGameArea.keys[this.up])
                    this.target.speedY = -this.target.speed;
                else if (myGameArea.keys[this.down])
                    this.target.speedY = this.target.speed;
                else if (myGameArea.keys[this.left])
                    this.target.speedX = -this.target.speed;
                else if (myGameArea.keys[this.right])
                    this.target.speedX = this.target.speed;
            }
        }
        if (this.followee != undefined)
            if (this.doFollow)
                this.follow();
        
        if (this.gravity) {
            this.gravitySpeedX += this.gravityX;
            this.gravitySpeedY += this.gravityY;
            this.target.speedX += this.gravitySpeedX;
            this.target.speedY += this.gravitySpeedY;
        }
        
        if (this.swipMove && myGameArea.mousedown) {
            this.gestureMove();
        }
        
        if (this.goto && myGameArea.clicked) {
            this.gotoClick();
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
    
    // Follow a given object
    this.follow = function() {
        // No collision: Take direct route
        if (this.target.walkthrough) {
            if (Math.floor((this.target.x+4)/16) < Math.floor((this.followee.x+4)/16))
                this.target.speedX = this.target.speed;
            else if (Math.floor((this.target.x+4)/16) > Math.floor((this.followee.x+4)/16))
                this.target.speedX = -this.target.speed;
            else if (Math.floor((this.target.y+16)/16) < Math.floor((this.followee.y+16)/16))
                this.target.speedY = this.target.speed;
            else if (Math.floor((this.target.y+16)/16) > Math.floor((this.followee.y+16)/16)) 
                this.target.speedY = -this.target.speed;
        }
        // Map collision: Take astar route
        else {
            if (this.route != undefined) {
                if (this.route.length != 0) {
                    if (Math.floor((this.target.x+4)/16) < this.route[this.routeIndex].x)
                        this.target.speedX = this.target.speed;
                    if (Math.floor((this.target.x+4)/16) > this.route[this.routeIndex].x)
                        this.target.speedX -= this.target.speed;
                    if (Math.floor((this.target.y+16)/16) < this.route[this.routeIndex].y)
                        this.target.speedY = this.target.speed;
                    if (Math.floor((this.target.y+16)/16) > this.route[this.routeIndex].y) 
                        this.target.speedY = -this.target.speed;
                    
                    // Increase routeIndex to follow the given path until the destination is reached 
                    if (Math.floor((this.target.x+4)/16) == this.route[this.routeIndex].x && Math.floor((this.target.y+16)/16) == this.route[this.routeIndex].y) {
                        if (this.route.length > this.routeIndex) {
                            this.routeIndex++;
                        }
                    }
                }
            }
            // Update route
            this.route = astarPath(Math.floor((this.target.x+4)/16), Math.floor((this.target.y+16)/16), Math.floor((this.followee.x+4)/16), Math.floor((this.followee.y+16)/16));
            this.routeIndex = 0;        
        }
    }
    
    this.gestureMove = function() {
        if (Math.abs(myGameArea.x - myGameArea.clickdownX) > Math.abs(myGameArea.y - myGameArea.clickdownY)) {
            if (myGameArea.x < myGameArea.clickdownX - 4)
                target.speedX -= target.speed;
            else if (myGameArea.x > myGameArea.clickdownX + 4)
                target.speedX += target.speed;
        }
        else {
            if (myGameArea.y < myGameArea.clickdownY - 4)
                target.speedY -= target.speed;
            else if (myGameArea.y > myGameArea.clickdownY + 4) 
                target.speedY += target.speed;
        }
    }
    
    this.gotoClick = function() {
        // Create routet
        if (this.route == undefined) {
            this.route = astarPath(Math.floor((this.target.x+4)/16), Math.floor((this.target.y+16)/16), Math.floor((myGameArea.clickdownX+gameCamera.x)/16), Math.floor((myGameArea.clickdownY+gameCamera.y)/16));
            this.routeIndex = 0;
        }
        // Go route
        if (this.route.length != 0) {
            if (Math.floor((this.target.x+4)/16) < this.route[this.routeIndex].x)
                this.target.speedX = this.target.speed;
            if (Math.floor((this.target.x+4)/16) > this.route[this.routeIndex].x)
                this.target.speedX -= this.target.speed;
            if (Math.floor((this.target.y+16)/16) < this.route[this.routeIndex].y)
                this.target.speedY = this.target.speed;
            if (Math.floor((this.target.y+16)/16) > this.route[this.routeIndex].y) 
                this.target.speedY = -this.target.speed;
            // Increase routeIndex to follow the given path until the destination is reached 
            if (Math.floor((this.target.x+4)/16) == this.route[this.routeIndex].x && Math.floor((this.target.y+16)/16) == this.route[this.routeIndex].y) {
                if (this.route.length - 1> this.routeIndex) {
                    this.routeIndex++;
                }
                else {
                    //console.log("Finished");
                    this.route = undefined;
                    myGameArea.clickdownX = undefined;
                    myGameArea.clickdownY = undefined;
                    myGameArea.clicked = false;
                }
            }
        }
        else {
            //console.log("Not Reachable");
            this.route = undefined;
            myGameArea.clickdownX = undefined;
            myGameArea.clickdownY = undefined;
            myGameArea.clicked = false;
        }
        if (this.target.collided) {
            //console.log("Collided");
            this.route = undefined;
            myGameArea.clickdownX = undefined;
            myGameArea.clickdownY = undefined;
            myGameArea.clicked = false;
        }
        
    }
    
    /*
    //this.hitStatic = function() {...}
    
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeedY = -(this.gravitySpeedY * this.bounceY);
        }
        if (this.y == rockbottom) {
            this.midair = false;
        }
    }
    */
}