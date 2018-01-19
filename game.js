function startGame() {    
    InitalizeAnimationCounters();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        //this.canvas.style.cursor = "none"; //hide the original cursor
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(function() {
            ResetAnimationCounter();
            updateGameArea();
        }, 20);
        this.frameNo = 0;
        
        // Add Listeners for user inputs       
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
        window.addEventListener('mousedown', function (e) {
            myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
        })
        window.addEventListener('mousemove', function (e) {
            //myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            //myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchstart', function (e) {
            myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchend', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
        })
        window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].screenX;
            myGameArea.y = e.touches[0].screenY;
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}


// Update Canvas
function updateGameArea() {
    //myGameArea.clear();
    myGameArea.frameNo += 1;
    
    // Move character: Else if for 4-direction movement
    if (myGameArea.keys && (myGameArea.keys[KEY_LEFT] || myGameArea.keys[KEY_A])) {
        character.speedX = -character.speed;
        character.direction = DIR_W;
    }
    else if (myGameArea.keys && (myGameArea.keys[KEY_RIGHT] || myGameArea.keys[KEY_D])) {
        character.speedX = character.speed;
        character.direction = DIR_E;
    }
    else if (myGameArea.keys && (myGameArea.keys[KEY_UP] || myGameArea.keys[KEY_W])) {
        character.speedY = -character.speed;
        character.direction = DIR_N;
    }
    else if (myGameArea.keys && (myGameArea.keys[KEY_DOWN] || myGameArea.keys[KEY_S])) {
        character.speedY = character.speed;
        character.direction = DIR_S;
    }
    
    if (myGameArea.x && myGameArea.y) {
        if (character.clicked()) {
            console.log("click down");
            //character.x = myGameArea.x;
        }
        /*
        if (myUpBtn.clicked()) {
            character.speedY = -character.speed;
            character.direction = DIR_N;
        }
        else if (myDownBtn.clicked()) {
            character.speedY = character.speed;
            character.direction = DIR_S;
        }
        else if (myLeftBtn.clicked()) {
            character.speedX = -character.speed;
            character.direction = DIR_W;
        }
        else if (myRightBtn.clicked()) {
            character.speedX = character.speed;
            character.direction = DIR_E;
        }*/
    }
    
    // Map Collision Resolver
    // TODO: Check if there is no collision between the old and the new position (happens if moving too fast!)
    if(!maps[mapID].isWalkable(character.x-gameCamera.x+character.speedX, character.y-gameCamera.y+character.speedY)) {
        character.speedX /= 2;
        character.speedY /= 2;
    }
    //character.speedX = Math.ceil(character.speedX);
    //character.speedY = Math.ceil(character.speedY);
    if (!maps[mapID].isWalkable(character.x-gameCamera.x+character.speedX, character.y-gameCamera.y+character.speedY)) {
        character.speedX = 0;
        character.speedY = 0;
    }
    
    // Animation
    if (character.isMoving()){
        if (character.direction == DIR_W) character.sequence = [36,37,38];
        if (character.direction == DIR_E) character.sequence = [12,13,14];    
        if (character.direction == DIR_N) character.sequence = [0,1,2];
        if (character.direction == DIR_S) character.sequence = [24,25,26];
    }
    else {
        if (character.direction == DIR_W) character.sequence = 37;
        if (character.direction == DIR_E) character.sequence = 13;    
        if (character.direction == DIR_N) character.sequence = 1;
        if (character.direction == DIR_S) character.sequence = 25;
    }
    
    if (myGameArea.keys && myGameArea.keys[KEY_DOWN] && myGameArea.keys[KEY_SHIFT])
        gameCamera.y++;
    if (myGameArea.keys && myGameArea.keys[KEY_UP] && myGameArea.keys[KEY_SHIFT])
        gameCamera.y--;
    if (myGameArea.keys && myGameArea.keys[KEY_RIGHT] && myGameArea.keys[KEY_SHIFT])
        gameCamera.x++;
    if (myGameArea.keys && myGameArea.keys[KEY_LEFT] && myGameArea.keys[KEY_SHIFT])
        gameCamera.x--;
    
    /*
    if (character.crashWith(myObstacle)) {
        //console.log("Crash");
        if (character.speedX > 0) character.speedX = -3;
        else if (character.speedX < 0) character.speedX = 3;
    }
    
    if (character.crashWith(redBlock)) {
        if (character.speedX > 0) redBlock.speedX = 3;
        else if (character.speedX < 0) redBlock.speedX = -3;
        if (character.speedY > 0) redBlock.speedY = 3;
        else if (character.speedY < 0) redBlock.speedY = -3;
    }*/
    //if (myGameArea.frameNo == 1 || everyinterval(2)) // FOR map rendering only render the part where something changes
    
    background.update();
    
    maps[mapID].updateBackground();
    character.update();
    
    cat.update();
    
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    
    
    maps[mapID].updateForeground();
    
    gameCamera.update();
    
    
    // Control Buttons
    /*
    myUpBtn.update();        
    myDownBtn.update();        
    myLeftBtn.update();        
    myRightBtn.update();
    */
    
    
    // Cursor
    if(myGameArea.x && myGameArea.y) {        
        cursor.x = myGameArea.x;
        cursor.y = myGameArea.y;
        cursor.update();
    }

}