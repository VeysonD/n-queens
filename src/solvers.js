/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = new Board({n: n});
  //console.log(board.rows());
  //board.togglePiece(0, 3);
  for (var i = 0; i < solution.rows().length; i += 1) {
    //console.log('running');
    for (var j = 0; j < solution.rows().length; j += 1) {
      solution.togglePiece(i, j);
      if (solution.hasAnyRowConflicts() || solution.hasAnyColConflicts()) {
        //console.log('winning');
        solution.togglePiece(i, j);
      }
    }
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var solutionBoard = new Board({n: n});
  var traverseBoard = function(row) {
    if (row === n) {
      solutionCount += 1;
      return;
    }
    for (var j = 0; j < n; j += 1) {
      solutionBoard.togglePiece(row, j);
      if (!solutionBoard.hasAnyRooksConflicts()) {
        traverseBoard(row + 1);
      }
      solutionBoard.togglePiece(row, j);
    }
  };
  traverseBoard(0);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);

  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  //debugger;
  //var solutionBoard = new Board({n:n});
  var solutionBoard = new Board({n: n});
  var solution = solutionBoard.rows(); //solution;
  var traverseBoard = function(row) {
    if (row === n) {
      console.log(solutionBoard.rows());
      return solution = solutionBoard.rows().map(function(row) { return row.slice();} );
    }
    for (var j = 0; j < n; j += 1) {
      solutionBoard.togglePiece(row, j);
      if (!solutionBoard.hasAnyQueensConflicts()) {
        traverseBoard(row + 1);
      }
      solutionBoard.togglePiece(row, j);
    }
  };
  traverseBoard(0);
  console.log(solution);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var myBoard = new Board({n: n});

  if (n === 2 || n === 3) {
    return solutionCount;
  }
  var traverseRow = function(row) {
    //base case
    //completed entire row traversal
    if (row === n) {
      solutionCount++;
      return;
    }
    //iterate through the rows
    for (var i = 0; i < n; i++) {
      //togglePiece on column
      myBoard.togglePiece(row, i);
      //if the row has no conflicts on column and row
      //traverseRow next row until count reaches limit of matrix (n)
      if (!myBoard.hasAnyQueensConflicts()) {
        traverseRow(row + 1);
      }
      myBoard.togglePiece(row, i);
    }
  };

  traverseRow(0);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};
