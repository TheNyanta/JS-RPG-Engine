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
        console.log()
    }
    
    if (key.key7) {
        staticGrid = true;
    }
    
    if (key.key8) {
        staticGrid = false;
    }
    
    if (key.key9) {
        DisableScrollbar();
    }
        
    if (key.key0) {
        EnableScrollbar();
    }    
    
    if (key.plus) {
        
    }
    
    if (key.minus) {
        
    }
    
    if (key.o) {
        // Char Tile position
        console.log("Standing on Tile["+ Math.floor((cameraX[mapID]+relativeX[mapID]+4)/16) +","+ Math.floor((cameraY[mapID]+relativeY[mapID]+16)/16) +"]");
    }
    
    if (key.p) {
        // Position debug
        console.log("charX=" +Math.floor(charX[mapID])+", charY=" +Math.floor(charY[mapID]) +" | camX=" +cameraX[mapID] +", camY=" + cameraY[mapID] +" | relX=" +relativeX[mapID]+", relY=" + relativeY[mapID]);
    }           
}

// Draw all motions
function DrawEvents() {
    gameEvents();
}