/**
 * Contains all the spritesheets of the game
 */
var spritesheets = {
    data: [] // Contains the spritesheets
};

/**
 * For adding a new spritesheet
 */
function addSprite(src, spritesX, spritesY, spriteWidth, spriteHeight, name) {
    spritesheets.data.push(new Spritesheet(src, spritesX, spritesY, spriteWidth, spriteHeight, name));
    spritesheets.data[spritesheets.data.length - 1].id = spritesheets.data.length - 1;
    // Datastring
    myGameArea.data += "addSprite(" + src + ", " + spritesX + ", " + spritesY + ", " + spriteWidth + ", " + spriteHeight + ", " + name + ");\n";
}


/**
 * Draw a specific sprite of a spritesheet
 * @param the context where to draw it
 * @param the spritesheet where the source image is
 * @param the specific sprite
 * @param x position
 * @param y position
 */
function drawSprite(ctx, spritesheet, number, x, y) {
    var res = i2xy(number, Math.max(spritesheet.spritesX, spritesheet.spritesY));
    ctx.drawImage(spritesheet.img, res[0] * spritesheet.spriteWidth, res[1] * spritesheet.spriteHeight, spritesheet.spriteWidth, spritesheet.spriteHeight, x, y, spritesheet.spriteWidth, spritesheet.spriteHeight);
}

/**
 * Spritesheet for map-tiles and objects
 */
function Spritesheet(src, spritesX, spritesY, spriteWidth, spriteHeight, name) {
    this.img = new Image();
    this.img.src = src;
    this.width = spritesX * spriteWidth;
    this.height = spritesY * spriteHeight;
    this.spritesX = spritesX;
    this.spritesY = spritesY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    if (name != undefined) this.name = name;
    else this.name = src.match(/[\w]+\.[A-Za-z]{3}$/)[0];
}
