import logging

from flask import Flask
import os

from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

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
app.config['SQLALCHEMY_POOL_SIZE'] = 20
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 300
app.config['SQLALCHEMY_POOL_RECYCLE'] = 10
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 20
db.init_app(app)


from .models import stockinfo, users

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)


@login_manager.user_loader
def load_user(id):
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return users.query.get(int(id))


with app.app_context():
    db.create_all()

cors = CORS(app)


