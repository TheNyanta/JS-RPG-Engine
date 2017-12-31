function gameEvents() {
    // Draw dialogText if chatSequence is true
    if(chatSequence){
        DrawDialog(dialogText, undefined, true);
    }
    
    
    // Events on input
    if (key.enter) {
        /*
        chatSequence = true;
        dialogText = "This is a chat sequence!";
        setTimeout(function() { dialogText = "You can't move while it runs!"; }, 2000);
        setTimeout(function() { chatSequence = false;}, 4000);
        */
    }
    
    if (key.esc) {
        EnableScrollbar();
    }
    
    if (key.key1) {
        mapID = 0;
    }
    
    if (key.key2) {
        mapID = 1;
    }
    
    if (key.key3) {
        console.log("Cookies: "+ document.cookie);
    }
    
    if (key.key4) {
        SaveGamestate();        
    }
    
    if (key.key5) {
        LoadGamestate();
    }
    
    if (key.key6) {
    }
        
    if (key.key0) {
        
    }    
    
    if (key.plus) {
        speed+=1;
        if (speed > 16) {
            speed = 16;
        }
    }
    
    if (key.minus) {
        speed-=1;
        if (speed < 1) {
            speed = 1;
        }
    }
    
    if (key.o) {
        // Char Tile position
        console.log("Standing on Tile["+ Math.floor((cameraX[mapID]+relativeX[mapID]+4)/16) +","+ Math.floor((cameraY[mapID]+relativeY[mapID]+16)/16) +"]");
    }
    
    if (key.p) {
        // Position debug
        console.log("charX=" +Math.floor(charX[mapID])+", charY=" +Math.floor(charY[mapID]) +" | camX=" +cameraX[mapID] +", camY=" + cameraY[mapID] +" | relX=" +relativeX[mapID]+", relY=" + relativeY[mapID]);
    }
    /*
    // Move Map
    if (key.shift) {
        if (key.w) relativeY[mapID] -= speed;
        if (key.s) relativeY[mapID] += speed;
        if (key.a) relativeX[mapID] -= speed;
        if (key.d) relativeX[mapID] += speed;
    }*/
            
}

// GLOBAL VARIABLES
var cameraX = [200, 100];
var cameraY = [100, 100];

var prevCamX = 0;
var prevCamY = 0;

// Character Properties

var character_is_moving = false;
var character_direction = 0;
var character_look = [0, 0];
var motionEnabled = true;

var walkUp = true;
var walkDown = true;
var walkLeft = true;
var walkRight = true;
            
var speed = 2;

// Draw character motion WASD + Arrow Keys
function characterMotion() {
    
    prevCamX = cameraX[mapID];
    prevCamY = cameraY[mapID];
    prevX = charX[mapID];
    prevY = charY[mapID];
    
    character_is_moving = false;
    character_direction = 0;
    
    // <if else> for single direction movement at the same time only
    if (motionEnabled && !key.shift) {
        if (key.up || key.w) {
            if(canWalkTile(0) && walkUp) {
                character_direction |= DIR_N;
                character_look[mapID] = DIR_N;
                character_is_moving = true;
                //walkUp = false;
                //setTimeout(function() { walkUp = true;}, 100);
                
                // Map is not at the upper end
                if (relativeY[mapID] > 0) {
                    // Camera is below the middle of the canvas: move camera up
                    if (cameraY[mapID] > Math.floor(canvasHeight/2)) {
                        cameraY[mapID] -= speed;
                    }
                    // Camera is "above"/at the middle of the canvas: move map downwards + character move on spot
                    else {
                        relativeY[mapID] -= speed;
                    }
                }
                // Map is at the upper end: move camera up
                else {
                    cameraY[mapID] -= speed;
                }
                
                charY[mapID] -= speed;
            }
        }
        
        else if (key.down || key.s) {
            if(canWalkTile(1) && walkDown) {
                character_direction |= DIR_S;
                character_look[mapID] = DIR_S;
                character_is_moving = true;
                //walkDown = false;
                //setTimeout(function() { walkDown = true;}, 100);
                
                // Map is not at the lower end
                if (tileHeight[mapID] * mapHeight[mapID] - relativeY[mapID] > canvasHeight) {
                    // Camera is below the middle of the canvas: move map upwards
                    if (cameraY[mapID] > Math.floor(canvasHeight/2)) {
                        relativeY[mapID] += speed;
                    }
                    // Camera is "above"/at the middle of the canvas: move camera down
                    else {
                        cameraY[mapID] += speed;
                    }
                }
                // Map is at the lower end: move camera down
                else {
                    cameraY[mapID] += speed;
                }
                
                charY[mapID] += speed;               
            }
        }
        
        else if (key.left || key.a) {
            if(canWalkTile(2) && walkLeft) {
                character_direction |= DIR_W;
                character_look[mapID] = DIR_W;   
                character_is_moving = true;
                //walkLeft = false;
                //setTimeout(function() { walkLeft = true;}, 100);
                
                // Map is not at the left end
                if (relativeX[mapID] > 0) {
                    // Camera is right of the middle of the canvas: move camera left
                    if (cameraX[mapID] > Math.floor(canvasWidth/2)) {
                        cameraX[mapID] -= speed;
                    }
                    // Camera is left of the middle of the canvas: move map right
                    else {
                        relativeX[mapID] -= speed;
                    }
                }
                // Map is at the left end: move camera left
                else {
                    cameraX[mapID] -= speed;
                }
                
                charX[mapID] -= speed;
            }
        }
        
        else if (key.right || key.d) {
            if(canWalkTile(3) && walkRight) {
                character_direction |= DIR_E;
                character_look[mapID] = DIR_E;
                character_is_moving = true;
                //walkRight = false;
                //setTimeout(function() { walkRight = true;}, 100);
                
                // Map is not at the right end
                if (tileWidth[mapID] * mapWidth[mapID] - relativeX[mapID] > canvasWidth) {
                    // Camera is right of the middle of the canvas: move map right
                    if (cameraX[mapID] > Math.floor(canvasWidth/2)) {
                        relativeX[mapID] += speed;
                    }
                    // Camera is left of the middle of the canvas: move camera right
                    else {
                        cameraX[mapID] += speed;
                    }
                }
                // Map is at the right end: move camera right
                else {
                    cameraX[mapID] += speed;
                }
                
                charX[mapID] += speed;
            }
        }
    }
    // Check for collision
    DrawObjects();
    
    // Resolve collision by setting char to back to position without collision
    if (collision) {
        charX[mapID] = prevX;
        charY[mapID] = prevY;
        cameraX[mapID] = prevCamX;
        cameraY[mapID] = prevCamY;
        relativeX[mapID] = prevRelX;
        relativeY[mapID] = prevRelY;
        
        character_is_moving =false;
        collision = false;
    }

    
    // Draw Animated characters
    var char_seq = 0;
    var char_look = [25, 25];
    
    if (character_is_moving) {
        if (character_direction & DIR_W) char_seq = [36,37,38];
        if (character_direction & DIR_E) char_seq = [12,13,14];
        if (character_direction & DIR_N) char_seq = [0,1,2];
        if (character_direction & DIR_S) char_seq = [24,25,26];                 
        
        character.draw(cameraX[mapID], cameraY[mapID], char_seq);
    }
    else {
        if (character_look[mapID] == DIR_W) char_look = 37;
        if (character_look[mapID] == DIR_E) char_look = 13;    
        if (character_look[mapID] == DIR_N) char_look = 1;
        if (character_look[mapID] == DIR_S) char_look = 25;
        
        if(!isGravity)
            character.draw(cameraX[mapID], cameraY[mapID], char_look);
    }
}

// Draw pseudo gravity
var isGravity = false;
function gravity() {
    if (!chatSequence) {
        if (mapID == 0) {
            if (charX[mapID] < 44-relativeX[mapID]) {
                motionEnabled = false;
                isGravity = true;
                if (charY[mapID] < 320-relativeY[mapID]) {
                    charY[mapID] = charY[mapID] + 4;
                    character_look[mapID] = DIR_S;
                }
                else {
                    motionEnabled = true;
                    isGravity = false; 
                }
            }
            else if (charX[mapID] > 410-relativeX[mapID]) {
                motionEnabled = false;
                isGravity = true;
                if (charY[mapID] < 320-relativeY[mapID]) {
            charY[mapID] = charY[mapID] + 4;
                    character_look[mapID] = DIR_S;
                }
                else {
                    motionEnabled = true;
                    isGravity = false;
                }
            }
            else if (charY[mapID] < 40-relativeY[mapID]) {
                motionEnabled = false;
                isGravity = true;
                charY[mapID] = charY[mapID] + 4;
                character_look[mapID] = DIR_S;
            }
            else {
                motionEnabled = true;
                isGravity = false;
            }
        }
        else {
            motionEnabled = true;
            isGravity = false;
        }
    }
    
    // Character falling animation
    if (!motionEnabled && isGravity)
        character.draw(charX[mapID], charY[mapID], 31);
}

// Draw all motions
function DrawEvents() {
    if (chatSequence) {
        motionEnabled = false;
    }
    else {
        motionEnabled = true;
    }
    
    //gravity();
    characterMotion();
    gameEvents();
}