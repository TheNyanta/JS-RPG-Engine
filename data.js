// Sprites
var character = new Sprite("CharSet/character.png", 24, 32, 8, 12);
var cat = new Sprite("CharSet/cat.png", 24, 32, 8 , 12);
var bananaphone = new Sprite("FaceSet/bananaphone.png");
var forest = new Sprite("FaceSet/forest.png");
var snowflake = new Sprite("FaceSet/snowflake.png");

// Panoramas
var sheeps = new Sprite("Panorama/AngrySheeps.jpg", 320, 240, 1, 1);
var sunset = new Sprite("Panorama/sunset1.png", 320, 240, 1, 1);

// Music
var audio1 = new Audio('Music/banana-phone.ogg');
var audio2 = new Audio('Music/forest.ogg');
var audio3 = new Audio('Music/snow.ogg');

// Sounds
var catsound = new Audio('Sound/cat.m4a');

audio1.volume = 0.2;
audio2.volume = 0.2;
audio3.volume = 0.2;
catsound.volume = 0.2;