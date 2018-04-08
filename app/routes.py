from flask import render_template, abort
from app import flaskInstance
from app.games import games

@flaskInstance.route('/')
def index():
    return render_template('index.html')


@flaskInstance.route('/games/<game>')
def game(game):
    if game in games:
        return render_template('game.html', game=games[game])
    else:
        return render_template('404.html', word=game, route='game'), 404


def gameNotExisting(game):
    return render_template('404.html', word=game)


@flaskInstance.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', word=e), 404
