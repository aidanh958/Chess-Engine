let c = document.getElementById("c");
let ctx = c.getContext("2d");

c.width = c.height = 500;

let board = new bitboard();
//board.fromFen("8/8/4p3/8/3K4");

let turn = true;

let images = {};
document.body.onload = function() {
    ["bp", "br", "bn", "bb", "bq", "bk", "wp", "wr", "wn", "wb", "wq", "wk"].forEach(p => {
        images[p] = document.getElementById(p.toString());
    });

    drawBoard(board);
}

function drawBoard(b) {
    for (let i = 0; i < 64; i++) {
        ctx.fillStyle = (((i%8)+Math.floor(i/8))%2)>0?"white":"black";
        ctx.fillRect(i%8*500/8, Math.floor(i/8)*500/8, 500/8, 500/8);

        if (b.isEmpty(i)) continue;
        let p = b.getPiece(i);

        if (p == false) {
            console.log("leak", i);
            continue;
        }
        ctx.drawImage( images[p] , i%8*500/8, Math.floor(i/8)*500/8, 500/8, 500/8 );
    }

    let moves = 0n;
    let allMoves = LegalMovesHelper.getAllLegalMoves( b, turn?1:2 );
    for (let i in allMoves) {
        moves |= allMoves[i][1];
    }

    /*ctx.fillStyle = "rgba(255,0,0,0.5)";
    for (let i = 0; i < 64; i++) {
        if ((moves & (1n << BigInt(i))) !== 0n) {
            ctx.fillRect(i%8*500/8, Math.floor(i/8)*500/8, 500/8, 500/8);
        }
    }*/
}

function highlight(bit) {
    for (let i = 0; i < 64; i++) {
        if ((bit & (1n << BigInt(i))) == 0n) continue;
    
        let x = i%8;
        let y = Math.floor(i/8);
        ctx.fillStyle = "rgba(0,0,255,0.5)";
        ctx.fillRect(x*500/8, y*500/8, 500/8, 500/8);
    }

}





let testPos = new bitboard();
testPos.fromFen("R6R/3Q4/1Q4Q1/4Q3/2Q/4Q/Q4Q2/pp1Q4/kBNNK1B"); // 218 legal moves

function runTest() {
    let times = 0;
    for (let i = 0; i < 1000; i++) {
        let sTime = performance.now();
        LegalMovesHelper.getAllLegalMoves(testPos, 2);
        LegalMovesHelper.getAllLegalMoves(testPos, 1);
        times += (performance.now()-sTime);
    }
    console.log("average time: ", times/1000, "\ntotalTime: ", times);
}




