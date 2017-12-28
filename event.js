function gameEvents() {
    // Events on input
    if (key.enter) {
        chatSequence = true;
        dialogText = "This is a chat sequence!";
        setTimeout(function() {
            dialogText = "You can't move while it runs!";
            setTimeout(function() {chatSequence = false;}, 2000);       
        }, 2000);
               
    }
    
    if(chatSequence){
        DrawDialog(dialogText, undefined, true);
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
        
    }
        
    if (key.key0) {
        
    }    
    
    if (key.plus) {
        speed++;
        if (speed > 10) {
            speed = 10;
        }
    }
    
    if (key.minus) {
        speed--;
        if (speed < 1) {
            speed = 1;
        }
    }
    
    if (key.o) {
        // Mouse position
        console.log("mouse_x: " +mouse_x+", mouse_y" +mouse_y);
    }
    
    if (key.p) {
        // Position debug
        console.log("charX[mapID]: " +charX[mapID]+", charY[mapID]" +charY[mapID]);
    }
    
    // Move Map
    if (key.shift) {
        if (key.w) relativeY[mapID] -= speed;
        if (key.s) relativeY[mapID] += speed;
        if (key.a) relativeX[mapID] -= speed;
        if (key.d) relativeX[mapID] += speed;
    }
            
}

// Camera
var cam_x = 0;
var cam_y = 0;

// Character Properties
var character = new Sprite("CharSet/character.png", 24, 32, 8, 12);

var character_is_moving = false;
var character_direction = 0;
var character_look = [0, 0];
var motionEnabled = true;
            
var speed = 2;

// Draw character motion WASD + Arrow Keys
function characterMotion() {
    
    character_is_moving = false;
    character_direction = 0;
    
    // <if else> for four direction movement
    if (motionEnabled && !key.shift) {
        if (key.up || key.w) {
            charY[mapID] -= speed;
            if (charY[mapID] < -16) {
                charY[mapID] = -16;
            }
            character_direction |= DIR_N;
            character_look[mapID] = DIR_N;
            character_is_moving = true;
        }
        if (key.down || key.s) {
            charY[mapID] += speed;
            if (charY[mapID] > canvasHeight-32) {
                charY[mapID] = canvasHeight-32;
            }
            character_direction |= DIR_S;
            character_look[mapID] = DIR_S;
            character_is_moving = true;
        }
        if (key.left || key.a) {
            charX[mapID] -= speed;
            if (charX[mapID] < -4) {
                charX[mapID] = -4;
            }
            character_direction |= DIR_W;
            character_look[mapID] = DIR_W;
            character_is_moving = true;
        }
        if (key.right || key.d) {
            charX[mapID] += speed;
            if (charX[mapID] > canvasWidth-20) {
                charX[mapID] = canvasWidth-20;
            }
            character_direction |= DIR_E;
            character_look[mapID] = DIR_E;
            character_is_moving = true;
        }
    }
    
    // Animated characters
    var char_seq = 0;
    var char_look = [25, 25];
    
    if (character_is_moving)
    {
        if (character_direction & DIR_W) char_seq = [36,37,38];
        if (character_direction & DIR_E) char_seq = [12,13,14];
        if (character_direction & DIR_N) char_seq = [0,1,2];
        if (character_direction & DIR_S) char_seq = [24,25,26];                 
        
        character.draw(charX[mapID], charY[mapID], char_seq);
    }
    else
    {
        if (character_look[mapID] == DIR_W) char_look = 37;
        if (character_look[mapID] == DIR_E) char_look = 13;    
        if (character_look[mapID] == DIR_N) char_look = 1;
        if (character_look[mapID] == DIR_S) char_look = 25;
        
        if(!isGravity)
            character.draw(charX[mapID], charY[mapID], char_look);
    
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