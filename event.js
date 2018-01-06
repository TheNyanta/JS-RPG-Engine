function gameEvents() {
    // Draw dialogText if chatSequence is true
    if(chatSequence){
        DrawDialog(dialogText, undefined, true);
    }
    
    if (key.shift) {
        if (key.w) catY-=speed;
        if (key.s) catY+=speed;
        if (key.a) catX-=speed;
        if (key.d) catX+=speed;
        /*
        cameraLocked = false;
        if (key.w) relativeY[mapID]--;
        if (key.s) relativeY[mapID]++;
        if (key.a) relativeX[mapID]--;
        if (key.d) relativeX[mapID]++;
        */
    }
    else {
        /*
        cameraLocked = true;
        cameraX[mapID] = charX[mapID] - relativeX[mapID];
        cameraY[mapID] = charY[mapID] - relativeY[mapID];
        */
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
        
    }
    
    if (key.key4) {
        
    }
    
    if (key.key5) {
        
    }
    
    if (key.key6) {
        
    }
    
    if (key.key7) {
        
    }
    
    if (key.key8) {
        
    }
    
    if (key.key9) {
        // Char Tile position
        console.log("Standing on Tile["+ Math.floor((cameraX[mapID]+relativeX[mapID]+4)/16) +","+ Math.floor((cameraY[mapID]+relativeY[mapID]+16)/16) +"]");
    }
        
    if (key.key0) {
        // Position debug
        console.log("charX=" +Math.floor(charX[mapID])+", charY=" +Math.floor(charY[mapID]) +" | camX=" +cameraX[mapID] +", camY=" + cameraY[mapID] +" | relX=" +relativeX[mapID]+", relY=" + relativeY[mapID]);
    }    
    
    if (key.plus) {
        
    }
    
    if (key.minus) {
        
    }
    
    if (key.i) {
        var Inventory = new Rectangle(100, 100, 100, 100);
        Inventory.draw('black', true, 'yellow', true);
        if (collectedPhone)
            bananaphone.draw2(100, 100, 25, 25);
    }
    
    if (key.o) {
        
    }
    
    if (key.p) {
        if (collectedPhone) {
            if (!displayed)
            displayPlay = true;
            setTimeout(function() {
                displayPlay = false;
            }, 2000);
            displayed = true;
            audio2.pause();
            audio1.play();
        }
    }           
}