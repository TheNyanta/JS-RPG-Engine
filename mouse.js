/*
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
*/ 

/*
(function() {
    var mousePos;

    document.getElementById("game").onmousemove = handleMouseMove;
    setInterval(getMousePosition, 100); // setInterval repeats every X ms
    
    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    }
    function getMousePosition() {
        var pos = mousePos;
        if (!pos) {
            // We haven't seen any movement yet
        }
        else {
            // Use pos.x and pos.y
            mouse_x = pos.x-8;
            mouse_y = pos.y;
        }
    }
})();*/

var Mouse = function() {
    //TODO: implement below
    this.leftclick = false;
    this.rightclick = false;
    
    //Click start
    this.x1 = null;
    this.y2 = null;
    
    //Click end
    this.x2 = null;
    this.y2 = null;
};

function InitalizeMouse() {
    // get mouse position on move
    document.getElementById("game").onmousemove = handleMouseMove;
     
    function handleMouseMove(event) {
        var dim = document.getElementById("game").getBoundingClientRect();
        mouse_x = event.clientX - dim.left;
        mouse_y = event.clientY - dim.top;
    }                            
    
    // single click event
    $(document.getElementById("game")).click(function(e) {
        DisableScrollbar();
        
        //cameraX[mapID] = mouse_x;
        //cameraY[mapID] = mouse_y;
        
        // update charX/Y 
        //charX[mapID] = relativeX[mapID] + cameraX[mapID];
        //charY[mapID] = relativeY[mapID] + cameraY[mapID];
        
        //"click: " + (mouse_x+relativeX[mapID]) + ", " + (mouse_y+relativeY[mapID]) + 
        
        console.log("Clicked on Tile[" + Math.floor((mouse_x+relativeX[mapID])/16) + ", " + Math.floor((mouse_y+relativeY[mapID])/16)+"]");
    });
    
    // double click event
    document.getElementById("game").ondblclick = doubleClick;
    
    function doubleClick(event) {
        
    };
};