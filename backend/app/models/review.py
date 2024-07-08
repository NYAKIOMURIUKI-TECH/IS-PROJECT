from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.models.base_model import Base, BaseModel

class Review(BaseModel, Base):
    __tablename__ = 'reviews'
    client_id = Column(String(60), ForeignKey('clients.id'))
    worker_id = Column(String(60), ForeignKey('workers.id'))
    service_id = Column(String(60), ForeignKey('services.id'))
    rating = Column(Integer)
    text = Column(String(128), nullable=False)

    worker = relationship('Worker', back_populates='reviews')
