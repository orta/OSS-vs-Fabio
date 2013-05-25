String.prototype.contains = function(str, startIndex) { return -1!==this.indexOf(str, startIndex); };
Array.prototype.random = function() { return this[Math.floor((Math.random() * this.length))]; }
String.prototype.sentenceCase = function() { return this.charAt(0).toUpperCase() + this.substr(1); }

var pullsArray = [
  { title: "close", comment:"I've close", close: true, merge:false },
  { title: "merge", comment:"Awesome, thanks, merging!", close: true, merge:true }
]

var issuesArray = [
  { title: "comment", comment:"Gots all the comments", close: false},
  { title: "close", comment:"I've closed", close: true },
]

var isPullRequest = window.location.pathname.contains("/pull/")
var isIssue =  window.location.pathname.contains("/issues/")
var authorName = document.getElementsByClassName("discussion-topic-author")[0].getElementsByTagName("a")[0].innerText
var showRandomNice = true

function setup(){

  // hide any tips
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
    commentTextBox.textContent = parseMessage(object["comment"]);
    performActionForObject(object)
  }
  
  formActions.appendChild(initialButton);
}

function performActionForObject(object){
  if(object["close"]){
    
    if(object["merge"]){
      commentOnIssue()
      // wait 2 seconds for comment then merge
      setTimeout(mergePR, 2000);
            
    } else {
      closeIssue();
    }
    
  } else {
    commentOnIssue()
  }
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

// Close the current issue with any text.
function closeIssue() {
  var commentArea = document.getElementsByClassName("js-new-comment-form")[0]
  var closeButton = commentArea.getElementsByClassName("js-comment-and-button")[0]
  closeButton.click();
}

// Merge PR ( This refreshes the page )
function mergePR() {
  var issueForm = document.getElementsByClassName("merge-branch-form ")[0]
  issueForm.submit()
}

// Submit comment
function commentOnIssue() {
  var commentArea = document.getElementsByClassName("js-new-comment-form")[0]
  var mergeButton = commentArea.getElementsByClassName("primary")[0]
  mergeButton.click();
}

// The toolbar under the comments
function getCommentButtonsToolbar() {  
  var commentArea = document.getElementsByClassName("js-new-comment-form")[0]
  var formActions = commentArea.getElementsByClassName("form-actions")
  var commentButtonsToolbar = formActions[formActions.length-1]
  return commentButtonsToolbar
}

// The textarea element for commenting in
function getCommentTextBox() {
  var textareas = document.getElementsByTagName("textarea")
  for (var i = 0; i < textareas.length; i++){ 
    if(textareas[i].placeholder == "Leave a comment") {
      var commentTextBox = textareas[i]
      return commentTextBox
    }
  }
}

// Make up a nice thing to say! So conceited.

function randomMergeMessage() {
  var message = [
    "[name] = [nice_word], [thanks_word].", 
    "Nice PR [name] - [thanks_word].", 
    "[nice_word] [name] - [thanks_word].",
    "Very [nice_word] [thanks_word] for the PR!",
    "[nice_word]! [thanks_word] [name].",
    "[thanks_word] [name].",
    "Looks [thanks_word] [name]."]
  return { title: "⚄", comment: message.random(), close: true, merge:true}
}

function parseMessage(message) {
  var thanks = ["thanks", "thanks a lot", "cool work", "nice work"].random()
  var nice = ["awesome", "cool", "brilliant", "beautiful", "great"].random()

  message = message.replace("[name]", authorName)
  message = message.replace("[nice_word]", nice)
  message = message.replace("[thanks_word]", thanks)
  return message.sentenceCase()
}

// --------------------------------------------------

setup();
var comments = isIssue ? issuesArray: pullsArray 

if(showRandomNice) comments.push( randomMergeMessage() )

for (var i = 0; i < comments.length; i++){ 
  addButtonForObject(comments[i]);
}