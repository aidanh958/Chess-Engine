function prep(board, color) {
    // done before any moves
}

function think(board, color) {
    let legalMoves = Helper.getLegalMoves(board, color);

    return legalMoves[Math.floor(Math.random()*legalMoves.length)];
}
