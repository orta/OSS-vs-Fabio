String.prototype.contains = function(str, startIndex) { return -1!==this.indexOf(str, startIndex); };
Array.prototype.random = function() { return this[Math.floor((Math.random() * this.length))]; }
String.prototype.sentenceCase = function() { return this.charAt(0).toUpperCase() + this.substr(1); }

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
  
  // try get buttons as a string form the local storage
  var buttonsString = localStorage.githubButtons;
  if(typeof buttonsString == 'undefined' || buttonsString.length < 4) {
    setupDefaults();
  }
}

function setupDefaults(){
  var defaults = [
    { title: "close", comment:"Thanks [name] but you should read the mailing list.", close: true, merge:false },
    { title: "merge", comment:"Awesome, thanks [name], merging!", close: true, merge:true},
    { title: "comment", comment:"Auto comment with no close", close: false}
  ]
  localStorage.githubButtons = JSON.stringify(defaults);
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

// Add the thanks / nice / [name] to a comment

function parseMessage(message) {
  var thanks = ["thanks", "thanks a lot", "cool work", "nice work"].random()
  var nice = ["awesome", "cool", "brilliant", "beautiful", "great"].random()

  message = message.replace("[name]", "@" + authorName)
  message = message.replace("[nice_word]", nice)
  message = message.replace("[thanks_word]", thanks)
  return message.sentenceCase()
}

// once a popover is in, fill it with content

function createPopoverContent() {
  var buttonsString = localStorage.githubButtons;
  
  var buttonsArray = JSON.parse(localStorage.githubButtons);   
  var tableElement = document.getElementById("buttons")
  var html = "<tr><td>Button Title</td><td>Message</td><td>Close?</td><td>Merge?</td><td>Misc</td></tr>"
  
  for (var i = 0; i < buttonsArray.length; i++){ 
    var button = buttonsArray[i]
    var functionString = "saveRow(" + i.toString() + ")"

    html += "<tr><td>"
    html += "<input class='nameInput' value='" + button.title + "'>"
    html += "</td><td>"

    
    html += "<textarea class='message'>" + button.comment + "</textarea>"
    html += "</td><td><center>"
    
    if(button.close){
      html += "<input type='checkbox' class='close' name='Close' checked=true >"
    } else {
      html += "<input type='checkbox' class='close' name='Close'>"
    }
    
    html += "</center></td><td><center>"

    if(button.merge){
        html += "<input type='checkbox' class='merge' name='Merge' checked=true >"
    }else {
        html += "<input type='checkbox' class='merge' name='Merge' >"
    }

    html += "</center></td><td><input type='button' data-tag='" + i.toString() + "' value='X' class='removeButton'></td></tr>"
  }
  
  tableElement.innerHTML = html;
  
  // Add function callbacks to get around github security
  
  var mergeButtons = document.getElementsByClassName("merge")
  var closeButtons = document.getElementsByClassName("close")
  var buttons = [mergeButtons, closeButtons];
  for (var i = 0; i < buttons.length; i++){ 
    var array = buttons[i]
    for (var j = 0; j < array.length; j++){ 
      array[j].onchange = function(){ saveRow() }
    }
  }
  
  var nameInputs = document.getElementsByClassName("nameInput")
  var messageInputs = document.getElementsByClassName("message")
  var inputs = [nameInputs, messageInputs];
  for (var i = 0; i < inputs.length; i++){ 
    var array = inputs[i]
    
    for (var j = 0; j < array.length; j++){ 
      array[j].onblur = function(){ saveRow() }
    }
  }
  
  // Add support for deleting
  var removeButtons = document.getElementsByClassName("removeButton")
  for (var i = 0; i < removeButtons.length; i++){ 
    removeButtons[i].onclick = function(){ 
      deleteRow(this);
    }
  }
}

// Save the entire DB, then give some indication which "row" was saved

function saveRow(index){
  var tableRows = document.getElementById("buttons").getElementsByTagName("tr");
  var buttons = []
  console.log("saving")
  
  // skip the first, its the headers
  for (var i = 1; i < tableRows.length; i++){ 
    var row = tableRows[i]
    var object = {
      title: row.getElementsByTagName("input")[0].value,
      comment: row.getElementsByTagName("textarea")[0].value
    }
    
    if(row.getElementsByClassName("merge")[0].checked){
      object["merge"] = true
    }
    
    if(row.getElementsByClassName("close")[0].checked){
      object["close"] = true
    }

    buttons.push(object)
  }
  
  localStorage.githubButtons = JSON.stringify(buttons);
}

// Adds the CSS needed for the popover

function addCSSFile(){
  var path = safari.extension.baseURI + 'css/popover.css'
  document.write('<link rel="stylesheet" type="text/css" href="' + path +'">')
}
 
// Adds the background and table

function createPopover(){
  var popoverString = function(){/*
      <div id = "or_popover">
        <h2>Buttons</h2>
        <p>If a button has merge selected it's only shown in Pull Requests, otherwise the button will be in Issues / PRs. [name], [thanks_word] and [nice_word] will be replaced.</p>
        <div class="table" >
            <table id="buttons">
            
            </table>
      </div>
      <p><input type="button" value="New Button" id="newButton"></p>
  */}.toString().slice(15,-4)

  var wrapper = document.createElement("div")
  wrapper.innerHTML = popoverString
  wrapper.id = "or_background"
  wrapper.onclick = function(event){
    if(event.target == wrapper){
      wrapper.parentNode.removeChild(wrapper)
    }
  }
  
  document.body.appendChild(wrapper)
  document.getElementById("newButton").onclick = createNewRow
}

// Get the old data, add a new button, reload content 

function createNewRow(){
  var buttons = JSON.parse(localStorage.githubButtons);
  buttons.push({
     title: "New", comment:"My comment", close: false, merge:false 
  })
  localStorage.githubButtons = JSON.stringify(buttons);
  createPopoverContent();
}

// Remove the row

function deleteRow(element) {
  var buttons = JSON.parse(localStorage.githubButtons);
  var index = parseInt(element.attributes["data-tag"].value)

  buttons.splice(index, 1)
  
  localStorage.githubButtons = JSON.stringify(buttons);
  createPopoverContent();
}

function showModal(){
  createPopover()
  createPopoverContent()
}

function addSettings(){

  var formActions = getCommentButtonsToolbar();
  var initialButton = document.createElement('a')
  initialButton.className = "minibutton"
  initialButton.onclick = showModal
  var buttonText = document.createTextNode("⚙")
  initialButton.appendChild(buttonText)
  formActions.appendChild(initialButton)
  
}

// --------------------------------------------------

setup();
var comments = JSON.parse(localStorage.githubButtons);

if(showRandomNice) comments.push( randomMergeMessage() )

for (var i = 0; i < comments.length; i++){ 
  addButtonForObject(comments[i]);
}

addSettings();