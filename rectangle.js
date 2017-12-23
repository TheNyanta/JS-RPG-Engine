var Rectangle = function(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.state = false;

	this.draw = function(fillColor, filled, outlineColor, outline)
	{
		gfx.beginPath();
		gfx.rect(this.x, this.y, this.width, this.height);

		if (outline == true) {
			gfx.strokeStyle = outlineColor;
			gfx.stroke();
		}
        
        if (outline == undefined) {
            gfx.strokeStyle = fillColor;
            gfx.stroke();
            
        }

		if (filled == true || filled == undefined) {
			gfx.fillStyle = fillColor;
			gfx.fill();
		}
	}
    
    this.rectInside = function (rect) {
        if (this.x < rect.x + rect.width && this.x + this.width > rect.x &&
            this.y < rect.y + rect.height && this.y + this.height > rect.y) {
            return true;
        }
        return false;
    }
};