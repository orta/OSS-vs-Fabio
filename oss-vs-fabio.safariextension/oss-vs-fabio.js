String.prototype.contains = function(str, startIndex) { return -1!==this.indexOf(str, startIndex); };

var pullsArray = [
  { title: "comment", comment:"Gots all the comments", close: false, merge: false },
  { title: "close", comment:"I've close", close: true, merge:true },
  { title: "merge", comment:"I've mere", close: true, merge:false }
]

var issuesArray = [
  { title: "comment", comment:"Gots all the comments", close: false},
  { title: "close", comment:"I've closed", close: true },
]

var isPullRequest = window.location.pathname.contains("/pull/")
var isIssue =  window.location.pathname.contains("/issues/")

function setup(){
  // hide the tips
  
  var tipElement = document.getElementsByClassName("tip")[0]
  if(tipElement) {
    tipElement.style.display = "none"
  }
}

function addButtonForObject(object){
  var formActions = getCommentButtonsToolbar();
  var commentTextBox = getCommentTextBox()
  
  var initialButton = document.createElement('a')
  initialButton.className = classNameForObject(object)
  
  var buttonText = document.createTextNode(object["title"])
  initialButton.appendChild(buttonText)

  initialButton.onclick = function() {
    commentTextBox.textContent = object["comment"];
  }
  
  formActions.appendChild(initialButton);
}

function classNameForObject(object){
  if(object["close"]){
    if(object["merge"]){
      // green for merge
      return "minibutton primary"
    } else {
      // red for close
      return "minibutton danger"
    }
  } else {
    // white for comment
    return "minibutton"
  }
}

function closeIssue() {
  var commentArea = document.getElementsByClassName("js-new-comment-form")[0]
  var closeButton = commentArea.getElementsByClassName("js-comment-and-button")
  closeButton.onclick();
}

function mergeIssue() {
  var commentArea = document.getElementsByClassName("js-new-comment-form")[0]
  var mergeButton = commentArea.getElementsByClassName("primary")
  mergeButton.onclick();
}

var _commentButtonsToolbar
function getCommentButtonsToolbar() {
  if (_commentButtonsToolbar) return _commentButtonsToolbar
  
  var commentArea = document.getElementsByClassName("js-new-comment-form")[0]
  var formActions = commentArea.getElementsByClassName("form-actions")
  _commentButtonsToolbar = formActions[formActions.length-1]
  return _commentButtonsToolbar
}

var _commentTextBox
function getCommentTextBox() {
  if(_commentTextBox) return _commentTextBox;
  
  var textareas = document.getElementsByTagName("textarea")
  for (var i = 0; i < textareas.length; i++){ 
    if(textareas[i].placeholder == "Leave a comment") {
      _commentTextBox = textareas[i]
      return _commentTextBox
    }
  }
}

setup();
var arrays = isIssue ? issuesArray: pullsArray 

for (var i = 0; i < arrays.length; i++){ 
  addButtonForObject(arrays[i]);
}
