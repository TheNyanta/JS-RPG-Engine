/*
window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].screenX;
            myGameArea.y = e.touches[0].screenY;
        })

function InitalizeTouch() {
    // get mouse position on move
    document.getElementById("game").touchmove = handleMouseMove;
     
    function handleTouchMove(event) {
        var dim = document.getElementById("game").getBoundingClientRect();
        mouse_x = event.clientX - dim.left;
        mouse_y = event.clientY - dim.top;
    }                            
    
    $(document.getElementById("game")).touchmove(function(e) {
        console.log(e.touches[0].screenX + " " + e.touches[0].screenY);
        cameraX[mapID] = e.touches[0].screenX;
        cameraY[mapID] = e.touches[0].screenY;
        charX[mapID] = relativeX[mapID] + cameraX[mapID];
        charY[mapID] = relativeY[mapID] + cameraY[mapID];
    });
}*/

var touchStartX = 0;
var touchStartY = 0;
var touchX = 0;
var touchY = 0;


function InitalizeTouch() {
    var dim = document.getElementById("game").getBoundingClientRect();

    window.addEventListener('touchmove', function (e) {
        cameraX[mapID] = e.touches[0].screenX - dim.left;
        cameraY[mapID] = e.touches[0].screenY - dim.top;
        charX[mapID] = relativeX[mapID] + cameraX[mapID];
        charY[mapID] = relativeY[mapID] + cameraY[mapID];
    });
}