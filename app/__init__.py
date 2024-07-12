from flask import Flask
from flask_cors import CORS
from .routes import setup_routes
from dotenv import load_dotenv, find_dotenv



def create_app():
    load_dotenv(find_dotenv())
    app = Flask(__name__)
    CORS(app)  
    setup_routes(app)
    return app
