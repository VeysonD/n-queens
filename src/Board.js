// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },
    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var count = 0;

      for (var i = 0; i < row.length; i++) {
        count += row[i];
      }
      return count > 1 ? true : false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var matrixLength = this.attributes.n;
      //console.log(matrixLength);
      for (var i = 0; i < matrixLength; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var matrixLength = this.attributes.n;
      var column = [];
      for (var i = 0; i < matrixLength; i += 1) {
        column.push(this.get(i)[colIndex]);
      }
      var conflictCount = column.reduce(function(add, num) {
        return add + num;
      });
      return conflictCount > 1 ? true : false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var matrixLength = this.attributes.n;
      for (var i = 0; i < matrixLength; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(matrixCoordinates) {
      var diagonal = [];
      var matrixLength = this.attributes.n;
      var i, j;
      if (matrixCoordinates[0] === 0 && matrixCoordinates[1] === 0) {
        i = 0;
        j = 0;
        while (j < matrixLength) {
          diagonal.push(this.get(i)[j]);
          i += 1;
          j += 1;
        }
        var conflictCount = diagonal.reduce(function(add, num) {
          return add + num;
        });
        return conflictCount > 1;
      } else if (matrixCoordinates[0] === 0) { //going to the right
        i = 0;
        j = matrixCoordinates[1];
        //generating the diagonal
        while (j < matrixLength) {
          diagonal.push(this.get(i)[j]);
          i += 1;
          j += 1;
        }
        //console.log(diagonal);
        var conflictCount = diagonal.reduce(function(add, num) {
          return add + num;
        });
        return conflictCount > 1;
      } else { //going down
        i = matrixCoordinates[0];
        j = 0;
        //generating the diagonal
        while (i < matrixLength) {
          diagonal.push(this.get(i)[j]);
          i += 1;
          j += 1;
        }
        var conflictCount = diagonal.reduce(function(add, num) {
          return add + num;
        }, 0);
        return conflictCount > 1;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var matrixLength = this.attributes.n;
      //maybe add a base case here for matrixLength === 1;
      var numMajorDiagonals = (matrixLength - 2) * 2 + 1;
      var numMajorDiagonalsRow = numMajorDiagonals - 2; //3
      var numMajorDiagonalsCol = numMajorDiagonals - numMajorDiagonalsRow; //2

      //going right
      for (var i = 0; i < numMajorDiagonalsRow; i += 1) {
        if (this.hasMajorDiagonalConflictAt([0, i])) {
          return true;
        }
      }
      //going down
      for (var j = 1; j < numMajorDiagonalsCol + 1; j += 1) { //adding a +1 to compensate for j starting at 1.
        if (this.hasMajorDiagonalConflictAt([j, 0])) {
          return true;
        }
      }
      //if you survive all these loops, return false;
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var diagonal = [];
      var matrixLength = this.attributes.n;
      var i, j;
      if (minorDiagonalColumnIndexAtFirstRow[0] === matrixLength - 1 && minorDiagonalColumnIndexAtFirstRow[1] === 0) {
        i = matrixLength - 1;
        j = 0;
        while (j < matrixLength) {
          diagonal.push(this.get(i)[j]);
          i -= 1;
          j += 1;
        }
        var conflictCount = diagonal.reduce(function(add, num) {
          return add + num;
        });
        return conflictCount > 1;
      } else if (minorDiagonalColumnIndexAtFirstRow[0] === matrixLength - 1) { //going to the right
        i = matrixLength - 1;
        j = minorDiagonalColumnIndexAtFirstRow[1];
        while (j < matrixLength) {
          diagonal.push(this.get(i)[j]);
          j += 1;
          i -= 1;
        }
        var conflictCount = diagonal.reduce(function(add, num) {
          return add + num;
        });
        return conflictCount > 1;
      } else { //going up
        i = minorDiagonalColumnIndexAtFirstRow[0];
        j = 0;
        while (i > -1) {
          diagonal.push(this.get(i)[j]);
          i -= 1;
          j += 1;

        }
        var conflictCount = diagonal.reduce(function(add, num) {
          return add + num;
        }, 0);
        return conflictCount > 1;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var matrixLength = this.attributes.n;
      var numMajorDiagonals = (matrixLength - 2) * 2 + 1;
      var numMajorDiagonalsRow = numMajorDiagonals - 2;
      var numMajorDiagonalsCol = numMajorDiagonals - numMajorDiagonalsRow;

      //going right
      for (var j = 0; j < matrixLength; j += 1) {
        if (this.hasMinorDiagonalConflictAt([matrixLength - 1, j])) {
          return true;
        }
      }
      //going up
      for (var i = matrixLength - 2; i > -1; i -= 1) { //adding a +1 to compensate for j starting at 1.
        if (this.hasMinorDiagonalConflictAt([i, 0])) {
          return true;
        }
      }
      //if you survive all these loops, return false;
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
