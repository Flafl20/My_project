from pydantic import BaseModel, EmailStr, field_validator
from enum import Enum
from datetime import datetime


class RoleEnum(Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"
    PHARMACIST = "PHARMACIST"
    BI0_ANALYST = "BIO_ANALYST"
    ADMIN = "ADMIN"


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool = False


class UserCreate(UserBase):
    password: str
    role: RoleEnum

    @field_validator("password")
    @classmethod
    def vaslidate_password(cls, v: str) -> str:
        if isinstance(v, (int, float)):
            v = str(v)
        return v

    class Config:
        from_attributes = True


class User(UserBase):
    id: int
    role: RoleEnum
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
