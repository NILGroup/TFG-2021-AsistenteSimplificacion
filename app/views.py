import requests
import spacy
import json
import connexion
from unidecode import unidecode
from nltk import Tree
from flask import Flask,Response, request, render_template, jsonify
app = Flask(__name__)

# Create the application instance
#app = connexion.App(__name__, specification_dir='./')

# Read the swagger.yml file to configure the endpoints
#app.add_api('swagger.yml')

#URL CONSTANTS
NILWS_URL = 'https://holstein.fdi.ucm.es/nil-ws-api/v1/palabra/'
SIMPLE_URL = '/es_sencilla'
SYNONYMOUS_URL = '/sinonimos'

def to_nltk_tree(node):
    if node.n_lefts + node.n_rights > 0:
        return Tree(node.orth_, [to_nltk_tree(child) for child in node.children])
    else:
        return node.orth_

#Returns if a word is simple or not
def isSimple(word):
    response = requests.get(NILWS_URL + word + SIMPLE_URL)
    data = response.json()
    if data['palabraSencilla']:
        return True
    else:
        return False

#Splits the incoming text in an array of sentences
@app.route('/sentences', methods=['POST'])
def splitTextInSentences():
    data = request.get_json()
    text = data["text"]
    sentences = []
    nlp = spacy.load("es_core_news_sm")
    doc = nlp(text)
    for sent in doc.sents:
        sentences.append(sent.text)
    return jsonify(sentences=sentences)
   

#Returns the synonymous that are simple of a given word if there are any
@app.route('/synonymous', methods=['POST'])
def synonymous():
    data = request.get_json()
    synonymous = unidecode(data["synonymous"])
    response = requests.get(NILWS_URL + synonymous + SYNONYMOUS_URL)
    synosymousASCII = response.json()
    synonymousList = synosymousASCII['sinonimos']
    simpleSynonymousList = []
    for token in synonymousList:
        word = token['sinonimo']
        if isSimple(word):
            simpleSynonymousList.append(word)
    return jsonify(synonymous=simpleSynonymousList)
    
@app.route('/')
def main():
   # nlp = spacy.load("es_core_news_sm")
    #doc = nlp("El primer emperador de Roma fue Julio Cesar, conocido por ser acuchillado. El fue traicionado en un anio A.C. por B.R.U.T.O")
    #[to_nltk_tree(sent.root).pretty_print() for sent in doc.sents]
    #assert doc.has_annotation("SENT_START")

    return render_template("home.html")
if __name__ == '__main__':
    app.run(debug=True)
