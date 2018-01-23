function startGame() {
    // Load Scripts
    var scripts = ['astar.js','constants.js','camera.js','utility.js','animate.js','component.js','control.js','map.js','collision.js','data.js'];
    var loadCounter = 0;
    for (var i = 0; i < scripts.length; i++) {
        $.getScript(scripts[i], function() {
            loadCounter++;
        });
    }  
    function loadCheck () {
        if (scripts.length == loadCounter) {
            console.log("Finshed loading!");
            myGameArea.init();
            myGameArea.start();
        }
        else {
            console.log("Loading ...");
            setTimeout(function() {
                loadCheck();
            }, 100);
        }
    }
    // Starts after all the scripts are loaded
    loadCheck();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    init : function() {
        // INITIALIZE CANVAS
        //this.canvas = document.getElementById("game"); // if canvas is in the html file
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.canvas.id = "game";
        
        // Pause game if not selected
        document.active = true;
        $(window).focus(function() {document.active = true;});
        $(window).blur(function() {document.active = false;});
        
        //this.canvas.style.cursor = "none"; //hide the original cursor
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        this.frameNo = 0;
        
        // ANIMATIONCOUNTER
        InitalizeAnimationCounters();
        
        window.requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(f){return setTimeout(f, 1000/60)}; // simulate calling code 60 
 
        window.cancelAnimationFrame = window.cancelAnimationFrame
        || window.mozCancelAnimationFrame
        || function(requestID){clearTimeout(requestID)}; //fall back
        
        // INITIALIZE USER INPUT       
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
        window.addEventListener('mousedown', function (e) {
            myGameArea.mousedown = true;
            myGameArea.clickX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
            
            if (myGameArea.clickX > 0 && 
                myGameArea.clickY > 0 &&
                myGameArea.clickX < document.getElementById("game").width &&
                myGameArea.clickY < document.getElementById("game").height)
                myGameArea.clicked = true;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.mousedown = false;
            //myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            //myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchstart', function (e) {
            myGameArea.touchdown = true;
            myGameArea.clickX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchend', function (e) {
            myGameArea.touchdown = false;
            //myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            //myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].clientX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.touches[0].clientY - myGameArea.canvas.getBoundingClientRect().top;
        })
        
    },
    
    start : function() {
        
        // Old gameLoop
        //this.interval = setInterval(function() { ResetAnimationCounter(); updateGameArea();} , 16);

        // New gameLoop
        function gameLoop() {
            requestAnimationFrame(gameLoop);
            if (document.active) {
                ResetAnimationCounter();
                updateGameArea();
            }
        }
        
        gameLoop();      
    },
    
    stop : function() {
        
    },
        
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

var before,now,fps;
before=Date.now();
fps=0;

function showFPS() {
    ctx = myGameArea.context;
    ctx.font =  "bold 20px red";
    ctx.fillStyle = "black";
    ctx.fillText("FPS : " + fps, 400, 20);
}

// Update Canvas
function updateGameArea() {
    myGameArea.frameNo += 1;
      
    // FPS update
    now=Date.now();
    if (myGameArea.frameNo == 1 || everyinterval(30)) {fps=Math.round(1000/(now-before)); }
    before=now;
    
    control1.update();
    control2.update();
    control3.update();
    
    // Object Object Collison TODO: generalize for all objects on the current map
    /*if (character.crashWith(cat, character.speedX, character.speedY)) {
        character.isFacing();
        character.speedX = 0;
        character.speedY = 0;
        
    }
    if (cat.crashWith(character, cat.speedX, cat.speedY)) {
        cat.isFacing();
        cat.speedX = 0;
        cat.speedY = 0;
        
    }*/
    
    maps[mapID].updateBackground();
    
    character_collision.mapCollsion();
    cat_collision.mapCollsion();
    
    if (character.animation.direction == DIR_N) {
        char_front.x = Math.floor((character.x+ 4)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16-16)/16)*16 - gameCamera.y;
    }
    if (character.animation.direction == DIR_S) {
        char_front.x = Math.floor((character.x+ 4)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16+16)/16)*16 - gameCamera.y;
    }
    if (character.animation.direction == DIR_W) {
        char_front.x = Math.floor((character.x+ 4-16)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16)/16)*16 - gameCamera.y;
    }
    if (character.animation.direction == DIR_E) {
        char_front.x = Math.floor((character.x+ 4+15)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16)/16)*16 - gameCamera.y;
    }
    
    character_collision.update();
    cat_collision.update();
    
    /*
    maps_objects.sort(this.y);
    maps_objects.reverse(); // Shows both o.O
    for (var i = 0; i < maps_objects.length; i++)
        maps_objects[i].update();
        */
    
    
    // Objects incl. character: TODO: Automatic Order update() after Y-coordinate - smaller y first
    if (character.y > cat.y) {
        cat.update(); 
        character.update();
    }
    else {
        character.update(); 
        cat.update(); 
    }    
    
    maps[mapID].updateForeground();
    
    gameCamera.update();

    showFPS();

}