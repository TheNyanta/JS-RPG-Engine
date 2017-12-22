var KEY_ENTER = 13; // 0
var KEY_UP = 38; // 1
var KEY_DOWN = 40; // 2
var KEY_LEFT = 37; // 3
var KEY_RIGHT = 39; // 4
var KEY_W =87; // 5
var KEY_A =65; // 6
var KEY_S =83; // 7
var KEY_D =68; // 8
var KEY_ESC = 27; // 9
var KEY_SPACEBAR = 32; // 10
var KEY_PLUS = 107; // 11
var KEY_MINUS = 109; // 12

var KEY_SHIFT = 16;

var isShift = false;
var kstate = [false, false, false, false, false, false, false, false, false, false, false, false];

function InitializeKeyboard() {
    //Attach to main document
    $(document).keydown(function(e) {
        //console.log("event.keyCode=" + e.keyCode);
        
        if (e.keyCode == KEY_SHIFT) {
            isShift = true;
        }
        
        if (e.keyCode == KEY_ENTER) {
            kstate[0] = true;
        }
        
        if (e.keyCode == KEY_UP) {
            kstate[1] = true;
            
        }
        if (e.keyCode == KEY_DOWN) {
            kstate[2] = true;
            
        }
        if (e.keyCode == KEY_LEFT) {
            kstate[3] = true;
        
        }
        if (e.keyCode == KEY_RIGHT) {
            kstate[4] = true;
        }
        if (e.keyCode == KEY_PLUS) {
            kstate[11] = true;
        }
        if (e.keyCode == KEY_MINUS) {
            kstate[12] = true;
        }
        
    });
    
    $(document).keyup(function(e) {
        
        if (e.keyCode == KEY_SHIFT) {
            isShift = false;
        }
        
        if (e.keyCode == KEY_ENTER) {
            kstate[0] = false;
        }
        
        if (e.keyCode == KEY_UP) {
            kstate[1] = false;
            
        }
        if (e.keyCode == KEY_DOWN) {
            kstate[2] = false;
            
        }
        if (e.keyCode == KEY_LEFT) {
            kstate[3] = false;
        
        }
        if (e.keyCode == KEY_RIGHT) {
            kstate[4] = false;
        }
        
        if (e.keyCode == KEY_PLUS) {
            kstate[11] = false;
        }
        if (e.keyCode == KEY_MINUS) {
            kstate[12] = false;
        }
    });
    
}

