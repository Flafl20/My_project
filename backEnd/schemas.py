from pydantic import BaseModel, EmailStr, field_validator
from enum import Enum
from typing import Optional
from datetime import datetime, date


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


class PatientBase(BaseModel):
    date_of_birth: date
    phone_number: str
    address: str
    blood_type: str | None = None
    allergies: str | None = None
    emergency_contact_name: str
    emergency_contact_number: str
    medical_history: str | None = None

    @field_validator("date_of_birth", mode="before")
    @classmethod
    def parse_date(cls, v: any) -> date | None:
        if v is None:
            return None
        if isinstance(v, date):
            return v
        if isinstance(v, str):
            # Try to parse different date formats
            for fmt in ["%Y-%m-%d", "%Y-%m-%d", "%d-%m-%Y", "%m-%d-%Y"]:
                try:
                    return datetime.strptime(v, fmt).date()
                except ValueError:
                    continue
            # If no format matches, try to parse manually
            parts = v.split("-")
            if len(parts) == 3:
                year = int(parts[0])
                month = int(parts[1])
                day = int(parts[2])
                return date(year, month, day)
        raise ValueError(f"Invalid date format: {v}")


class patientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    date_of_birth: date
    phone_number: str
    address: str
    blood_type: str | None = None
    allergies: str | None = None
    emergency_contact_name: str
    emergency_contact_number: str
    medical_history: str | None = None


class Patient(PatientBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
