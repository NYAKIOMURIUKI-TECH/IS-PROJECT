from flask import Flask
from config import config
from flask_login import LoginManager
from flask_jwt_extended import JWTManager

login_manager = LoginManager()
jwt = JWTManager()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    login_manager.init_app(app)
    jwt.init_app(app)
    
    from app.routes.main import main
    app.register_blueprint(main)

    return app
