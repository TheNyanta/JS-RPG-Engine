// All script that need to be loaded
var scriptsToLoad = [
    'game.js',
    'astar.js',
    'utility.js',
    'core.js',
    'data.js'];
scriptsToLoad.forEach(function (src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.getElementById("gameScripts").appendChild(script);
});
