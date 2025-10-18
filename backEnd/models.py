from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Enum, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from database import Base, engine
from schemas import RoleEnum


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=False, index=True)
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    roleName = Column(Enum(RoleEnum), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", backref="user_role", uselist=False)


Base.metadata.create_all(bind=engine)
