from flask import Flask, render_template, session, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")


# Defines
NEW_CHAT_MESSAGE_EVENT = 'newChatMessage'

@socketio.on('connect')
def on_connect():
    if request.args.get('fail'):
        return False
    
    roomName = request.args.get('roomId')
    join_room(roomName)
    print('Client connected to: ' + roomName)

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
    leave_room(roomName)
    print('Client disconnected from: ' + roomName)

if __name__ == '__main__':
    socketio.run(app, host="localhost", port="4000")