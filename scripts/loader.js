var cookies = {
    screens: {},
    actors: {}
};

// Wait to load main document
window.addEventListener("load", function() {
    
    //Start dynamic loading
    Modernizr.load([
    {
        load: [
            "scripts/sizzle.js",
            "scripts/dom.js",
            "scripts/game.js",
            "scripts/screen.splash.js",
            "scripts/screen.main-menu.js"
        ],
        
        complete: function() {
            cookies.game.showScreen("splash-screen");
        }
    }]);
}, false);