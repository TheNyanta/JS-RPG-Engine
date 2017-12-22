var Keyboard = function() {
    this.shift = false;
    this.enter = false; 
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false;
    this.esc = false;
    this.space = false; 
    this.plus = false;
    this.minus = false;
    
};

// ASCII codes
var KEY_SHIFT = 16;
var KEY_ENTER = 13;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_W =87;
var KEY_A =65;
var KEY_S =83;
var KEY_D =68; 
var KEY_ESC = 27;
var KEY_SPACE = 32;
var KEY_PLUS = 107;
var KEY_MINUS = 109;

var DIR_E = 1;
var DIR_NE = 2;
var DIR_N = 4;
var DIR_NW = 8;
var DIR_W = 16;
var DIR_SW = 32;
var DIR_S = 64;
var DIR_SE = 128;
/* ASCII code END */

window.key = null;

function InitializeKeyboard() {
    
    window.key = new Keyboard();
    
    //Attach to main document
    $(document).keydown(function(e) {
        //console.log("event.keyCode=" + e.keyCode);
        
        if (e.keyCode == KEY_SHIFT) { key.shift = true; }       
        if (e.keyCode == KEY_ENTER) { key.enter = true; }       
        if (e.keyCode == KEY_UP) { key.up = true; }
        if (e.keyCode == KEY_DOWN) { key.down = true; }
        if (e.keyCode == KEY_LEFT) { key.left = true; }
        if (e.keyCode == KEY_RIGHT) { key.right = true; }
        if (e.keyCode == KEY_W) { key.w = true; }        
        if (e.keyCode == KEY_A) { key.a = true; }       
        if (e.keyCode == KEY_S) { key.s = true; }
        if (e.keyCode == KEY_D) { key.d = true; }
        if (e.keyCode == KEY_ESC) { key.esc = true; }
        if (e.keyCode == KEY_SPACE) { key.space = true; }
        if (e.keyCode == KEY_PLUS) { key.plus = true; }
        if (e.keyCode == KEY_MINUS) { key.minus = true; }
        
    });
    
    $(document).keyup(function(e) {
        
        if (e.keyCode == KEY_SHIFT) { key.shift = false; }       
        if (e.keyCode == KEY_ENTER) { key.enter = false; }       
        if (e.keyCode == KEY_UP) { key.up = false; }
        if (e.keyCode == KEY_DOWN) { key.down = false; }
        if (e.keyCode == KEY_LEFT) { key.left = false; }
        if (e.keyCode == KEY_RIGHT) { key.right = false; }
        if (e.keyCode == KEY_W) { key.w = false; }        
        if (e.keyCode == KEY_A) { key.a = false; }       
        if (e.keyCode == KEY_S) { key.s = false; }
        if (e.keyCode == KEY_D) { key.d = false; }
        if (e.keyCode == KEY_ESC) { key.esc = false; }
        if (e.keyCode == KEY_SPACE) { key.space = false; }
        if (e.keyCode == KEY_PLUS) { key.plus = false; }
        if (e.keyCode == KEY_MINUS) { key.minus = false; }
    });
    
}

