from flask import render_template
from flask import url_for
from app import flaskInstance
from app.games import games

@flaskInstance.route('/')
def index():
    return render_template('index.html')


@flaskInstance.route('/games/<game>')
def game(game):
    if game in games:
        return render_template('game.html', game=games[game])
