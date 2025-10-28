from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from auth import get_db, get_current_user, role_required
from models import User, Doctor, Prescription, Patient
import schemas

router = APIRouter(prefix="/doctor", tags=["Doctor"])


@router.get("/profile/status")
async def check_doctor_profile_status(
    current_user: User = Depends(role_required(schemas.RoleEnum.DOCTOR)),
    db: Session = Depends(get_db),
):
    doctor_profile = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()

    return {
        "has_profile": doctor_profile is not None,
        "user_id": current_user.id,
        "email": current_user.email,
        "full_name": f"{current_user.first_name} {current_user.last_name}",
    }


@router.post("/profile", response_model=schemas.Doctor)
async def create_doctor_profile(
    doctor_data: schemas.DoctorCreate,
    current_user: User = Depends(role_required(schemas.RoleEnum.DOCTOR)),
    db: Session = Depends(get_db),
):
    existing_license = (
        db.query(Doctor)
        .filter(Doctor.license_number == doctor_data.license_number)
        .first()
    )
    if existing_license:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="License number alredy registered",
        )
    db_doctor = Doctor(
        user_id=current_user.id,
        specialty=doctor_data.specialty,
        license_number=doctor_data.license_number,
        phone_number=doctor_data.phone_number,
    )

    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)

    return db_doctor


@router.get("/profile", response_model=schemas.Doctor)
async def get_doctor_profile(
    current_user: User = Depends(role_required(schemas.RoleEnum.DOCTOR)),
    db: Session = Depends(get_db),
):
    doctor_profile = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()

    if not doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor profile not found. please complete the profile",
        )

    return {
        **doctor_profile.__dict__,
        "full_name": f"{current_user.first_name} {current_user.last_name}",
    }


@router.put("/profile", response_model=schemas.Doctor)
async def update_doctor_profile(
    doctor_data: schemas.DoctorUpdate,
    current_user: User = Depends(role_required(schemas.RoleEnum.DOCTOR)), 
    db: Session = Depends(get_db),
):
    doctor_profile = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found, please create profile",
        )

    update_data = doctor_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(doctor_profile, field, value)

    db.commit()
    db.refresh(doctor_profile)

    return doctor_profile


@router.post("/prescriptions", response_model=schemas.Prescription)
async def create_prescriptions(
    prescription_data: schemas.PrescriptionCreate,
    current_user: User = Depends(role_required(schemas.RoleEnum.DOCTOR)),
    db: Session = Depends(get_db),
):
    doctor_profile = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="doctor not found, please complete creating doctor",
        )

    patient = (
        db.query(Patient).filter(Patient.id == prescription_data.patient_id).first()
    )
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="patient not found"
        )

    db_prescrption = Prescription(
        patient_id=prescription_data.patient_id,
        doctor_id=doctor_profile.id,
        medication_name=prescription_data.medication_name,
        dosage=prescription_data.dosage,
        frequency=prescription_data.frequency,
        instructions=prescription_data.instructions,
        duration=prescription_data.duration,
        max_refills=prescription_data.max_refills,
        expiry_date=prescription_data.expiry_date,
    )
    db.add(db_prescrption)
    db.commit()
    db.refresh(db_prescrption)

    return db_prescrption


@router.get("/prescriptions/{prescription_id}", response_model=schemas.Prescription)
async def get_prescription(
    prescription_id: int,
    current_user: User = Depends(role_required(schemas.RoleEnum.DOCTOR)),
    db: Session = Depends(get_db),
):
    doctor_profile = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor profile not found"
        )

    prescription = (
        db.query(Prescription)
        .filter(
            Prescription.id == prescription_id,
            Prescription.doctor_id == doctor_profile.id,
        )
        .first()
    )

    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="prescription not found"
        )

    return prescription


@router.get("/patients", response_model=list[schemas.Patient])
async def get_all_patients(
    current_user: User = Depends(role_required(schemas.RoleEnum.DOCTOR)),
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).join(User, Patient.user_id == User.id).all()
    patient_list = []
    for patient in patient:
        patient_dict = {
            **patient.__dict__,
            "patient_name": f"{patient.user.first_name} {patient.user.last_name}",
        }
    return patient_list


@router.get("/patients/{patient_id}", response_model=schemas.Patient)
async def get_patient_by_id(
    patient_id: int,
    current_user: User = Depends(role_required(schemas.RoleEnum.DOCTOR)),
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="patient not found"
        )
    return {
        **patient.__dict__,
        "patient_name": f"{patient.user.first_name} {patient.user.last_name}",
    }
