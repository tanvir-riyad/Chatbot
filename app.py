
from flask import Flask, render_template, request, jsonify
import openai
import json
#from microphone import recognize_from_microphone

#from chat import get_response

openai.api_key = "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"

Fixed_Response = {
    "Hi": "Hi, How can I help you?",
    "Who are you?" : "I am an M2H Bot to help you answer your questions",
    "How are you?" : "I'm good. Thank you.", 
}


def Response(text):
    response = openai.Completion.create(
    model="text-davinci-001",
    prompt = text,
    #prompt="\n\nwhat was the main problem?\n\nwhat caused tha problem?\n\nHow the problem was solved?\n\nAnswer all the questions in separate line\n\n\n",
    temperature=0.7,
    max_tokens=256,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )
    summary = response['choices'][0]['text'].split('.')

    return summary

app = Flask(__name__)


@app.get("/")
def index_get():
    return render_template("base.html")


@app.post("/predict")
def predict():
    text = request.get_json().get('message')
    if text == "Hi": 
        response = Fixed_Response[text]
    else:
        response =  Response(text)      
    message = {"answer": response}   
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)
