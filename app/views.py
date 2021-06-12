import requests
import spacy
import json
import codecs
import sys
import es_core_news_sm
from unidecode import unidecode
from nltk import Tree
from flask import Flask, Response, request, render_template, jsonify
from random import seed
from random import randint
from collections import Counter
from string import punctuation
from heapq import nlargest
from spacy.lang.en.stop_words import STOP_WORDS
from vo import *




app = Flask(__name__)
# Create the application instance
# app = connexion.App(__name__, specification_dir='./')

# Read the swagger.yml file to configure the endpoints
# app.add_api('swagger.yml')

# URL CONSTANTS
NILWS_URL = 'https://holstein.fdi.ucm.es/nil-ws-api/v1/palabra/'
SIMPLE_URL = '/es_sencilla'
DEFINITION_URL = '/definiciones'
SYNONYMOUS_URL = '/sinonimos'

def to_nltk_tree(node, height):
    if node.n_lefts + node.n_rights > 0:
        return SentenceTree(node.orth_,[to_nltk_tree(child,height + 1) for child in node.children], height, node.i)
    else:
        return SentenceTree(node.orth_, node.children, height, node.i)

@app.route('/isSimple', methods=['POST'])
def simple():
    data=request.get_json()
    data=data['text']
    nlp=spacy.load("es_core_news_sm")
    textList=[]
    for word in data:
        textList.append(word['text'])
    text=' '.join(textList);
    doc=nlp(text)
    position=0
    simpleList=[]
    simple=False
    print('doc ', len(doc))
    for token in doc:
        pos=token.pos_
        if (pos != "ADP" and pos != "DET"
            and pos != "CONJ" and pos != "NUM"
            and pos != "PRON" and pos != "PUNCT"
            and pos != "SCONJ" and pos != "SYM"
            and pos != "X" and pos!="SPACE"):
                simple=isSimple(unidecode(token.text))
        else:
            simple=None
        simpleList.append({'id':data[position]['id'],'simple':simple})
        position+=1
    jsonList=json.dumps(simpleList)
    print(jsonList)
    return jsonify(simpleList=jsonList)

# Returns if a word is simple or not
def isSimple(word):
    response = requests.get(NILWS_URL + word + SIMPLE_URL)
    data = response.json()
    if data['palabraSencilla']:
        return True
    else:
        return False

@app.route('/definition', methods=['POST'])
def definition():
    word=request.get_json()
    word=word['word']
    response = requests.get(NILWS_URL + word + DEFINITION_URL)
    data = response.json()

    return jsonify(definiciones=data['definiciones'])


@app.route('/summary', methods=['POST'])
def sentenceSummary():
    data = request.get_json()
    text = data["text"]
    nlp = spacy.load("es_core_news_sm")
    docx = nlp(text)
    allWords = [word.text for word in docx]
    extraWords = list(STOP_WORDS) + list(punctuation) + ['\n']
    freqWord = {}
    for word in allWords:
        aux = word.lower()
        if aux not in extraWords and aux.isalpha():
            if aux in freqWord.keys():
                freqWord[aux] += 1
            else:
                freqWord[aux] = 1
    val=sorted(freqWord.values())
    maxFreq=val[-3:]
    for word in freqWord.keys():
        freqWord[word] = (freqWord[word]/maxFreq[-1])
    sentStrength={}
    for sent in docx.sents:
        for word in sent :
            if word.text.lower() in freqWord.keys():
                if sent in sentStrength.keys():
                    sentStrength[sent]+=freqWord[word.text.lower()]
                else:
                    sentStrength[sent]=freqWord[word.text.lower()]
            else:
                continue
    topSentences = (sorted(sentStrength.values())[::-1])
    top40percentSent = int(0.4*len(topSentences))
    topSent = topSentences[:top40percentSent]
    summary = []
    for sent,strength in sentStrength.items():
        if strength in topSent:
            summary.append(sent.text)
        else:
            continue
    print("summary:", summary)
    return jsonify(summary=summary)


# Given a sentence retunrs its dependency tree
@app.route('/sentences/tree', methods=['POST'])
def sentenceTree():
    data = request.get_json()
    sentence = data["sentence"]
    nlp = spacy.load("es_core_news_sm")
    doc = nlp(sentence)
    jsonTree = ''
    sentenceIds = []
    for sent in doc.sents:
        tree = to_nltk_tree(sent.root, 0)
        for word in sent:
            sentenceIds.append({'text': word.text, 'id': word.i})

        jsonTree = jsonify(tree=tree.serialize(), sentenceIds=sentenceIds)
        print(tree)

    print(tree.serialize())
    return jsonTree

# Splits the incoming text in an array of sentences
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


# Returns the synonymous that are simple of a given word if there are any
@app.route('/synonymous', methods=['POST'])
def synonymous():
    data = request.get_json()
    synonymous = unidecode(data["synonymous"])
    response = requests.get(NILWS_URL + synonymous + SYNONYMOUS_URL)
    synosymousASCII = response.json()
    completeSynonymousList = synosymousASCII['sinonimos']
    simpleSynonymousList = []
    synonymousList = []
    for token in completeSynonymousList:
        word = token['sinonimo']
        if isSimple(word):
            simpleSynonymousList.append(word)
        else:
            synonymousList.append(word)
    return jsonify(synonymous=synonymousList, simpleSynonymous=simpleSynonymousList)


@app.route('/')
def main():
    # nlp = spacy.load("es_core_news_sm")
    # doc = nlp("El primer emperador de Roma fue Julio Cesar, conocido por ser acuchillado. El fue traicionado en un anio A.C. por B.R.U.T.O")
    # [to_nltk_tree(sent.root).pretty_print() for sent in doc.sents]
    # assert doc.has_annotation("SENT_START")

    return render_template("home.html")


if __name__ == '__main__':
    app.run(debug=True)