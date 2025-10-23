from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
    Enum,
    DateTime,
    Text,
    Date,
)
from datetime import datetime, date
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
    created_at = Column(DateTime, default=datetime.utcnow())

    patient_profile = relationship(
        "Patient", back_populates="user", uselist=False, lazy="joined"
    )
    doctor_profile = relationship(
        "Doctor", back_populates="user", uselist=False, lazy="joined"
    )
    user_role = relationship(
        "Role", back_populates="user", uselist=False, lazy="joined"
    )


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    roleName = Column(Enum(RoleEnum), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="user_role", uselist=False)


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    date_of_birth = Column(DateTime, nullable=False)
    phone_number = Column(String, nullable=False)
    address = Column(String, nullable=False)
    blood_type = Column(String, nullable=False)
    allergies = Column(String, nullable=True)
    emergency_contact_name = Column(String, nullable=False)
    emergency_contact_number = Column(String, nullable=False)
    medical_history = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow())

    user = relationship("User", back_populates="patient_profile", uselist=False)
    prescriptions = relationship(
        "Prescription", back_populates="patient", lazy="dynamic"
    )
    lab_tests = relationship("labTest", back_populates="patient", lazy="dynamic")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    specialty = Column(String, nullable=False)
    license_number= Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow())

    user = relationship("User", back_populates="doctor_profile")
    prescriptions = relationship(
        "Prescription", back_populates="doctor", lazy="dynamic"
    )


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)

    medication_name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    instructions = Column(Text, nullable=True)

    is_filled = Column(Boolean, default=False)
    times_filled = Column(Integer, default=0)
    max_refills = Column(Integer, default=0)

    prescribed_date = Column(DateTime, default=datetime.utcnow())
    expiry_date = Column(Date, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow())

    # Relationships
    patient = relationship("Patient", back_populates="prescriptions")
    doctor = relationship("Doctor", back_populates="prescriptions")
    fills = relationship(
        "PrescriptionFill", back_populates="prescription", lazy="dynamic"
    )


class PrescriptionFill(Base):
    __tablename__ = "prescription_fills"

    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    pharmacist_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    filled_date = Column(DateTime, default=datetime.utcnow())
    quantity_dispensed = Column(String, nullable=False)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow())

    # Relationships
    prescription = relationship("Prescription", back_populates="fills")
    pharmacist = relationship("User", foreign_keys=[pharmacist_id])


Base.metadata.create_all(bind=engine)

class LabTest(Base):
    __tablename__ = "lab_tests"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    bio_analyst_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    test_name = Column(String, nullable=False)
    test_date = Column(DateTime, default=datetime.utcnow() ,nullable=False)

    file_path = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow())

    patient = relationship("Patient", back_populates="lab_tests")
    bio_analyst = relationship("User", foreign_keys=[bio_analyst_id])