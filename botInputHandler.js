class BotHandler {
    constructor(src, color) {
        this.src = src;
        this.color = color;
        this.brain = new Worker("./botSystem.js");
        this.ready = false;

        this.brain.onmessage = function(e) {

            if (e.data.type === "ready") {
                this.ready = true;                
            } else if (e.data.type === "result") {
                if (e.data.color !== (turn?1:2)) {
                    // illegal move
                    console.log("illegal move, ", e.data.color, turn?1:2);
                    textOut.innerHTML = "illegal move";    
                    return;
                }
                let mov = LegalMovesHelper.makeMove(board, e.data.data[0], e.data.data[1], e.data.color);
                if (!mov) {
                    // illegal move
                    console.log("illegal move");
                    textOut.innerHTML = "illegal move";
                }

                turn = !turn;
                Update();
            }

            drawBoard(board);
        }

        this.brain.postMessage({type: "setup", color: this.color, board: board.board, src: src});
    }

    getMove(board) {
        this.brain.postMessage({type:"move", board: board.board, color: this.color});
    }
}
