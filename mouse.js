window.clicked = false;
var MouseControls = function()
{
	this.x = 0;
	this.y = 0;
	this.velocityx = 0;	// Velocity at which mouse cursor is moving
	this.velocityy = 0;

	// Universal mouse button is down flag
	this.down = false; // Left click only (todo: rename to leftclickdown)

	// Separate flags for each mouse button

	// Which button was clicked up?
	this.leftclicked = false; // Middle button
	this.middleclicked = false; // Middle button
	this.rightclicked = false; // Right button

	// Which button was clicked down?
	this.leftdown = false; // Middle button
	this.middledown = false; // Middle button
	this.rightdown = false; // Right button

	var that = this;

	this.reset = () => {
		that.leftclicked = false;
		that.middleclicked = false;
		that.rightclicked = false;
		that.leftdown = false;
		that.middledown = false;
		that.rightdown = false;
	}

	this.Initialize = function(element)
	{
		$(element).on("mousemove", function(event) {
			var oldx = that.x;
			var oldy = that.y;
			that.x = event.pageX - $(element).offset().left;
			that.y = event.pageY - $(element).offset().top;
			that.velocityx = that.x - oldx;
			that.velocityy = that.y - oldy;
		});

		// Mouse button "released" / up
		$(element).on("click", function(e) {
			if (!e) var e = event;
			e.preventDefault();
			// Left mouse button up
			that.x = e.clientX - $(element).offset().left;
			that.y = e.clientY - $(element).offset().top;
			window.clicked = true; // Window was clicked (click-released) by any of the 3 buttons
			if (e.which == 1) that.leftclicked = true;	// left
			if (e.which == 2) that.middleclicked = true;	// middle
			if (e.which == 3) that.rightclicked = true;	// right
		});

		// A mouse button is "pressed" / down (any of the 3)
		$(element).on("mousedown", function(e) {
			if (!e) var e = event;
			e.preventDefault();
			that.down = true; // Any mouse button is pressed down
			if (e.which == 1) that.leftdown = true;	// left
			if (e.which == 2) that.middledown = true;	// middle
			if (e.which == 3) that.rightdown = true;	// right
		});
	}
}

var Mouse = new MouseControls();