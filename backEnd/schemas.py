from pydantic import BaseModel, EmailStr, field_validator
from enum import Enum
from typing import Optional, List
from datetime import datetime, date

# from models import Prescription


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
    patient_name: str | None = None
    prescriptions: List["Prescription"] = []

    class Config:
        from_attributes = True


class DoctorBase(BaseModel):
    specialty: str
    license_number: str
    phone_number: str


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseModel):
    specialty: str | None = None
    phone_number: str | None = None


class Doctor(DoctorBase):
    id: int
    user_id: int
    full_name: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PrescriptionBase(BaseModel):
    medication_name: str
    dosage: str
    frequency: str
    duration: str
    instructions: str | None = None
    max_refills: int = -1
    expiry_date: date | None = None


class PrescriptionCreate(PrescriptionBase):
    patient_id: int


class prescriptionUpdate(BaseModel):
    medication_name: str | None = None
    dosage: str | None = None
    frequency: str | None = None
    duration: str | None = None
    instructions: str | None = None
    max_refills: int | None = None
    expiry_date: date | None = None


class Prescription(PrescriptionBase):
    id: int
    patient_id: int
    doctor_id: int
    is_filled: bool
    times_filled: int
    prescribed_date: datetime
    created_at: datetime
    updated_at: datetime
    patient_name: str | None = None

    class Config:
        from_attributes = True


class PrescriptionFillCreate(BaseModel):
    quantity_dispensed: str
    notes: str | None = None


class PrescriptionFill(BaseModel):
    id: int
    prescription_id: int
    pharmacist_id: int
    filled_date: datetime
    quantity_dispensed: str
    notes: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class LabTestBase(BaseModel):
    test_name: str
    notes: str | None = None

class LabTestCreate(LabTestBase):
    patient_id: int

class LabTest(LabTestBase):
    id: int
    patient_id: int
    bio_analyst_id: int
    test_date: datetime
    created_at: datetime

    original_filename: str
    content_type: str

    class Config:
        from_attributes = True