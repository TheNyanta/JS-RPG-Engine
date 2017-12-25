//convert map to tile index coordinates
function xy2i(x,y,mapWidth) {
    var index = y * mapWidth + x;
    return index;
}

//convert tile index to map coordinates
function i2xy(index,mapWidth) {
    var x = index % mapWidth;
    var y = Math.floor(index / mapWidth);
    return [x,y];
}

function DisableScrollbar() {
    document.documentElement.style.overflow = 'hidden';
    document.body.scoll = "no";
}

function EnableScrollbar() {
    document.documentElement.style.overflow = 'visible';
    document.body.scroll = "yes";
}


function enterFullscreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    //TODO resize canvas if fullscreen
    //canvasHeight = $(window).height();
    //canvasWidth = $(window).width();
    //Context.context.width = canvasWidth;
    //Context.context.height = canvasHeight; 
}

