cookies.screens["main-menu"] = (function() {
    var dom = cookies.dom,
        game = cookies.game,
        firstRun = true;
    
    function setup() {
        dom.bind("#main-menu ul.menu", "click", function(e) {
            if (e.target.nodeName.toLowerCase() === "button") {
                var action = e.target.getAttribute("name");
                game.showScreen(action);
            }
        });
    }
    
    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
    }
    
    return {
        run: run
    };
})();
                                