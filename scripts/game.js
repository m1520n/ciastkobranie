/*
// This Module is responsible for redirecting between game modules
*/

cookies.game = (function () {
    var dom = cookies.dom,
    	$ = dom.$;
    
    //hides active screen and displys the one with given id
    function showScreen(screenId) {
        var activeScreen = $("#game .screen.active")[0],
            screen = $("#" + screenId)[0];
        if (activeScreen) {
            dom.removeClass(activeScreen, "active");
        }
        cookies.screens[screenId].run();
        dom.addClass(screen, "active");
    }
    
        
    return {
        showScreen: showScreen
    };
}());