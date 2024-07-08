from flask import make_response, jsonify, request
from flask_jwt_extended import jwt_required
from datetime import datetime

from app.routes.main import main, permission_required
from app.models import storage

@main.route('/bookings/<client_id>', methods=['POST'])
def create_booking(client_id):
    if request.method == 'POST':
        data = request.get_json()
        if data is None:
            return make_response({"error":"Not a JSON"}), 400
        client = storage.get('Client', client_id)
        if client is None:
            return make_response({"error":"Client not found"}), 404
        date = data.get('date')
        date = datetime.strptime(date, '%Y-%m-%d')
        print(data)
        booking = client.book_service(
            service_id=data.get('serviceId'),
            date=date
        )
        if booking is None:
            return make_response(jsonify({"error": "Could not create booking"})), 204
        return make_response(booking.to_json()), 201

@main.route('/<worker_id>/apply_booking/<booking_id>')
def apply_booking(worker_id, booking_id):
    booking = storage.get('Booking', booking_id)
    if booking is None:
        return make_response({'error': 'Booking not found'}), 404
    worker = storage.get('Worker', worker_id)
    if worker is None:
        return make_response({'error': 'Worker not found'}), 404
    booking.worker_id = worker.id
    booking.status = 'confirmed'
    booking.save()
    return make_response(jsonify(booking.to_json()))

@main.route('/<worker_id>/complete_booking/<booking_id>')
def complete_booking(worker_id, booking_id):
    booking = storage.get('Booking', booking_id)
    if booking is None:
        return make_response({'error': 'Booking not found'}), 404
    worker = storage.get('Worker', worker_id)
    if worker is None:
        return make_response({'error': 'Worker not found'}), 404
    booking.worker_id = worker.id
    booking.status = 'completed'
    booking.save()
    return make_response(jsonify(booking.to_json()))

@main.route('/bookings/<user_id>', methods=['GET'])
def get_bookings(user_id):
    user = storage.get('User', user_id)
    bookings = user.bookings if user else None
    if not bookings:
        return make_response(jsonify([])), 200  # Return an empty list
    bookings_ = [booking.to_json() for booking in bookings]
    for b in bookings_:
        worker = storage.get('Worker', b.get('worker_id'))
        if worker:
            b['worker_name'] = f'{worker.firstname} {worker.lastname}'
        service = storage.get('Service', b.get('service_id'))
        if service:
            b['service_name'] = service.name
            b['price'] = service.price
        date = datetime.strptime(b['date'], '%Y-%m-%d %H:%M:%S')
        b['date'] = date.strftime('%d %B %Y')
    return make_response(jsonify(bookings_)), 200

@main.route('/available_jobs', methods=['GET'])
def avail_jobs():
    jobs = storage.get_all('Booking')
    if not jobs:
        return make_response(jsonify([])), 200  # Return an empty list
    jobs_ = [job.to_json() for job in jobs if job.status == 'pending']
    for b in jobs_:
        worker = storage.get('Worker', b.get('worker_id'))
        if worker:
            b['worker_name'] = f'{worker.firstname} {worker.lastname}'
        service = storage.get('Service', b.get('service_id'))
        if service:
            b['service_name'] = service.name
            b['price'] = service.price
        date = datetime.strptime(b['date'], '%Y-%m-%d %H:%M:%S')
        b['date'] = date.strftime('%d %B %Y')
    return make_response(jsonify(jobs_)), 200


@main.route('/bookings/<booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    booking = storage.get('Booking', booking_id)
    if booking is None:
        return make_response({"error":"Booking not found"}), 404
    booking.delete()
    return make_response({"message": "Booking cancelled successfully"}), 200
