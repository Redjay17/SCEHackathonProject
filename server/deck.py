# random library for shuffling the deck
import random

# Card object containing attributes of each playing card:
# face value or number value, and suit value

def get_val(value):
    if value == 1:
        return "Ace"
    elif value == 11:
        return 'Jack'
    elif value == 12:
        return 'Queen'
    elif value == 13:
        return 'King'
    else:
        return str(value)

class Card:
    def __init__(self, suit, value):
        if suit == "Diamonds" and value == 1:
            self.suit = suit
            self.value = value
            self.filepath = 'ACD.jpg'
            self.id = get_val(value)[0] + suit[0]
            return

        self.suit = suit
        self.value = value
        self.filepath = get_val(value)[0] + suit[0] + '.jpg'
        self.id = get_val(value)[0] + suit[0]
# shows current card
    def show(self):
        print("{} of {}".format(get_val(self.value), self.suit))


# Class containing deck information
# functions include: building the deck, holding all the cards in a standard 52 size deck
class Deck:
    def __init__(self):
        self.cards = []
        self.build()

# Function that builds the deck: it generates a two dimensional list with the first row being suit values and second row being face and number values
    def build(self):
        for suit in ['Spades','Clubs','Diamonds','Hearts']:
            for value in range(1,14):
                self.cards.append(Card(suit, value))

# Shows the entire deck
    def show(self):
        for card in self.cards:
            card.show()

# Draws a single card from the deck
    def drawCard(self):
        return self.cards.pop()

# Thoroughly shuffles the deck upon command
    def shuffle(self):
        for index in range(len(self.cards) -1, 0, -1):
            r = random.randint(0, index)
            # switching of card positions
            self.cards[index], self.cards[r] = self.cards[r], self.cards[index]

# Player class that contains attributes such as name and cards that they currently have within their hand.
class Player:
    def __init__(self, name):
        self.name = name
        self.hand = []

# Takes in single deck object and pops top card to add to hand
    def draw(self, deck):
        self.hand.append(deck.drawCard())
        return self

# Show all the cards in the current player hand
    def showHand(self):
        for card in self.hand:
            card.show()
