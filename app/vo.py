import json
from json import JSONEncoder

class SentenceTree:
    def __init__(self, text, children, height,id):
        self.text = text
        self.children = children
        self.height = height
        self.id=id

    def serialize(self):
        return {
            'text':self.text,
            'children':[child.serialize() for child in self.children],
            'height':self.height,
            'id':self.id
        }