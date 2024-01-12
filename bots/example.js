let pieceValue = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 8,
    k: 15
}

function prep(board, color) {}

function think(board, color) {
    let legalMoves = Helper.getLegalMoves(board, color); // get all the legal moves

    let bestScore = -Infinity; // keep track of the score for the best move
    let bestIndex = 0; // keep track of the actuall best move
    for (let i = 0; i < legalMoves.length; i++) { // loop through the legal moves
        Helper.makeMove(board, legalMoves[i][0], legalMoves[i][1]); // make the move

        let ev = evaluate(board, color) + (Math.random()*2-1)*0.1; // evaluate the board
        if (ev > bestScore) { // if new board score > bestScore
            bestScore = ev; // set best score to new score
            bestIndex = i; // set best move to this move
        }

        Helper.undoMove(board); // undo move to continue loop
    }

    return legalMoves[bestIndex]; // return move
}

function evaluate(board, color) {
    let evaluation = 0;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if ( Helper.isEmpty(board, [x, y]) ) continue;

            let p = Helper.getPiece(board, [x, y]).split("");
            let col = Helper.getColor(board, [x, y]);
            evaluation += pieceValue[p[1]] * (col==color)?1:-1;
        }
    }

    return evaluation;
}



