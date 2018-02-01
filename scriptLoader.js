// All script that need to be loaded
var scriptsToLoad = ['jquery-3.2.1.js','game.js','astar.js','constants.js','camera.js','utility.js','animate.js','component.js','control.js','map.js','collision.js','data.js'];
scriptsToLoad.forEach(function(src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.getElementById("gameScripts").appendChild(script);
});