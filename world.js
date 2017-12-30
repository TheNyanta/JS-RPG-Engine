// to move the map on the canvas
var relativeX = [0, 0];
var relativeY = [0, 0];

var charTileX = 0;
var charTileY = 0;

/*var World function() {
    this.relativeX[mapID] = 4;
    this.y = 0;
}*/

function moveMap() {
    /*
    charTileX = Math.floor((charX[mapID] + character.spriteWidth/2)/16);
    charTileY = Math.floor((charY[mapID] + character.spriteHeight/2)/16);
    if ((charTileX > (canvasWidth/16) )) {
        relativeX[mapID] = charTileX - canvasWidth/16;
    }
    if ((charTileY > (canvasHeight/16) )) {
        relativeY[mapID] = charTileY - canvasHeight/16;
    }
    */
}
                                


// Layer 1
function DrawBackgroundMap() {
    moveMap();
    var mapIndex = 0;        
    for (var h = 0; h < mapHeight[mapID]; h++) {
        for (var w = 0; w < mapWidth[mapID]; w++, mapIndex++) {
            var tile_w = w * tileWidth[mapID] + relativeX[mapID];
            var tile_h = h * tileHeight[mapID] + relativeY[mapID];
            if (map[mapID][mapIndex]-1 >= 0)
                chipset[mapID].draw(tile_w, tile_h, map[mapID][mapIndex]-1);
        }
    }
}

// Layer 2

// Layer 3
function DrawObjects() {
    // Collison Box of the character
    var char_collision_box = new Rectangle(cameraX[mapID], cameraY[mapID], character.spriteWidth, character.spriteHeight);
    // Draw Collision Box
    char_collision_box.draw('white', false, 'black', true);
    
    // Center of Collision Box
    var ccb_center = new Point (char_collision_box.centerX, char_collision_box.centerY);
    // ccb_center.draw(20, 'black');
    
    
    if (mapID == 0) {
        // Rectangle 1 blue
        var rect1 = new Rectangle(100+relativeX[mapID], 100+relativeY[mapID], 10, 10);
        rect1.draw('blue', true, 'blue',false);
        // Rectangle-Char-Collision
        if (char_collision_box.rectInside(rect1)) {
            rect1.draw('red',true,'red',false);
            DrawDialog("Bananaphone", bananaphone);
            audio2.pause();
            audio1.play();
            console.log(character.spriteWidth +", "+ character.spriteHeight);
        }
        else {
            audio1.pause();
            audio2.play();
        }
    }
    
    if (mapID == 1) {
        audio1.pause();
        audio2.pause();
        audio3.play();   
    }
    else {
        audio3.pause();
    }
}

// Layer 4
function DrawForegroundMap() {
    var mouseRect = new Rectangle(mouse_x, mouse_y, character.spriteWidth, character.spriteHeight);
    mouseRect.draw('white', false, 'white',true);
}