// Global Vars
let comeout = true;
let point = 0;
let shooterCount = 1;
let rollCount = 1;
let message = {
  "Shooter": 0,
  "Roll": 0,
  "D1":0,
  "D2":0,
  "Total":0,
  "Result":""
}

// Target the single log container
const logElement = document.getElementById("log-output");

/**
 * Appends a message to the end of the log element's textContent
 * and scrolls the container to the bottom.
 * 
 * @param {string} message - The string message to append.
 */
function appendMessage(message) {
  if (!logElement) return;

  // Append message text with a newline
  logElement.textContent += `${message}\n`;

  // Automatically scroll down to the newest content
  logElement.scrollTop = logElement.scrollHeight;
}

// --- Example Usage ---

// Initial log entries
appendMessage("System initialized.");


// Wiring up the interactive text input and button
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");

function handleUserMessage() {
  if (messageInput && messageInput.value.trim() !== "") {
    const time = new Date().toLocaleTimeString();
    appendMessage(`[${time}] ${messageInput.value.trim()}`);
    messageInput.value = "";
    messageInput.focus();
  }
}

if (sendButton) {
  sendButton.addEventListener("click", handleUserMessage);
}

if (messageInput) {
  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleUserMessage();
    }
  });
}

function getRandomDieRoll(){
  try{
    return Math.floor(Math.random() * 6) + 1;
  }
  catch (error){
    appendMessage(`Error in getRandomDieRoll\n${error}`);
  }
}

function analyzeRoll(roll){
  let result = "";
  if(comeout && (roll == 7 || roll == 11)){
      // 7 or 11 wins on comeout
      result = `WINNER!`;
    }else if (comeout && (roll == 2 || roll == 3 || roll == 12)){
      // 2, 3, 12 - Craps on comeout
      result = `Craps - You Lose!`;
    }else if (comeout){
      // Point set
      result = `Point of ${roll} set...`;
      comeout = false;
      point = roll;
    }else if(!comeout && roll == 7){
      // Seven-Out
      result = `Seven-Out, New Shooter!`;
      comeout = true;
      point = 0;
    }else if(!comeout && roll == point){
      // Point Hit - WINNER
      result = `Point Hit - WINNER!`;
      comeout = true;
      point = 0;
    }else{
      // No winner, no seven-out
      result = ``;
    }
    return result;
}

function runShooter(){
  try{
    let die1 = getRandomDieRoll();
    let die2 = getRandomDieRoll();
    let roll = die1 + die2;
    let result = analyzeRoll(roll);
    message.D1 = die1; 
    message.D2 = die2;
    message.Total = roll;
    message.Result = result;
    //appendMessage(message);
    return message;
  }
  catch (error){
    appendMessage(`Error in runShooter\n${error}`);
  }
}

while(shooterCount <= 10){
  try{
    while(!message.Result.includes("New Shooter")){
      message = runShooter();
      message.Roll = rollCount;
      message.Shooter = shooterCount;
      appendMessage(JSON.stringify(message));
      rollCount++;
    }
    rollCount = 1;
    shooterCount++;
    message.Result = "";
  }
  catch (error){
    appendMessage(`Error in forLoop\n${error}`);
  }
}