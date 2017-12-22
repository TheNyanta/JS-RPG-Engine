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

