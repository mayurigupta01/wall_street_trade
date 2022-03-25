from flask import Flask
import os

from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

app = Flask(__name__)

# Routes
from .routes import stock_api_blueprint

app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)
with app.app_context():
    app.register_blueprint(stock_api_blueprint)

# DB
user = 'postgres'
passw = 'StrongPassword'
dbname = 'wall_street'
dbhost = 'postgres.buildyourownmind.com'
app.config[
    'SQLALCHEMY_DATABASE_URI'] = \
    'postgresql://' + user + ':' + passw + '@' + dbhost + '/' + dbname
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
cors = CORS(app)
