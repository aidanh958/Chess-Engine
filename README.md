# Chess-Engine
## how to make the bot?
in the bots folder you can create a file the uses the API to create a bot.
at first there are 2 examples that in the bot folder "bot.js" and "example.js" these are basic example to help get started.
## API
### Helper.getLegalMoves(board, color);
the `Helper.getLegalMoves` function takes in the board and color. It will return something like:
```
[
  // [from, to],
  [[x, y], [x, y]]
  ...
]
```
### Helper.makeMove(board, from, to);
the `Helper.makeMove` function takes in the board and a pos from and pos to. You can easily optain legal positions using the `Helper.getLegalMoves` function. The function will act as if you just made the move and will mutate the board (only the bots version of the board).
### Helper.undoMove(board);
the `Helper.undoMove` takes in the board and will undo whatever move you just made with the `Helper.makeMove` function.
### Helper.getPiece(board, [x, y]);
the `Helper.getPiece` function takes in a board and a position. It fill return the type of piece at that position as a string. The string structure will look like: `wp` (white pawn) or `bp` (black pawn). The knight is `wn` or `bn` and the king is `wk` or `bk`.
### Helper.getColor(board, [x, y]);
the `Helper.getColor` function takes in a board and a position. It will return the color of the piece at that position. If the color is white then it will return `1` but if the color is black then it will return `2`. The color variable passed into the `think` function has the same format.
### Helper.isEmpty(board, [x, y]);
the `Helper.isEmpty` function takes in a board and a position. It will return true if there is nothing at that position or false if there is something there.
