function gameEvents() {
    // Draw dialogText if chatSequence is true
    if(chatSequence){
        DrawDialog(dialogText, undefined, true);
    }
    
    if (key.shift) {
        cameraLocked = false;
        if (key.w) relativeY[mapID]--;
        if (key.s) relativeY[mapID]++;
        if (key.a) relativeX[mapID]--;
        if (key.d) relativeX[mapID]++;
    }
    else {
        cameraLocked = true;
        cameraX[mapID] = charX[mapID] - relativeX[mapID];
        cameraY[mapID] = charY[mapID] - relativeY[mapID];        
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
        isFullscreen = false;        
    }
    
    if (key.key1) {
        mapID = 0;
    }
    
    if (key.key2) {
        mapID = 1;
    }
    
    if (key.key3) {
        
    }
    
    if (key.key4) {
        
    }
    
    if (key.key5) {
        
    }
    
    if (key.key6) {
        console.log((charX[mapID] - relativeX[mapID]) + ", " + (charY[mapID] - relativeY[mapID]));
    }
    
    if (key.key7) {
        staticGrid = true;
    }
    
    if (key.key8) {
        staticGrid = false;
    }
    
    if (key.key9) {
        
    }
        
    if (key.key0) {
        
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