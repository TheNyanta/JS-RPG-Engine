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
    
    //resize canvas if fullscreen
    canvasWidth = $(window).width();
    if (canvasWidth > tileWidth[mapID] * mapWidth[mapID])
        canvasWidth = tileWidth[mapID] * mapWidth[mapID];
    
    canvasHeight = $(window).height();
    if (canvasHeight > tileHeight[mapID] * mapHeight[mapID])
        canvasHeight = tileHeight[mapID] * mapHeight[mapID];
    
    Context = new HTML("game", canvasWidth, canvasHeight);   
}

function resizeCanvas() {
    canvasWidth = $(window).width();
    if (canvasWidth > tileWidth[mapID] * mapWidth[mapID])
        canvasWidth = tileWidth[mapID] * mapWidth[mapID];
    
    canvasHeight = $(window).height();
    if (canvasHeight > tileHeight[mapID] * mapHeight[mapID])
        canvasHeight = tileHeight[mapID] * mapHeight[mapID];
    
    Context = new HTML("game", canvasWidth, canvasHeight);
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function LoadGamestate() {
    if (getCookie("mapID") != "") {
        mapID = parseInt(getCookie("mapID"));
        
        charX[0] = parseInt(getCookie("charX[0]"));
        charY[0] = parseInt(getCookie("charY[0]"));
        character_look[0] = parseInt(getCookie("charLook[0]"));
        relativeX[0] = parseInt(getCookie("relX[0]"));
        relativeY[0] = parseInt(getCookie("relY[0]"));
        cameraX[0] = parseInt(getCookie("camX[0]"));
        cameraY[0] = parseInt(getCookie("camY[0]"));
        
        charX[1] = parseInt(getCookie("charX[1]"));
        charY[1] = parseInt(getCookie("charY[1]"));
        character_look[1] = parseInt(getCookie("charLook[1]"));
        relativeX[1] = parseInt(getCookie("relX[1]"));
        relativeY[1] = parseInt(getCookie("relY[1]"));
        cameraX[1] = parseInt(getCookie("camX[1]"));
        cameraY[1] = parseInt(getCookie("camY[1]"));
        
        //console.log("Loaded Cookie");
        
        // Load message
        chatSequence = true;
        dialogText = "Loaded gamestate!";
        setTimeout(function() {chatSequence = false;}, 1000);
    }
    else {
        //console.log("New game");
    }
        
}

function SaveGamestate() {
    setCookie("mapID", mapID);
    
    setCookie("charX[0]", charX[0], 365);
    setCookie("charY[0]", charY[0], 365);
    setCookie("charLook[0]", character_look[0], 365);
    setCookie("relX[0]", relativeX[0], 365);
    setCookie("relY[0]", relativeY[0], 365);
    setCookie("camX[0]", cameraX[0], 365);
    setCookie("camY[0]", cameraY[0], 365);
    
    setCookie("charX[1]", charX[1], 365);
    setCookie("charY[1]", charY[1], 365);
    setCookie("charLook[1]", character_look[1], 365);
    setCookie("relX[1]", relativeX[1], 365);
    setCookie("relY[1]", relativeY[1], 365);
    setCookie("camX[1]", cameraX[1], 365);
    setCookie("camY[1]", cameraY[1], 365);
    
    // Saved message
    chatSequence = true;
    dialogText = "Saved gamestate!";
    setTimeout(function() {chatSequence = false;}, 1000);
}
