let LegalMovesHelper = {
    getAllLegalMoves: function(board, color) {
        let moves = this.getAllMoves(board, color);

        for (let i in moves) {
            for (let e = 0; e < 64; e++) {
                if ((moves[i][1] & (1n << BigInt(e))) == 0n) continue;
                let p = board.getPiece(moves[i][0]).split("");
                let p2;
                let wasEmpty = board.isEmpty(e);
                if (!wasEmpty) {
                    p2 = board.getPiece(e).split("");
                }

                let pb = board.board[p[1]];
                let eb = board.board.empty;
                let cb = board.board[p[0]==="w"?"white":"black"]; 
                let ppb, pcb;
                if (!wasEmpty) {
                    ppb = board.board[p2[1]];
                    pcb = board.board[p2[0]==="w"?"white":"black"];
                }


                board.board.empty &= ~(1n << BigInt(e));
                board.board.empty |= (1n << BigInt( moves[i][0] ));
                
                board.board[p[1]] &= ~(1n << BigInt( moves[i][0] ));
                board.board[p[1]] |= (1n << BigInt(e));

                board.board[p[0]==="w"?"white":"black"] &= ~(1n << BigInt( moves[i][0] ));
                board.board[p[0]==="w"?"white":"black"] |= (1n << BigInt( e ));

                if (!wasEmpty) {
                    board.board[p2[1]] &= ~(1n << BigInt( e ));
                    board.board[p2[0]==="w"?"white":"black"] &= ~(1n << BigInt(e));
                }

                if (this.inCheck(board, color)) {
                    moves[i][1] &= ~(1n << BigInt(e));
                }

                board.board[p[1]] = pb;
                board.board.empty = eb;
                board.board[p[0]==="w"?"white":"black"] = cb;
                if (!wasEmpty) {
                    board.board[p2[1]] = ppb;
                    board.board[p2[0]==="w"?"white":"black"] = pcb;
                }
            }
        }

        return moves;
    },
    inCheck: function(board, color) {
        let col = color==1?"white":"black";
        let ocol = color==1?"black":"white";
        let kingMask = board.board.k & board.board[col];
        for (let i = 0; i < 64; i++) {
            if ((kingMask & (1n << BigInt(i))) == 0n) continue;
            
            let rMask = board.board.r & board.board[ocol];
            let bMask = board.board.b & board.board[ocol];
            let nMask = board.board.n & board.board[ocol];
            let qMask = board.board.q & board.board[ocol];
            let kMask = board.board.k & board.board[ocol];
            let pMask = board.board.p & board.board[ocol];

            let rmMask = this.handleRook(board, i);
            let bmMask = this.handleBishop(board, i);
            let nmMask = this.handleKnight(board, i);
            let kmMask = this.handleKing(board, i);
            let pmMask;
            if (color==1) {
                pmMask = this.handleWhitePawnAttacks(board, i);
            } else {
                pmMask = this.handleBlackPawnAttacks(board, i);
            }

            let hit = ( pMask & pmMask ) | ( kMask & kmMask ) | ( rMask & rmMask ) | ( bMask & bmMask ) | ( nMask & nmMask ) | ( qMask & (rmMask|bmMask) );
            
            return hit==0n?false:true;
        }
    },

    getAllMoves: function(board, color) {
        let moves = [];
        for (let i = 0; i < 64; i++) {
            if (board.isEmpty(i) || board.getPieceColor(i) !== color) continue;
            moves.push([i, this.getMoves(board, i)]);
        }

        return moves;
    },


    getMoves: function(board, index) {
        let moves = 0n;
        
        let p = board.getPiece(index).split("");
        if ( p[1] === "p" ) {
            if (p[0] === "w") {
                moves = this.handleWhitePawn(board, index) | this.handleWhitePawnAttacks(board, index);
            } else {
                moves = this.handleBlackPawn(board, index) | this.handleBlackPawnAttacks(board, index);
            }
        }
        if ( p[1] === "r" ) moves = this.handleRook(board, index);
        if ( p[1] === "n" ) moves = this.handleKnight(board, index);
        if ( p[1] === "b" ) moves = this.handleBishop(board, index);
        if ( p[1] === "q" ) moves = this.handleQueen(board, index);
        if ( p[1] === "k" ) moves = this.handleKing(board, index);

        return moves & ~board.board[ p[0]==="w"?"white":"black" ];
    },

    handleWhitePawnAttacks: function(board, index) {
        let moves = 0n;
        if (index%8 > 0 && !board.isEmpty(index-9) && board.getPieceColor(index-9) !== 1) {
            moves |= (1n << BigInt(index-9));
        }
        if (index%8 < 7 && !board.isEmpty(index-7) && board.getPieceColor(index-7) !== 1) {
            moves |= (1n << BigInt(index-7));
        }
        return moves;
    },
    handleBlackPawnAttacks: function(board, index) {
        let moves = 0n;
        if (index%8 < 7 && !board.isEmpty(index+9) && board.getPieceColor(index+9) !== 2) {
            moves |= (1n << BigInt(index+9));
        }
        if (index%8 > 0 && !board.isEmpty(index+7) && board.getPieceColor(index+7) !== 2) {
            moves |= (1n << BigInt(index+7));
        }
        return moves;
    },

    handleBlackPawn: function(board, index) {
        let moves = 0n; //this.handleBlackPawnAttacks(board, index);
        let x = index%8;
        let y = Math.floor(index/8);

        if (board.isEmpty((y+1)*8+x)) {
            moves |= (1n << BigInt((y+1)*8+x));
            if (y < 2 && board.isEmpty((y+2)*8+x)) {
                moves |= (1n << BigInt((y+2)*8+x));
            }
        }
        return moves;
    },
    handleWhitePawn: function(board, index) {
        let moves = 0n; //this.handleWhitePawnAttacks(board, index);
        let x = index%8;
        let y = Math.floor(index/8);

        if (board.isEmpty((y-1)*8+x)) {
            moves |= (1n << BigInt((y-1)*8+x));
            if (y > 5 && board.isEmpty((y-2)*8+x)) {
                moves |= (1n << BigInt((y-2)*8+x));
            }
        }
        return moves;
    },
    handleRook: function(board, index) {
        let moves = 0n;
        let px = index%8;
        let py = Math.floor(index/8);

        for (let x = px-1; x >= 0; x--) {
            moves |= (1n << BigInt(py*8+x));
            if (!board.isEmpty(py*8+x)) break;
        }
        for (let x = px+1; x < 8; x++) {
            moves |= (1n << BigInt(py*8+x));
            if (!board.isEmpty(py*8+x)) break;
        }
        for (let y = py-1; y >= 0; y--) {
            moves |= (1n << BigInt(y*8+px));
            if (!board.isEmpty(y*8+px)) break;
        }
        for (let y = py+1; y < 8; y++) {
            moves |= (1n << BigInt(y*8+px));
            if (!board.isEmpty(y*8+px)) break;
        }
        
        return moves;
    },
    handleKnight: function(board, index) {
        let moves = 0n;
        let x = index%8;
        let y = Math.floor(index/8);
        if (y+2<8 && x+1<8) moves |= (1n << BigInt((y+2)*8+(x+1)));
        if (y+2<8 && x-1>=0) moves |= (1n << BigInt((y+2)*8+(x-1)));
        if (y-2>=0 && x+1<8) moves |= (1n << BigInt((y-2)*8+(x+1)));
        if (y-2>=0 && x-1>=0) moves |= (1n << BigInt((y-2)*8+(x-1)));
        if (y+1<8 && x+2<8) moves |= (1n << BigInt((y+1)*8+(x+2)));
        if (y+1<8 && x-2>=0) moves |= (1n << BigInt((y+1)*8+(x-2)));
        if (y-1>=0 && x+2<8) moves |= (1n << BigInt((y-1)*8+(x+2)));
        if (y-1>=0 && x-2>=0) moves |= (1n << BigInt((y-1)*8+(x-2)));
        return moves;
    },
    handleBishop: function(board, index) {
        let moves = 0n;
        let x = index%8;
        let y = Math.floor(index/8);
        for (let i = 1; i < 8; i++) {
            if (x+i >= 8 || y+i >= 8) break;
            moves |= (1n << BigInt( (y+i)*8+(x+i) ));
            if (!board.isEmpty( (y+i)*8+(x+i) )) break;
        }
        for (let i = 1; i < 8; i++) {
            if (x-i < 0 || y+i >= 8) break;
            moves |= (1n << BigInt( (y+i)*8+(x-i) ));
            if (!board.isEmpty( (y+i)*8+(x-i) )) break;
        }
        for (let i = 1; i < 8; i++) {
            if (x+i >= 8 || y-i < 0) break;
            moves |= (1n << BigInt( (y-i)*8+(x+i) ));
            if (!board.isEmpty( (y-i)*8+(x+i) )) break;
        }
        for (let i = 1; i < 8; i++) {
            if (x-i < 0 || y-i < 0) break;
            moves |= (1n << BigInt( (y-i)*8+(x-i) ));
            if (!board.isEmpty( (y-i)*8+(x-i) )) break;
        }
        return moves;
    },
    handleQueen: function(board, index) {
        return this.handleRook(board, index) | this.handleBishop(board, index);
    },
    handleKing: function(board, index) {
        let moves = 0n;
        let px = index%8;
        let py = Math.floor(index/8);
        let color = board.getPieceColor(index);
        let prevKing = board.board.k;
        let prevEmpty = board.board.empty;
        for (let y = Math.max(py-1, 0); y <= Math.min(py+1, 7); y++) {
            for (let x = Math.max(px-1, 0); x <= Math.min(px+1, 7); x++) {
                if (x == px && y == py) continue;
                moves |= (1n << BigInt(y*8+x));
            }
        }

        if ((board.board.moved & (1n << BigInt(index))) == 0n) {
            let lr = Math.floor(index/8)*8;
            if ((board.board.moved & (1n << BigInt(lr))) == 0n && board.isEmpty(lr+1) && board.isEmpty(lr+2) && board.isEmpty(lr+3)) {
                moves |= (1n << BigInt(lr));
            }
            let rr = Math.floor(index/8)*8+7;
            if ((board.board.moved & (1n << BigInt(rr))) == 0n && board.isEmpty(rr-1) && board.isEmpty(rr-2)) {
                moves |= (1n << BigInt(rr));
            }
        }
       
        return moves;
    },



    movePiece: function(board, from, to) {
        let p = board.getPiece(from);
        let color = board.getPieceColor(from)==1?"white":"black";
        // move empty
        board.board.empty |= (1n << BigInt(from));
        board.board.empty &= ~(1n << BigInt(to));

        // move color
        board.board[color] &= ~(1n << BigInt(from));
        board.board[color] |= (1n << BigInt(to));

        // move piece
        board.board[p[1]] &= ~(1n << BigInt(from));
        board.board[p[1]] |= (1n << BigInt(to));

        board.board.moved |= (1n << BigInt(to));
        board.board.moved |= (1n << BigInt(from));
    },

    makeMove(board, from, to, color) {
        let bx = to%8;
        let by = Math.floor(to/8);
        let p = board.getPiece(from).split("");
        if (p[1] == "k" && ( board.board.moved & (1n << BigInt(from))) == 0n) {
            if ( 
                by == Math.floor(from/8) && bx == 0 && 
                (board.board.moved&(1n<<BigInt(by*8))) == 0n &&
                board.isEmpty(by*8+1) && board.isEmpty(by*8+2) && board.isEmpty(by*8+3)
            ) {
                this.movePiece(board, from, by*8+1);
                this.movePiece(board, by*8, by*8+2);
                return true;
            }else if ( 
                by == Math.floor(from/8) && bx == 7 && 
                (board.board.moved&(1n<<BigInt(by*8+7))) == 0n &&
                board.isEmpty(by*8+6) && board.isEmpty(by*8+5)
            ) {
                this.movePiece(board, from, by*8+6);
                this.movePiece(board, by*8+7, by*8+5);
                return true;
            }
        }

        let lMoves = this.getAllLegalMoves(board, color);
        for (let i in lMoves) {
            if (lMoves[i][0] !== from) continue;

            let ind = (1n << BigInt( by*8+bx ));
            if ((lMoves[i][1] & ind) !== 0n) {
                for (let i in board.board) {
                    board.board[i] &= ~(1n << BigInt(by*8+bx));
                }

                this.movePiece(board, from, by*8+bx);

                return true;
            }
        }

        return false;
    },

    undoMove: function(board) {
        board.board = board.prevBoards.pop();
    },


    canMove: function(board, color) {
        let lMoves = this.getAllLegalMoves(board, color);
        for (let i in lMoves) {
            if (lMoves[i][1] !== 0n) {
                return true;
            }
        }
        return false;
    }
};
