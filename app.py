from email import message
from urllib import response
from flask import Flask, render_template, request, jsonify

#from chat import get_response

app = Flask(__name__)

Response = {

    "Hey": "Hi, How can I help you?",

    "hi": "Hi, How can I help you?",

    "Hi": "Hi, How can I help you?",

    "who are you?" : "I am a chat bot to help you",

    "What is your name?" : "My name is Alexa & I am a chat bot",

    "What is your name" : "My name is Alexa & I am a chat bot",

    "What's your name?" : "My name is Alexa & I am a chat bot",

    "what is the capital of germany?" : "Berlin",

    "Bye": "Goodbye",

    "bye": "Goodbye",

    "Thanks" :"My pleasure",

    "thanks" :"My pleasure"
    


}

@app.get("/")
def index_get():
    return render_template("base.html")


@app.post("/predict")

def predict():
    text = request.get_json().get('message')

    response =  Response[text]       #get_response(text)

    message = {"answer": response}
    
    return jsonify(message)


if __name__ == "__main__":
    app.run(debug=True)
