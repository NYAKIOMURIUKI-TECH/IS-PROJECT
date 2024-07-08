from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base_model import Base, BaseModel

class Payment(BaseModel, Base):
    __tablename__ = 'payments'
    amount = Column(Integer)
    pay_method = Column(String(25))
    account = Column(String(60), nullable=False)

    booking_id = Column(String(60), ForeignKey('bookings.id'))
    booking = relationship('Booking', back_populates='payment', uselist=False)
