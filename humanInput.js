let mouse = {
    clicked: false,
    prev: 0,
    now: 0
}

c.onclick = function(e) {
    let x = e.clientX-(window.innerWidth/2-250);
    let y = e.clientY-(window.innerHeight/2-250);

    let bx = Math.floor(x/(500/8));
    let by = Math.floor(y/(500/8));

    if (!mouse.clicked) {
        if (!board.isEmpty(by*8+bx)) {
            mouse.clicked = true;
            mouse.prev = by*8+bx;
        }
    } else {
        let mov = LegalMovesHelper.makeMove(board, mouse.prev, by*8+bx, turn?1:2);

        mouse.clicked = false;
        mouse.prev = 0;
        drawBoard(board);
        
        if (mov) {
            turn = !turn;
            Update();
        }
    }
}










