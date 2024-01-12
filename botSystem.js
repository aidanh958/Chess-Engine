importScripts("./bitboard.js");
importScripts("./legalMoves.js");

let Helper = {
    getPiece: function(board, pos) {
        return board.getPiece(pos[1]*8+pos[0]);
    },
    getColor: function(board, pos) {
        return board.getPieceColor(pos[1]*8+pos[0]);
    },
    makeMove: function(board, from, to) {
        board.prevBoards.push(structuredClone(board.board));
        
        let col = board.getPieceColor(from[1]*8+from[0]);
        let mov = LegalMovesHelper.makeMove(board, from[1]*8+from[0], to[1]*8+to[0], col);
        
        return mov;
    },
    undoMove: function(board) {
        board.board = board.prevBoards.pop();
    },
    getLegalMoves: function(board, color) {
        let moves = LegalMovesHelper.getAllLegalMoves(board, color);

        let out = [];
        for (let i in moves) {
            for (let e = 0; e < 64; e++) {
                if ((moves[i][1] & (1n << BigInt(e))) == 0n) continue;
                //out.push([moves[i][0], e]);

                out.push([
                    [moves[i][0]%8, Math.floor(moves[i][0]/8)], 
                    [e%8, Math.floor(e/8)]
                ]);
            }
        }
        return out;
    },
    isEmpty: function(board, pos) {
        return board.isEmpty(pos[1]*8+pos[0]);
    },
};

onmessage = function(e) {
    let b = new bitboard();
    b.board = e.data.board;

    for (let i in b.board) {
        b.board[i] = BigInt(b.board[i]);
    }

    if (e.data.type === "setup") {
        importScripts(e.data.src);
        if (prep) {
            prep( b, e.data.color );
        }
        postMessage({ type: "ready" });
    } else {
        let result = think(b, e.data.color);
        let from = result[0][1]*8+result[0][0];
        let to = result[1][1]*8+result[1][0];

        postMessage({ 
            type: "result", 
            color: e.data.color, 
            data: [from, to]
        });
    }
}
