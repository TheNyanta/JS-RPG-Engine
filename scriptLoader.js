// All script that need to be loaded
var scriptsToLoad = ['jquery-3.2.1.js','game.js','astar.js','constants.js','camera.js','utility.js','component.js','control.js','map.js','dialog.js','data.js'];
scriptsToLoad.forEach(function(src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.getElementById("gameScripts").appendChild(script);
});