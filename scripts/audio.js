cookies.audio = (function () {
	"use strict";
	var birdSound,
        popSound,
        deadSound,
        eatSound,
        boostSound,
        gravitySound,
            
        sounds = {
            bird: "resources/ball.m4a",
            pop: "resources/pop.mp3",
            dead: "resources/bird.mp3",
            eatCookie: "resources/eat.mp3",
            boost: "resources/boost.mp3",
            gravity: "resources/gravity.mp3"
        };
    
        birdSound = new Audio(sounds.bird); //initialize audio object
    popSound = new Audio(sounds.pop); //initialize audio object
    deadSound = new Audio(sounds.dead); //initialize audio object
    eatSound = new Audio(sounds.eatCookie); //initialize audio object
    boostSound = new Audio(sounds.boost); //initialize audio object
    gravitySound = new Audio(sounds.gravity); //initialize audio object
    
        //add mute button later
    // birdSound.muted = true;
    // popSound.muted = true;
    // deadSound.muted = true;
    // eatSound.muted = true;
}());