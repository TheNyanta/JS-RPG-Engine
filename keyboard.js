var Keyboard = function() {
    this.enter = false;
    this.esc = false;
    this.space = false;
    this.left = false;
    this.up = false;
    this.right = false;
    this.down = false;
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false; 
    this.plus = false;
    this.minus = false;
    this.q = false;
    this.e = false;
    this.r = false;
    this.t = false;
    this.z = false;
    this.u = false;
    this.i = false;
    this.o = false;
    this.p = false;
    this.f = false;
    this.g = false;
    this.h = false;
    this.j = false;
    this.k = false;
    this.l = false;
    this.y = false;
    this.x = false;
    this.c = false;
    this.v = false;
    this.b = false;
    this.n = false;
    this.m = false;
    this.key1 = false;
    this.key2 = false;
    this.key3 = false;
    this.key4 = false;
    this.key5 = false;
    this.key6 = false;
    this.key7 = false;
    this.key8 = false;
    this.key9 = false;
    this.key0 = false;    
    
};

// ASCII codes
var KEY_ENTER = 13;
var KEY_ESC = 27;
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_0 = 48;
var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;
var KEY_6 = 54;
var KEY_7 = 55;
var KEY_8 = 56;
var KEY_9 = 57;
var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;

var KEY_PLUS = 107;
var KEY_MINUS = 109;
var KEY_Q = 81;
var KEY_E = 69;
var KEY_R = 82;
var KEY_T = 84;
var KEY_Z = 90;
var KEY_U = 85;
var KEY_I = 73;
var KEY_O = 79;    
var KEY_P = 80;
var KEY_F = 70;
var KEY_G = 71;
var KEY_H = 72;
var KEY_J = 74;
var KEY_K = 75;
var KEY_L = 76;
var KEY_Y = 89;
var KEY_X = 88;
var KEY_C = 67;
var KEY_V = 86;
var KEY_B = 66;
var KEY_N = 78;
var KEY_M = 77;

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
        //console.log("event.keyCode=" + e.keyCode); //Lookup unknown keyCode
              
        if (e.keyCode == KEY_ENTER) { key.enter = true; }
        if (e.keyCode == KEY_ESC) { key.esc = true; }
        if (e.keyCode == KEY_SPACE) { key.space = true; }
        if (e.keyCode == KEY_LEFT) { key.left = true; }
        if (e.keyCode == KEY_UP) { key.up = true; }
        if (e.keyCode == KEY_RIGHT) { key.right = true; }
        if (e.keyCode == KEY_DOWN) { key.down = true; }
        if (e.keyCode == KEY_W) { key.w = true; }        
        if (e.keyCode == KEY_A) { key.a = true; }       
        if (e.keyCode == KEY_S) { key.s = true; }
        if (e.keyCode == KEY_D) { key.d = true; }
        if (e.keyCode == KEY_PLUS) { key.plus = true; }
        if (e.keyCode == KEY_MINUS) { key.minus = true; }
        if (e.keyCode == KEY_O) { key.o = true; }
        if (e.keyCode == KEY_P) { key.p = true; }
        
        if (e.keyCode == KEY_0) { key.key0 = true; }
        if (e.keyCode == KEY_1) { key.key1 = true; }
        if (e.keyCode == KEY_2) { key.key2 = true; }
        if (e.keyCode == KEY_3) { key.key3 = true; }
        if (e.keyCode == KEY_4) { key.key4 = true; }
        if (e.keyCode == KEY_5) { key.key5= true; }        
        if (e.keyCode == KEY_6) { key.key6 = true; }       
        if (e.keyCode == KEY_7) { key.key7 = true; }
        if (e.keyCode == KEY_8) { key.key8 = true; }
        if (e.keyCode == KEY_9) { key.key9 = true; }
        
    });
    
    $(document).keyup(function(e) {
              
        if (e.keyCode == KEY_ENTER) { key.enter = false; } 
        if (e.keyCode == KEY_ESC) { key.esc = false; }
        if (e.keyCode == KEY_SPACE) { key.space = false; }
        if (e.keyCode == KEY_LEFT) { key.left = false; }
        if (e.keyCode == KEY_UP) { key.up = false; }
        if (e.keyCode == KEY_RIGHT) { key.right = false; }
        if (e.keyCode == KEY_DOWN) { key.down = false; }
        if (e.keyCode == KEY_W) { key.w = false; }        
        if (e.keyCode == KEY_A) { key.a = false; }       
        if (e.keyCode == KEY_S) { key.s = false; }
        if (e.keyCode == KEY_D) { key.d = false; }
        if (e.keyCode == KEY_PLUS) { key.plus = false; }
        if (e.keyCode == KEY_MINUS) { key.minus = false; }
        if (e.keyCode == KEY_O) { key.o = false; }
        if (e.keyCode == KEY_P) { key.p = false; }
        
        if (e.keyCode == KEY_0) { key.key0 = false; }
        if (e.keyCode == KEY_1) { key.key1 = false; }
        if (e.keyCode == KEY_2) { key.key2 = false; }
        if (e.keyCode == KEY_3) { key.key3 = false; }
        if (e.keyCode == KEY_4) { key.key4 = false; }
        if (e.keyCode == KEY_5) { key.key5= false; }        
        if (e.keyCode == KEY_6) { key.key6 = false; }       
        if (e.keyCode == KEY_7) { key.key7 = false; }
        if (e.keyCode == KEY_8) { key.key8 = false; }
        if (e.keyCode == KEY_9) { key.key9 = false; }
        
    });
    
}

