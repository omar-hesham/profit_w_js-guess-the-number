"use strict";

/**
 * Guess The Number Game
 */

/////////////////////////////////////////////////////////////////////////////
//////////////////////////      VARIABLE & INIT       ///////////////////////
/////////////////////////////////////////////////////////////////////////////

// Templates for messages
let unorderedListTemplateStartTag = "<ul class='list-group'>";
let unorderedListTemplateEndTag = "</ul>";
let historyMessageTemplate = "<li class='list-group-item'>You guessed INSERT_NUMBER_HERE - INSERT_STATE_HERE</li>";
let historyReplacePattern = 'INSERT_NUMBER_HERE';
let historyStateReplacePattern = 'INSERT_STATE_HERE';

let userGuessMessageTemplate = "<div class='alert alert-INSERT_STATUS_HERE' role='alert'>INSERT_MESSAGE_HERE</div>";
let userGuessStatusReplacePattern = 'INSERT_STATUS_HERE';
let userGuessMessageReplacePattern = 'INSERT_MESSAGE_HERE'

// Messages
let messages = {
    Won : 'Awesome job, you got it!',
    Over : 'Your guess is too high!',
    Below : 'Your guess is too low!'
}

let messageType = {
    Won : 'success',
    Warning : 'warning'
}

// Variable to store the list of guesses 
// this array contains objects
// { 
//    Number: ...,
//    State: ...
// }
// 
// 
let guesses = [];

// Variable for store the correct random number 
let correctNumber = 0;

// Keycode for enter
let enterKeycode = 13;

/////////////////////////////////////////////////////////////////////////////
//////////////////////////            CODE            ///////////////////////
/////////////////////////////////////////////////////////////////////////////

window.onload = function() {
    initGame()
    $("#number-submit").click(playGame);
    $("#restart-game").click(initGame);

    $('#number-guess').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode === enterKeycode){
          playGame();
      }
  });
}

function playGame(){
  let numberGuess = $("#number-guess").val();
  
  displayResult(numberGuess);
}

// Initialize a new game by resetting all values and content on the page
function initGame() {
  guesses = [];
  displayHistory();
  resetResultContent();
}

// Reset the results list display
function resetResultContent(){
  $("#result").html('');
  $("#number-guess").val('');
  $("#number-guess").focus();
  correctNumber = getRandomNumber();
}

// Return random number between 1 and 100
function getRandomNumber(){
  /**
   * Math.random returns a number between 0 and 1,
   * and that's why we multiply it by 100
   */
  return Math.floor((Math.random() * 100) + 1);
}

// Save the user guess entered from the input
function saveGuessHistory(guess) {
  guesses.push(guess);
}

// Display history in HTML 
function displayHistory() {
  let list = unorderedListTemplateStartTag;
  
  guesses.forEach((guess) => {
    list += historyMessageTemplate
                    .replace(historyReplacePattern, guess.Number)
                    .replace(historyStateReplacePattern, guess.State);
  });

  list += unorderedListTemplateEndTag;
  
  $('#history').html(list);
}

// Display the result in HTML
function displayResult(numberGuess) {
  let newGuess = { Number: numberGuess, State: '' };

  if(numberGuess > correctNumber) {
    newGuess.State = messages.Over;
    showWarningMessage(newGuess);
  } else if (numberGuess < correctNumber) {
    newGuess.State = messages.Below;
    showWarningMessage(newGuess);
  } else {
    newGuess.State = messages.Won;
    showYouWon(newGuess);
  }

  saveGuessHistory(newGuess);
  displayHistory();
}

// Retrieve the dialog based on if the guess is wrong or correct 
function getDialog(dialogType, text){
    return userGuessMessageTemplate
                  .replace(userGuessStatusReplacePattern,dialogType)
                  .replace(userGuessMessageReplacePattern,text.State);
}

function showYouWon(message){
    $("#result").html(getDialog(messageType.Won, message));
}

function showWarningMessage(message){
    $("#result").html(getDialog(messageType.Warning, message));
    $("#number-guess").select();    
}
