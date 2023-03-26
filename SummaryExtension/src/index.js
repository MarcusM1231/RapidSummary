//Set up Configs
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//Elements
let loadingIcon = document.getElementById("loading-container");
let summaryText = document.getElementById("summaryText");
let insertText = document.getElementById("insertText");
let insertAgainButton = document.getElementById("insertAgainButton");
const summaryButton = document.getElementById("summaryButton");
const summaryButton2 = document.getElementById("summaryButton2");

// Summary button to call the chatgpt api and display the summary
// of the current webpage

if (summaryButton != null) {
    summaryButton.addEventListener("click", function () {
        getResponse("index");
        summaryButton.disabled = true;
        console.log("button pressed");
    });
}

if (summaryButton2 != null) {
    summaryButton2.addEventListener("click", function () {
        getResponse("index2");
        summaryButton2.disabled = true;
        console.log("button pressed");
    });
}

if (insertAgainButton != null) {
    insertAgainButton.disabled = true

    insertAgainButton.addEventListener("click", function () {
        location.reload();
    })
}

//Function to gets the current website url
async function getCurrentURL() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0].url;
            resolve(activeTab);
        });
    });
}

//Reaches out to chatgpt and gets the summary of the current website
async function getResponse(page) {

    //Displays the loading icon 
    loadingIcon.hidden = false;

    //Hides the border around the summary text
    summaryText.style.border = "none";

    var response;

    //Gets the current url
    if (page == "index") {
        response = await getCurrentURL();
    } else {
        response = insertText.value
        document.getElementById("summaryButton2").disabled = true;
    }

    //Makes the api call with the current url
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Can you give me a summary of " + response }]
    });

    if (insertText != null) { insertText.hidden = true }

    //Shows the border around the text
    summaryText.style.border = "solid";

    //Hide the loading icon
    loadingIcon.hidden = true;

    if (insertAgainButton != null) { insertAgainButton.disabled = false }

    //Displays the summary from chatgpt
    document.querySelector(".container").innerHTML = completion.data.choices[0].message.content;
}

//Button logic to toggle light and dark mode
const toggleButton = document.getElementById("toggle-button");
const switchButton = document.querySelector(".switch");
const body = document.body;

//On load get the background color that was saved in state
if (localStorage.getItem("toggleState") === "on") {
    body.classList.add("toggle");
    switchButton.classList.add("on");
}

//Toggle Button to toggle light/dark mode
function toggleSwitch() {
    switchButton.classList.toggle("on");
    // Save the toggle state to localStorage
    if (switchButton.classList.contains("on")) {
        localStorage.setItem("toggleState", "on");
    } else {
        localStorage.setItem("toggleState", "off");
    }
}

// function toggleSwitch() {
//     switchButton.classList.toggle("on");
// }

toggleButton.addEventListener("click", function () {
    body.classList.toggle("toggle");
    toggleSwitch();
});

//X Button to close the window
const closeButton = document.getElementById("xButton");
closeButton.addEventListener("click", function () {
    window.close()
});



