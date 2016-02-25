var cookies = {
    screens: {}
    
};

// Wait to load main document
window.addEventListener("load", function() {
    Modernizr.addTest("standalone", function() {
        return (window.navigator.standalone != false);
    });
    //Start dynamic loading
    Modernizr.load([
        {
            //default scripts
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
        }
    ]);
    
}, false);