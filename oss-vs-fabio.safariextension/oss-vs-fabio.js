var buttonArray = [
  { title: "comment", comment:"Gots all the comments", close: false, merge: false},
  { title: "close", comment:"I've deleted all the comments", close: true, merge:true}
  { title: "merge", comment:"I've deleted all the comments", close: true, merge:false}
]

function setup(){
  // hide the tips
  
  var tipElement = document.getElementsByClassName("tip")[0]
  tipElement.style.display = "none"
  
}

function addButtonForObject(object){
  var formActions = getCommentButtonsToolbar();
  var commentTextBox = getCommentTextBox()
  
  var initialButton = document.createElement('button')
  initialButton.className = classNameForObject(object)
  
  var buttonText = document.createTextNode(object["title"])
  initialButton.appendChild(buttonText)
  
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
for (var i = 0; i < buttonArray.length; i++){ 
  addButtonForObject(buttonArray[i]);
}
