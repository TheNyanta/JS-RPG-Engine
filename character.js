//######################
//## GLOBAL VARIABLES ##
//######################

// Camera position
var cameraX = [300, 100];
var cameraY = [100, 100];

var prevCamX = 0;
var prevCamY = 0;

var cameraLocked = true;

// Character Properties

var character_is_moving = false;
var character_direction = 0;
var character_look = [0, 0];
var characterMotionEnabled = true;

// Draw Animations
var char_seq = 0;
var char_look = [25, 25];
            
var speed = 2;

// Draw character motion
function DrawCharacter() {
    
    character_is_moving = false;
    character_direction = 0;
    
    if (chatSequence)
        characterMotionEnabled = false;
    else
        characterMotionEnabled = true;
    
    //##############################
    //## Using WASD or Arrow Keys ##
    //##############################
    
    // <if else> for single direction movement at the same time only
    if (characterMotionEnabled && !key.shift) {
        if (key.up || key.w) {
            character_direction |= DIR_N;
            character_look[mapID] = DIR_N;
            character_is_moving = true;
            
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
        
        else if (key.down || key.s) {
            character_direction |= DIR_S;
            character_look[mapID] = DIR_S;
            character_is_moving = true;
            
            // Map is not at the lower end
            if (tileHeight[mapID] * mapHeight[mapID] - canvasHeight > relativeY[mapID]) {
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
        
        else if (key.left || key.a) {
            character_direction |= DIR_W;
            character_look[mapID] = DIR_W;
            character_is_moving = true;
            
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
        
        else if (key.right || key.d) {
            character_direction |= DIR_E;
            character_look[mapID] = DIR_E;
            character_is_moving = true;
            
            // Map is not at the right end
            if (tileWidth[mapID] * mapWidth[mapID] - canvasWidth > relativeX[mapID]) {
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
    
    //#################
    //## Using Touch ##
    //#################
    
    //TODO
    /*
    // <if else> for single direction movement at the same time only
    if (characterMotionEnabled && !key.shift) {
        if (key.up || key.w) {
            character_direction |= DIR_N;
            character_look[mapID] = DIR_N;
            character_is_moving = true;
            
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
        
        else if (key.down || key.s) {
            character_direction |= DIR_S;
            character_look[mapID] = DIR_S;
            character_is_moving = true;
            
            // Map is not at the lower end
            if (tileHeight[mapID] * mapHeight[mapID] - canvasHeight > relativeY[mapID]) {
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
        
        else if (key.left || key.a) {
            character_direction |= DIR_W;
            character_look[mapID] = DIR_W;
            character_is_moving = true;
            
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
        
        else if (key.right || key.d) {
            character_direction |= DIR_E;
            character_look[mapID] = DIR_E;
            character_is_moving = true;
            
            // Map is not at the right end
            if (tileWidth[mapID] * mapWidth[mapID] - canvasWidth > relativeX[mapID]) {
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
    */
    
    // Save last collision-free position
    if (isWalkable(charX[mapID]-relativeX[mapID], charY[mapID]-relativeY[mapID])) {
        prevX = charX[mapID];
        prevY = charY[mapID];
        if (cameraLocked) {
            prevCamX = cameraX[mapID];
            prevCamY = cameraY[mapID];
        }
    }
    // Resolve collision by setting char back to previous position without collision
    else  {
        charX[mapID] = prevX;
        charY[mapID] = prevY;
        if (cameraLocked) {
            cameraX[mapID] = prevCamX;
            cameraY[mapID] = prevCamY;
        }
        relativeX[mapID] = prevRelX;
        relativeY[mapID] = prevRelY;
        character_is_moving = false;
    }
    
    // Map boundry check
    if (cameraX[mapID] < -4)
        cameraX[mapID] = -4;
    if (cameraX[mapID] > canvasWidth-20)
        cameraX[mapID] = canvasWidth-20;
    if (cameraY[mapID] < 0) // Not tested maybe needs adjustment
        cameraY[mapID] = 0;
    if (cameraY[mapID] > canvasHeight-16)
        cameraY[mapID] = canvasHeight-16;
    
    if (relativeX[mapID] < 0)
        relativeX[mapID] = 0;
    if (relativeX[mapID] > tileWidth[mapID] * mapWidth[mapID] - canvasWidth)
        relativeX[mapID] = tileWidth[mapID] * mapWidth[mapID] - canvasWidth;
    if (relativeY[mapID] < 0)
        relativeY[mapID] = 0;
    if (relativeY[mapID] > tileHeight[mapID] * mapHeight[mapID] - canvasHeight)
        relativeY[mapID] = tileHeight[mapID] * mapHeight[mapID] - canvasHeight;
    
    if (character_is_moving) {
        if (character_direction & DIR_W) char_seq = [36,37,38];
        if (character_direction & DIR_E) char_seq = [12,13,14];
        if (character_direction & DIR_N) char_seq = [0,1,2];
        if (character_direction & DIR_S) char_seq = [24,25,26];
        character.draw(charX[mapID]-relativeX[mapID], charY[mapID]-relativeY[mapID], char_seq);
    }
    else {
        if (character_look[mapID] == DIR_W) char_look = 37;
        if (character_look[mapID] == DIR_E) char_look = 13;    
        if (character_look[mapID] == DIR_N) char_look = 1;
        if (character_look[mapID] == DIR_S) char_look = 25;
        character.draw(charX[mapID]-relativeX[mapID], charY[mapID]-relativeY[mapID], char_look);
    }
}