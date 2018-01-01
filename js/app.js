'use strict';

//one global variable
var GAME = {};

/*********************** *
 *  some constants       *
 * **********************/
GAME.const = (function(){

    return {
        BOARD_SIZE : 9,
        HUMAN : 'human',
        COMPUTER : 'computer'
    };
})();

/************************
 *   board object       *
 * *********************/
GAME.board = (function(){
    //private variables
    var _board;

    //initialize board
    _board = ['', '', '',
        '', '', '',
        '', '', ''];
    
    function fieldToIndex(field){
        var fieldIndex;
        
        fieldIndex = field.slice(1);
        //move to zero index 
        //(array is zero index, are fields have id start from 1)
        fieldIndex -= 1;   
        
        return fieldIndex;
    }

    function indexToFieldId(index){
        var fieldId;
        
        fieldId = '#f'+(index+1);           // field ids are #f1, #f2, #f3....
        return fieldId;
    }

    function clear(){
        _board = ['', '', '',
            '', '', '',
            '', '', ''];
    }

    function getField(field){
        return _board[fieldToIndex(field)];
    }

    function updateField(field,mark){
        _board[fieldToIndex(field)] = mark;
    }

    function display(){
        _board.forEach( function(field,index){
            $(indexToFieldId(index)).html(field);
        });
    }

    function isFull(){
        return _board.every(function(field){
            return field != '';
        });
    }

    function isEmpty(){
        return _board.every(function(field){
            return field === '';
        });
    }

    function isWin(mark){
        //rows
        if(_board[0] === mark && _board[1] === mark && _board[2] === mark){
            return true;
        }
        if(_board[3] === mark && _board[4] === mark && _board[5] === mark){
            return true;
        }
        if(_board[6] === mark && _board[7] === mark && _board[8] === mark){
            return true;
        }

        //columns
        if(_board[0] === mark && _board[3] === mark && _board[6] === mark){
            return true;
        }
        if(_board[1] === mark && _board[4] === mark && _board[7] === mark){
            return true;
        }
        if(_board[2] === mark && _board[5] === mark && _board[8] === mark){
            return true;
        }

        //diagonals
        if(_board[0] === mark && _board[4] === mark && _board[8] === mark){
            return true;
        }
        if(_board[2] === mark && _board[4] === mark && _board[6] === mark){
            return true;
        }
        return false;
    }

    function getRow(row){
        row = (row-1)*3;        //because zero index array
        return [ _board[(0+row)], _board[(1+row)], _board[(2+row)]];
    }

    function getCol(col){
        col = (col-1);
        return [ _board[(0+col)], _board[(3+col)], _board[(6+col)]];
    }

    function getDiagonal(diag){
        diag = (diag - 1)*2;
        return [ _board[0+diag], _board[4], _board[8-diag]]
    }

    return {
        clear : clear,
        updateField : updateField,
        getField : getField,
        display : display,
        isFull : isFull,
        isEmpty : isEmpty,
        isWin : isWin,
        getRow : getRow,
        getCol : getCol,
        getDiagonal : getDiagonal,
        board : _board
    };
})();

/****************************** 
 *  PLAYER OBJECT CONSTRUCTOR *
 * ***************************/
GAME.Player = function(name,mark,player){
    var _name,
        _player,
        _mark;

    _name = name;
    _player = player;
    _mark = mark;
    this.mark = mark;
  
    function humanChoice(fieldId){
        GAME.board.updateField(fieldId,GAME.humanMark);
    }

    function computerChoice(){
        var compFieldId,
            fieldClear,
            markCount,
            row,col,diag,
            i;

        function sumMarks(rowCol){
            var count;

            rowCol = rowCol.map(function(field){
                if(field === GAME.humanMark){
                    return 1;
                }else{
                    return 0;
                }
            })
            count = rowCol.reduce(function(a,b){
                return a+b;
            })
            return count;
        }

        function isFull(rowCol){
            var count;

            rowCol = rowCol.map(function(field){
                if(field === GAME.humanMark || field === GAME.computerMark){
                    return 1;
                }else{
                    return 0;
                }
            })
            count = rowCol.reduce(function(a,b){
                return a+b;
            })
            
            if( count === 3){
                return true;
            }else{
                return false;
            }
        }

        function chooseEmpty(fields){
            var empty,index,field;

            empty = false;
            index = 0;
            while(!empty && index < 3){
                if(GAME.board.getField(fields[index]) === ''){
                    field = fields[index];
                    empty = true;
                }
                index++;
            }
            return field;
        }

        function chooseRandom(){
            var fieldClear,
                fieldId;

            //computer randomly choose field
            fieldClear = false;
            while(!fieldClear && !GAME.board.isFull()){
                fieldId = 'f' + (1+Math.round(Math.random()*(GAME.const.BOARD_SIZE-1)));
                //check if field is clear
                if(GAME.board.getField(fieldId) === ''){
                    fieldClear = true;
                }
            }
            //but prefer corners
            if(GAME.board.getField('f1') === ''){
                fieldId = 'f1';
            }else if(GAME.board.getField('f3') === ''){
                fieldId = 'f3';
            }else if(GAME.board.getField('f7') === ''){
                fieldId = 'f7';
            }else if(GAME.board.getField('f9') === ''){
                fieldId = 'f9';
            }
            return fieldId;
        }
        
        //start with the middle
        if(GAME.board.getField('f5') === ''){
            compFieldId = 'f5';
        }else{
            //if middle not empty be defensive
            //rows
            row = GAME.board.getRow(1);
            if(sumMarks(row) === 2 && !isFull(row)){
                compFieldId = chooseEmpty(['f1','f2','f3']);
            }
            row = GAME.board.getRow(2);
            if(sumMarks(row) === 2 && !isFull(row)){
                compFieldId = chooseEmpty(['f4','f5','f6']);
            }
            row = GAME.board.getRow(3);
            if(sumMarks(row) === 2 && !isFull(row)){
                compFieldId = chooseEmpty(['f7','f8','f9']);
            }

            //col
            col = GAME.board.getCol(1);
            if(sumMarks(col) === 2 && !isFull(col)){
                compFieldId = chooseEmpty(['f1','f4','f7']);
            }
            col = GAME.board.getCol(2);
            if(sumMarks(col) === 2 && !isFull(col)){
                compFieldId = chooseEmpty(['f2','f5','f8']);
            }
            col = GAME.board.getCol(3);
            if(sumMarks(col) === 2 && !isFull(col)){
                compFieldId = chooseEmpty(['f3','f6','f9']);
            }

            //diagonal 
            diag = GAME.board.getDiagonal(1);
            if(sumMarks(diag) === 2 && !isFull(diag)){
                compFieldId = chooseEmpty(['f1','f5','f9']);
            }
            diag = GAME.board.getDiagonal(2);
            if(sumMarks(diag) === 2 && !isFull(diag)){
                compFieldId = chooseEmpty(['f3','f5','f7']);
            }
        }

        //if there was no choice then choose random corner
        if(compFieldId === undefined){
            compFieldId = chooseRandom();
        }

        GAME.board.updateField(compFieldId,GAME.computerMark);
    }

    this.choice = function(fieldId){
        if(_player === GAME.const.HUMAN){
            humanChoice(fieldId);
        }else{
            computerChoice();
        }
    };
};
//property to store mark for human player
GAME.humanMark = 'O';
GAME.computerMark = 'X';
//objects for human-player and computer player
GAME.humanPlayer = new GAME.Player('Tom',GAME.humanMark,GAME.const.HUMAN);
GAME.computerPlayer = new GAME.Player('Computer',GAME.computerMark,GAME.const.COMPUTER);

/********************* *
* main game logic here *
***********************/
GAME.handler = function(elemId){
    var winner;

    //helper function
    function whoWon(){
        //check for the winner
        if(GAME.board.isWin(GAME.humanMark)){
            return 'Player Win!';
        }else if(GAME.board.isWin(GAME.computerMark)){
            return 'Computer Win!';
        }else if(GAME.board.isFull()){
            return 'It\'s a tie!';
        }
        return false;
    }

    //player's move
    if ( GAME.board.getField(elemId) != ''){ 
        //if field taken then exit function
        return false;
    }else{
        GAME.humanPlayer.choice(elemId);
    }
    //computer's move if player didn't win yet
    if(!whoWon()){
    GAME.computerPlayer.choice(elemId);
    }
    GAME.board.display();
    
    //check if there is a win
    if(whoWon()){
        setTimeout(function(){
            winner = whoWon();
            alert(winner);
            GAME.board.clear();
            $('.mark-toggle').toggle();
            GAME.board.display();
        },200);
    }
};

/*********************** 
*                      *    
*  program starts here *
************************/
$(function(){

    //let player choose mark X or O
    $('.mark').on('click', function(){
        var mark;

        if ( $('#X').prop('checked') ){
            GAME.humanMark = 'X';
            GAME.computerMark = 'O';
        }
        if( $('#O').prop('checked') ){
            GAME.humanMark = 'O';
            GAME.computerMark = 'X';
        }
    })

    $('.btn').on('click', function(){
        var id;
        
        //remove mark toggle on game start
        if(GAME.board.isEmpty()){
            $('.mark-toggle').toggle();
        }

        id = $(this).attr('id');
        GAME.handler(id);
    });
});