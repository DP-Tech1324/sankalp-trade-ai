from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    side = Column(String)
    qty = Column(Float)
    price = Column(Float)
    exchange = Column(String, nullable=True)
    product = Column(String, nullable=True)
    brokerage = Column(String, nullable=True)
    net_amount = Column(String, nullable=True)
    date = Column(String, nullable=True)
    status = Column(String, default="IMPORTED")
    meta = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())