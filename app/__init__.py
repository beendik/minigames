from flask import Flask

flaskInstance = Flask(__name__)

from app import routes

if __name__ == '__main__':
    flaskInstance.run()