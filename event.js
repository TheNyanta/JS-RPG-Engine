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
    
    if (key.key0) {
        
    }
    
    if (key.key1) {
        mapID = 0;
    }
    
    if (key.key2) {
        mapID = 1;
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
        console.log("char_x: " +char_x+", char_y" +char_y);
    }
            
}

// Camera
var cam_x = 0;
var cam_y = 0;

// Character Properties
var char_x = 16;
var char_y = 16;

var character = new Sprite("CharSet/character.png", 24, 32, 8, 12);

var character_is_moving = false;
var character_direction = 0;
var character_look = 0;
var motionEnabled = true;
            
var speed = 2;

// Draw character motion WASD + Arrow Keys
function characterMotion() {
    
    character_is_moving = false;
    character_direction = 0;
    
    // <if else> for four direction movement
    if (motionEnabled) {
        if (key.up || key.w) {
            char_y -= speed;
            if (char_y < -16) {
                char_y = -16;
            }
            character_direction |= DIR_N;
            character_look = DIR_N;
            character_is_moving = true;
        }
        if (key.down || key.s) {
            char_y += speed;
            if (char_y > canvasHeight-32) {
                char_y = canvasHeight-32;
            }
            character_direction |= DIR_S;
            character_look = DIR_S;
            character_is_moving = true;
        }
        if (key.left || key.a) {
            char_x -= speed;
            if (char_x < -4) {
                char_x = -4;
            }
            character_direction |= DIR_W;
            character_look = DIR_W;
            character_is_moving = true;
        }
        if (key.right || key.d) {
            char_x += speed;
            if (char_x > canvasWidth-20) {
                char_x = canvasWidth-20;
            }
            character_direction |= DIR_E;
            character_look = DIR_E;
            character_is_moving = true;
        }
    }
    
    // Animated characters
    var char_seq = 0;
    var char_look = 25;
    
    if (character_is_moving)
    {
        if (character_direction & DIR_W) char_seq = [36,37,38];
        if (character_direction & DIR_E) char_seq = [12,13,14];
        if (character_direction & DIR_N) char_seq = [0,1,2];
        if (character_direction & DIR_S) char_seq = [24,25,26];                 
        
        character.draw(char_x, char_y, char_seq);
    }
    else
    {
        if (character_look == DIR_W) char_look = 37;
        if (character_look == DIR_E) char_look = 13;    
        if (character_look == DIR_N) char_look = 1;
        if (character_look == DIR_S) char_look = 25;
        
        if(!isGravity)
            character.draw(char_x, char_y, char_look);
    
    }
}

// Draw pseudo gravity
var isGravity = false;
function gravity() {
    if (!chatSequence) {
        if (mapID == 0) {
            if (char_x < 44) {
                motionEnabled = false;
                isGravity = true;
                if (char_y < 320) {
                    char_y = char_y + 4;
                    character_look = DIR_S;
                }
                else {
                    motionEnabled = true;
                    isGravity = false; 
                }
            }
            else if (char_x > 410) {
                motionEnabled = false;
                isGravity = true;
                if (char_y < 320) {
            char_y = char_y + 4;
                    character_look = DIR_S;
                }
                else {
                    motionEnabled = true;
                    isGravity = false;
                }
            }
            else if (char_y < 40) {
                motionEnabled = false;
                isGravity = true;
                char_y = char_y + 4;
                character_look = DIR_S;
            }
            else {
                motionEnabled = true;
                isGravity = false;
            }
        }
    }
    
    // Character falling animation
    if (!motionEnabled && isGravity)
        character.draw(char_x, char_y, 31);
}

// Draw all motions
function DrawEvents() {
    if (chatSequence) {
        motionEnabled = false;
    }
    else {
        motionEnabled = true;
    }
    
    gravity();
    characterMotion();
    gameEvents();
}