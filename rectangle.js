var Rectangle = function(x, y, width, height)
{
	this.x = x;
	this.y = y;
    this.centerX = x + width/2;
    this.centerY = y + height/2;
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
    
    this.pointInside = function(px, py)
	{
		var px = px;
		var py = py;
		if (arguments.length == 1) {
			var pt = new Point(px.x, px.y);
			px = pt.x;
			py = pt.y;
		}
		if (px >= this.x && px <= this.x + this.width)
		{
			if (py >= this.y && py <= this.y + this.height)
			{
				return true;
			}
		}
		return false;
	}
};