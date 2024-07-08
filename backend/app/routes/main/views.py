from app.routes.main import main, permission_required, admin_required
from flask import make_response, request, abort, jsonify
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies, jwt_required, create_access_token, get_jwt_identity

from app.models import storage
from app.models.user import Client, Worker, User

@main.route('/auth/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        data = request.get_json()
        user = storage.get_by_email('User', email=data.get('email'))
        if user and user.verify_password(data.get('password')):
            return make_response(jsonify({"user":user.to_json(), "token":create_access_token(identity=user.id)}))
        return make_response({"message": "Invalid Credentials"}), 403
    abort(403)


@main.route('/auth/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        email = storage.get_by_email(User, data.get('email'))
        if email is not None:
            return make_response(jsonify({"message": "Account already exists"})), 409
        print(data.get('work'))
        print(data)
        if data.get('work') == True :
            user = Worker(**data)
        else:
            user = Client(**data)
        user.save()
        if storage.get(user.__class__.__name__, user.id):
            return make_response({"message": "Registration Success"}), 201
        return make_response({"message": "Error creating user account"}), 204
    abort(403)

@main.route('/users/<user_id>')
def get_user(user_id):
    user = storage.get(User, user_id)
    if not user:
        return make_response({"error": "User not found"}), 404
    parsed_user = user.to_json()
    return make_response(parsed_user), 200

@main.route('/workers')
def get_workers():
    return make_response({storage.get_all('Worker')})