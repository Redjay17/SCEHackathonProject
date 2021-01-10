from flask import Flask, render_template, session, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from json import JSONDecoder, dumps

from deck import Deck, Card

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

# Defines
NEW_CHAT_MESSAGE_EVENT = 'newChatMessage'
GAME_STATE_UPDATED = 'gameStateUpdated'
CONNECT_FAILED = 'connectFailed'
PLAYER_READY_EVENT = "playerReadyEvent"
GAME_START_EVENT = "gameStartEvent"
PLAYER_SKIP_EVENT = "playerSkipEvent"
ROUND_UPDATE_EVENT = "roundUpdateEvent"

rooms = { }

class GameState:
    def __init__(self):
        self.num_players = 0
        self.num_players_in_play = 4
        self.game_started = False
        self.players = {}
        self.curr_stack = []
        self.in_round = [False, False, False, False]
        self.order = [1,2,3,4]
        self.current_turn = 1

    def add_player(self, username):
        no = self.order.pop()
        player = Player(username, no)
        self.players.update({username : player})
        self.num_players += 1

    def remove_player(self, username):
        player = self.players.get(username, -1)
        if player != -1:
            if player.order != -1:
                self.order.append(player.order)
            self.players.pop(username)
            self.num_players -= 1

    def ready_player(self, username):
        player = self.players.get(username, -1)
        if player != -1:
            player.is_ready = True
        else:
            return False
        
        all_ready = True
        for p in self.players:
            if not self.players[p].is_ready:
                all_ready = False

        return all_ready

    def update_turn_order(self):
        while self.player_revserse_dictionary.get(self.current_turn, -1) == -1 or not self.in_round[self.current_turn-1]:
            self.current_turn += 1
            if self.current_turn > 4:
                self.current_turn = 1

    def start_game(self):
        self.game_started = True

        deck = Deck()
        deck.shuffle()

        first_post = -1
        spade_post = -1

        for p in self.players:
            self.in_round[self.players[p].order-1] = True
            for i in range(13):
                self.players[p].draw(deck)
                if self.players[p].hand[i].value == 3 and  self.players[p].hand[i].suit == "Spades":
                    spade_post = p
            
            if self.players[p].order == 1:
                first_post = p

        if first_post != -1 and spade_post != -1:
            temp = self.players[first_post].order
            self.players[first_post].order = self.players[spade_post].order
            self.players[spade_post].order = temp
        
        self.player_dictionary = {}
        self.player_revserse_dictionary = {}
        for p in self.players:
            self.player_dictionary[p] = self.players[p].order
            self.player_revserse_dictionary[self.players[p].order] = p

        self.update_turn_order()

    def to_json(self):
        return dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)
            

class Player:
    def __init__(self, username, order):
        self.username = username
        self.hand = []
        self.hand_size = 0
        self.in_round = True
        self.is_ready = False
        self.order = order

    def draw(self, deck):
        self.hand.append(deck.drawCard())
        self.hand_size += 1
        return self


@socketio.on('connect')
def on_connect():
    if request.args.get('fail'):
        return False
    
    roomName = request.args.get('roomId')
    username = request.args.get('username')

    if rooms.get(roomName, -1) == -1:
        rooms[roomName] = GameState()

    if isinstance(rooms.get(roomName, -1), GameState) and rooms.get(roomName).num_players < 4 and len(username) > 0:
        join_room(roomName)
        rooms[roomName].add_player(username)
        print('Client ' + username + ' connected to: ' + roomName + ' with ' + str(rooms[roomName].num_players) + ' players')
    else:
        emit(CONNECT_FAILED)
        print('Client attempted to join when room was full or had no username...')
        username = ""

@socketio.on(NEW_CHAT_MESSAGE_EVENT)
def on_message_sent(data):
     roomName = request.args.get('roomId')
     emit(
        NEW_CHAT_MESSAGE_EVENT,
        data,
        room=roomName
     )

@socketio.on('disconnect')
def test_disconnect():
    roomName = request.args.get('roomId')
    username = request.args.get('username')

    if isinstance(rooms.get(roomName, -1), GameState):
        leave_room(roomName)
        rooms[roomName].remove_player(username)
        print('Client ' + username + ' disconnected from: ' + roomName)

        if rooms[roomName].num_players == 0:
            rooms.pop(roomName)


@socketio.on(PLAYER_READY_EVENT)
def handle_ready(username):
    roomName = request.args.get('roomId')
    username = request.args.get('username')

    if isinstance(rooms.get(roomName, -1), GameState):
        all_ready = rooms[roomName].ready_player(username)
        if all_ready:
            rooms[roomName].start_game()
            emit(
                GAME_START_EVENT,
                rooms[roomName].to_json(),
                room=roomName
            )

            print("Game is ready in lobby " + roomName)

@socketio.on(PLAYER_SKIP_EVENT)
def handle_skip(username):
    roomName = request.args.get('roomId')
    username = request.args.get('username')
    gs = rooms[roomName]

    gs.players[username].in_round = False
    gs.in_round[gs.players[username].order] = False
    gs.num_players_in_play -= 1

    gs.update_turn_order()
    if gs.num_players_in_play <= 1:
        for p in gs.players:
            gs.players[p].in_round = True
            gs.in_round[gs.players[p].order-1] = True
            gs.num_players_in_play += 1

        gs.curr_stack = []

    rooms[roomName] = gs
    
    emit(
        ROUND_UPDATE_EVENT,
        gs.to_json(),
        room=roomName
    )
    
if __name__ == '__main__':
    socketio.run(app, host="localhost", port="4000")