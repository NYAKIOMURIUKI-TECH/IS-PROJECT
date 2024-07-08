from flask import make_response, jsonify, request
from flask_jwt_extended import jwt_required
from datetime import datetime
from app.models.payment import Payment

from app.routes.main import main, permission_required
from app.models import storage

@main.route('/make_payment/<booking_id>')
def make_payment(booking_id):
    booking = storage.get('Booking', booking_id)
    if booking is None:
        return make_response({'message': 'Booking not found'}), 404
    client = storage.get('Client', booking.client_id)
    if client.payment_info is None:
        return make_response({'message': 'Payment info not added'}), 409
    service = storage.get('Service', booking.service_id)
    if client.payment_info is None:
        return make_response({'message': 'Service not found'}), 400
    if booking.status == 'completed':
        payment = Payment(
            amount = service.price,
            pay_method=client.payment_info,
            account=client.payment_account,
            )
        booking.paid = True
        booking.status = 'approved'
        booking.save()
        payment.save()
        return make_response(jsonify(booking.json()))
	