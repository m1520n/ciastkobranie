cookies.screens["play"] = (function() {
    var dom = cookies.dom,
        input = cookies.input,
        audio = cookies.audio,
        board = cookies.board;
    
    function run() {
        board.createGameScreen();
        board.drawSpikes();
    }
    
    return {
        run : run
    };
    
})();