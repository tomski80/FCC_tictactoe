'use strict';

//global variable
var GAME = {};

GAME.const = (function(){

    return {
        BOARD_SIZE : 9,
        PLAYER : 'human',
        COMPUTER : 'computer'
    };
})();

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

    return {
        clear : clear,
        updateField : updateField,
        getField : getField,
        display : display,
        isFull : isFull,
        board : _board
    };
})();

GAME.Player = function(name,mark){
    var _name,
        _mark;
    
    _name = name;
    _mark = mark;

    function humanChoice(fieldId){
        GAME.board.updateField(fieldId,_mark);
    }

    function computerChoice(){
        var compFieldId,
            fieldClear;
        //computer randomly choose field
        fieldClear = false;
        while(!fieldClear && !GAME.board.isFull()){
            compFieldId = 'f' + (1+Math.round(Math.random()*(GAME.const.BOARD_SIZE-1)));
            //check if field is clear
            if(GAME.board.getField(compFieldId) === ''){
                fieldClear = true;
            }
        }
        GAME.board.updateField(compFieldId,_mark);
    }

    this.choice = function(fieldId,player){
        if(player === GAME.const.HUMAN){
            humanChoice(fieldId);
        }else{
            computerChoice();
        }
    };
};

GAME.player = new GAME.Player('Tom','O');
GAME.computer = new GAME.Player('Computer','X');

//main game here
GAME.handler = function(elemId){

    GAME.player.choice(elemId, GAME.const.HUMAN);

    if(GAME.board.isFull()){
        console.log('game over');
    }else{
        //computer's move
        GAME.computer.choice(elemId, GAME.const.COMPUTER);
    }
    GAME.board.display();
};
//jQuery 
// program starts here
$(function(){

    $('.btn').on('click', function(){
        var id;
        
        id = $(this).attr('id');
        GAME.handler(id);
    });
});