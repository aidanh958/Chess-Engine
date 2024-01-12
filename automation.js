let mode = 0;
// mode 0: human vs bot
// mode 1: bot vs bot
// mode 2: bot vs bot (endless)

let src = {
    bot: "./bots/example.js",

    botA: "./bots/example.js",
    botB: "./bots/bot.js"
};

let bots = [];
let textOut = document.getElementById("text");
let wElm = document.getElementById("wScore");
let dElm = document.getElementById("dScore");
let lElm = document.getElementById("lScore");

let scores = [0, 0, 0];

setup();
function setup() {
    board.fromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    bots = [];
    if (mode == 0) {
        // human vs bot
        bots.push(new BotHandler(src.bot, 2));
    } else {
        // bot vs bot
        bots.push(new BotHandler(src.botA, 1));
        bots.push(new BotHandler(src.botB, 2));
        
        if (mode == 2) {
            wElm.style.display = "block";
            dElm.style.display = "block";
            lElm.style.display = "block";

            let total = Math.max(1, scores[0]+scores[1]+scores[2]);
            wElm.style.width = ((scores[1]/total)*500) + "px";

            lElm.style.width = ((scores[0]/total)*500) + "px";
            lElm.style.transform = "translateX(" + ( 250-((scores[0]/total)*500) ) + "px) translateY(-255px)";
        }

        Update();
    }
}










function Update() {
    for (let i = 0; i < 8; i++) {
        if ((board.board.p & (1n << BigInt(i))) == 0n) continue;
        board.board.p &= ~(1n << BigInt(i));
        board.board.q |= (1n << BigInt(i));
    }
    for (let i = 56; i < 64; i++) {
        if ((board.board.p & (1n << BigInt(i))) == 0n) continue;
        board.board.p &= ~(1n << BigInt(i));
        board.board.q |= (1n << BigInt(i));
    }

    let lMoves = LegalMovesHelper.canMove(board, turn?1:2);
    if (!lMoves) {
        if (LegalMovesHelper.inCheck(board, turn)) {
            // checkmate
            let col = turn==1?"black":"white";
            console.log(col + " wins!");
            textOut.innerHTML = col + " wins!";
            if (mode == 2) { scores[turn?0:1]++; setup()};
            return;
        }

        // stalemate
        console.log("stalemate");
        textOut.innerHTML = "stalemate";
        if (mode == 2) { scores[2]++; setup()};
        return;
    }

    let pieces = {r: 0, n: 0, b: 0, q: 0, p: 0};
    for (let i = 0; i < 64; i++) {
        if ((board.board.r & (1n << BigInt(i))) !== 0n) {pieces.r++}
        if ((board.board.n & (1n << BigInt(i))) !== 0n) {pieces.n++}
        if ((board.board.b & (1n << BigInt(i))) !== 0n) {pieces.b++}
        if ((board.board.q & (1n << BigInt(i))) !== 0n) {pieces.q++}
        if ((board.board.p & (1n << BigInt(i))) !== 0n) {pieces.p++}
    }
    let total = pieces.r+Math.max(0, pieces.n-1)+Math.max(0, pieces.b-1)+pieces.q+pieces.p;
    if (total <= 0) {
        console.log("draw");
        textOut.innerHTML = "draw";
        if (mode == 2) { scores[2]++; setup()};
        return;
    }

    if (mode == 0 && !turn) {
        bots[0].getMove(board);
    } else if (mode == 1 || mode == 2) {
        bots[turn?0:1].getMove(board);
    }
}



