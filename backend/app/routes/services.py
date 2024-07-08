from flask import make_response, jsonify, request
from flask_jwt_extended import jwt_required

from app.routes.main import main, permission_required
from app.models import storage

@main.route('/services')
def get_services():
	services = storage.get_all('Service')
	serv = [service.to_json() for service in services]
	return make_response(jsonify(serv)), 200
