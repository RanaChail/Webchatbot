const chatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatCloseBtn = document.querySelector(".close-btn");


let userMessage;
const API_KEY = "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";
const inputHeight = chatInput.scrollHeight;



const createChatli = (message, className) => {
  //Create a chat <li> element with passed message and className.
  const chatli = document.createElement("li");
  chatli.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined"><img src="boticon.png" alt=""></span><p></p>`;
  chatli.innerHTML = chatContent;
  chatli.querySelector("p").textContent = message;
  return chatli;
};

const generateResponse = (incomingChatli) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatli.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  //Send POST request to API, get response.
  fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
    messageElement.textContent = data.choices[0].message.content;
  }).catch((error) =>{
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again.";
  }).finally(() =>{
    chatbox.scrollTo(0, chatbox.scrollHeight)
  });
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputHeight}px`;

  //Append the user's message to the chatbox
  chatbox.appendChild(createChatli(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    //Display thinking message while for the response
    const incomingChatli = createChatli("Thinking...", "incoming");
    chatbox.appendChild(incomingChatli);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatli);
  }, 699);
};

chatInput.addEventListener('input', () =>{
    //Adjust the height of the input textarea based on its content.
    chatInput.style.height = `${inputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener('keydown', (e) =>{
    //If enter key is pressed without Shift key and the window.
    //width is greater than 800px, handle the chat.
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});


sendChatbtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatCloseBtn.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
