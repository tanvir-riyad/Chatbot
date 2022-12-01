



class Chatbox {

    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            speakerButton: document.getElementById('recordAudio')
        }

        this.state = false

        this.messages = []
    }


    display() {
        const { openButton, chatBox, sendButton, speakerButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        speakerButton.addEventListener('click', () => this.onSpeakerButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener('keypress', (e) => {
            if (e.key == 'Enter') {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        if (this.state) {

            chatbox.classList.add('chatbox--active')
        } else {

            chatbox.classList.remove('chatbox--active')


        }


    }

    onSendButton(chatbox) {

        var textField = chatbox.querySelector('input')

        let text1 = textField.value

        if (text1 == "") {
            return;
        }
        let msg1 = { name: 'User', message: text1 }

        this.messages.push(msg1)

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: 'M2H', message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''

            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox)
                textField.value = ''

            });
    }

    onSpeakerButton(chatbox) {
        const textInput = document.getElementById("text-input");
        let action = document.getElementById("action");

        window.SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.interimResults = true;

        let p = document.createElement("p");
        recognition.onstart = function () {
            action.innerHTML = "<small>listening....</small>";
        };
        recognition.onspeechend  = function () {
            action.innerHTML = "";
        };

        recognition.addEventListener("result", (e) => {
            textInput.value = p.innerText;
            const text = Array.from(e.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join("");

            p.innerText = text;
            console.log(text);
            if (e.results[0].isFinal) {
                if (text.includes("how are you")) {
                    p = document.createElement("p");
                    p.classList.add("replay");
                    p.innerText = "I am fine";
                    textInput.value = p.innerText;
                }
                if (
                    text.includes("what's your name") ||
                    text.includes("what is your name")
                ) {
                    p = document.createElement("p");
                    p.classList.add("replay");
                    p.innerText = "My Name is Cifar";
                    textInput.value = p.innerText;
                }
                if (text.includes("open my YouTube")) {
                    p = document.createElement("p");
                    p.classList.add("replay");
                    p.innerText = "opening youtube channel";
                    textInput.value = p.innerText;
                    console.log("opening youtube");
                    window.open("https://www.youtube.com/channel/UCdxaLo9ALJgXgOUDURRPGiQ");
                }
                p = document.createElement("p");
            }
        });

        recognition.addEventListener("end", () => {
            console.log('ended');
            //   recognition.start();
        });

        recognition.start();


    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item) {

            if (item.name === 'M2H') {

                html += '<div class = "messages_item messages_item--visitor" > ' + item.message + '</div>'
            } else {
                html += '<div class = "messages_item messages_item--operator" > ' + item.message + '</div>'
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }


}

const chatbox = new Chatbox();
chatbox.display();
