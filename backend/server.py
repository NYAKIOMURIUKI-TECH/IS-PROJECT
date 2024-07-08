import os

from app.models import storage
from app import create_app, login_manager

config_name = os.getenv('FLASK_CONFIG') or 'default'
app = create_app(config_name)

@login_manager.user_loader
def load_user(user_id):
    return storage.get('User', user_id)

@app.route('/')
def index():
    return "<h1>Hello</h1>"

if __name__ == '__main__':
    app.run()
