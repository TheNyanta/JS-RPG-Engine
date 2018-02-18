var audio = {
    data : []
}

function addAudio(src) {
    audio.data.push(new Audio(src));
    audio.data[audio.data.length-1].id = audio.data.length-1;
    audio.data[audio.data.length-1].volume = 0.2;
    // Datastring
    myGameArea.data += "addAudio(new Audio(" + src + ");\n";
}