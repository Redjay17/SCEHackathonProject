
import random

_suits_ = ['Spades', 'Clubs', 'Diamonds', 'Hearts']

class GameState:
    def __init__(self):
        self.deck = build_deck()


class Card:
    def __init__(self, suit, value):
        self.value = value
        self.suit = suit

    def toString():
        return "{} of {}".format(self.value, self.suit)

    def getVal():
        if self.value == 11:
            return 'Jack'
        elif self.value == 12:
            return 'Queen'
        elif self.value == 13:
            return 'King'
        elif self.value == 1:
            return "Ace"
        else:
            return self.value
print('hello')