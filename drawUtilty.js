var Point = function(_x, _y) {
    this.x = _x;
    this.y = _y;
    
    this.draw = function(size, color) {
        gfx.beginPath();
        gfx.arc(this.x, this.y, size, 0, 2 * Math.PI, true);
        // Fill
        gfx.fillStyle = color;
        gfx.fill();
        // Outline
        gfx.strokeStyle = color;
        gfx.stroke();
    };
};

var Segment = function(x, y, vecx, vecy) {
    this.x = x;
    this.y = y;
    this.vecx = vecx;
    this.vecy = vecy;
    
    this.draw = function(width, color) {
        gfx.beginPath();
        gfx.lineWidth = width; //2px
        gfx.moveTo(this.x, this.y);
        gfx.lineTo(this.x + vecx, this.y + vecy);
        gfx.strokeStyle = color;
        gfx.stroke();
    }
    
    this.length = function() {
        var dx = this.vecx;
        var dy = this.vecy;
        return Math.sqrt(dx * dx + dy * dy);
    }
};

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
        gfx = myGameArea.context;
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

var Vector = function(_x, _y) {
    this.x = _x;
    this.y = _y;
    
    this.draw = function(size, color) {
        gfx.beginPath();
        gfx.arc(this.x, this.y, size, 0, 2 * Math.PI, true);
        // Fill
        gfx.fillStyle = color;
        gfx.fill();
        // Outline
        gfx.strokeStyle = color;
        gfx.stroke();
    }
    
    this.add = function(vector) {
        return new Vector(this.x += vector.x, this.y += vector.y);
    }
    
    this.subtract = function(vector) {
        return new Vector(this.x -= vector.x, this.y -= vector.y);
    }
    
    this.multiply = function(multiplier) {
        return new Vector(this.x *= multiplier, this.y *= multiplier);
    }
    
    this.length = function () {
        //sqrt resource intensive?
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    this.cross = function(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
    
    this.dot = function(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    
};

var gameSequence = false;
var dialogText = "";

function DrawDialog(text, img, isChat) {
    var box = new Rectangle(0, 0, canvasWidth, 50);
    var chatCounter = 0;
    box.draw('black',true);
    
    var dialog = document.getElementById('game').getContext('2d');
    dialog.font = '30px serif';
    dialog.fillStyle = 'white';
    dialog.fillText(text, 50, 35);
    
    if (img != undefined) {
        img.draw2(0, 0, 50, 50);
    }
    // Stop all motions if its a chat sequence
    if (isChat) {
        gameSequence = true;
    }
}