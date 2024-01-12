class bitboard {
    constructor() {
        this.board = {
            p: 0n,
            r: 0n,
            n: 0n,
            b: 0n,
            q: 0n,
            k: 0n,

            white: 0n,
            black: 0n,

            empty: 0n,
            moved: 0n
        };
        this.prevBoards = [];
    }
    fromFen(fen) {
        for (let i in this.board) {
            this.board[i] = 0n;
        }
        let index = 0;
        for (let i = 0; i < fen.length; i++) {
            if (fen[i] === "/") continue;
            if (String(Number(fen[i])) === fen[i]) {
                for (let e = 0; e < Number(fen[i]); e++) {
                    this.board.empty |= (1n << BigInt(index));
                    index++;
                }
                continue;
            }

            if (fen[i].toLowerCase() === fen[i]) {
                this.board.black |= (1n << BigInt(index));
            } else {
                this.board.white |= (1n << BigInt(index));
            }
            this.board[fen[i].toLowerCase()] |= (1n << BigInt(index));
            index++;
        }
        while (index < 64) {
            this.board.empty |= (1n << BigInt(index));
            index++;
        }
        this.board.moved &= 0n;
    }

    getPieceColor(index) {
        if ((this.board.empty & (1n << BigInt(index))) !== 0n) return 0;
        
        if ( (this.board.white & (1n << BigInt(index)) ) !== 0n) return 1;
        return 2;
    }
    getPiece(index) {
        let color = this.getPieceColor(index);

        if ( (this.board.p & (1n << BigInt(index))) !== 0n ) return (color==1)?"wp":"bp";
        if ( (this.board.r & (1n << BigInt(index))) !== 0n ) return (color==1)?"wr":"br";
        if ( (this.board.n & (1n << BigInt(index))) !== 0n ) return (color==1)?"wn":"bn";
        if ( (this.board.b & (1n << BigInt(index))) !== 0n ) return (color==1)?"wb":"bb";
        if ( (this.board.q & (1n << BigInt(index))) !== 0n ) return (color==1)?"wq":"bq";
        if ( (this.board.k & (1n << BigInt(index))) !== 0n ) return (color==1)?"wk":"bk";
        return false;
    }
    isEmpty(index) {
        return ((this.board.empty & (1n << BigInt(index))) !== 0n)?true:false;
    }
}





