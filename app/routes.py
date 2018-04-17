from flask import render_template
from app import flaskInstance
from app.games import games


@flaskInstance.route('/')
def index():
    return render_template('index.html', games=games)


@flaskInstance.route('/games/<game>')
def game(game):
    if game in games:
        return render_template('game.html', game=games[game])
    else:
        return render_template('404.html', word=game, route='game'), 404


def game_not_existing(game):
    return render_template('404.html', word=game), 404


@flaskInstance.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
