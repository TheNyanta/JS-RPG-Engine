// to move the map on the canvas
var relativeX = [0, 0];
var relativeY = [0, 0];

var charTileX = 0;
var charTileY = 0;

var allAnimations = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95];

// Layer 1
function DrawBackgroundMap() {
    var mapIndex = 0;        
    for (var h = 0; h < mapHeight[mapID]; h++) {
        for (var w = 0; w < mapWidth[mapID]; w++, mapIndex++) {
            var tile_w = w * tileWidth[mapID] - relativeX[mapID];
            var tile_h = h * tileHeight[mapID] - relativeY[mapID];
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
        var rect1 = new Rectangle(100-relativeX[mapID], 100-relativeY[mapID], 10, 10);
        rect1.draw('blue', true, 'blue',false);
        // Rectangle-Char-Collision
        if (char_collision_box.rectInside(rect1)) {
            rect1.draw('red',true,'red',false);
            DrawDialog("Bananaphone", bananaphone);
            audio2.pause();
            audio1.play();
        }
        else {
            audio1.pause();
            audio2.play();
        }
        var catiBox = new Rectangle(200-relativeX[mapID], 200-relativeY[mapID], cat.spriteWidth, cat.spriteHeight);
        catiBox.draw('white', false, 'black', true);
        cat.draw(200-relativeX[mapID], 200-relativeY[mapID], allAnimations);
        
        if (char_collision_box.rectInside(catiBox)) {
            DrawDialog("Press Enter");
            if (key.enter) {
                catsound.play();
            }
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
    //mouseRect.draw('white', false, 'white',true);
    
    var mapIndex = 0;        
    for (var h = 0; h < mapHeight[mapID]; h++) {
        for (var w = 0; w < mapWidth[mapID]; w++, mapIndex++) {
            var tile_w = w * tileWidth[mapID] - relativeX[mapID];
            var tile_h = h * tileHeight[mapID] - relativeY[mapID];
            if (map[mapID+2][mapIndex]-1 >= 0)
                chipset[mapID].draw(tile_w, tile_h, map[mapID+2][mapIndex]-1);
        }
    }
}