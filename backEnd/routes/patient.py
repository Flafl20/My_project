import schemas, models
from auth import get_db, role_required
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/patient",
    tags=["patient"],
)


@router.get("/profile/status")
async def check_profile_status(
    current_user: models.User = Depends(role_required(schemas.RoleEnum.PATIENT)),
    db: Session = Depends(get_db),
):
    patient_profile = (
        db.query(models.Patient)
        .filter(models.Patient.user_id == current_user.id)
        .first()
    )
    return {
        "has_profile": patient_profile is not None,
        "user_id": current_user.id,
        "emial": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
    }


@router.post("/profile", response_model=schemas.Patient)
async def create_patient_profile(
    patient_data: schemas.patientCreate,
    current_user: models.User = Depends(role_required(schemas.RoleEnum.PATIENT)),
    db: Session = Depends(get_db),
):
    existing_profile = (
        db.query(models.Patient)
        .filter(models.Patient.user_id == current_user.id)
        .first()
    )
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient profile already exists",
        )

    db_patient = models.Patient(
        user_id=current_user.id,
        date_of_birth=patient_data.date_of_birth,
        phone_number=patient_data.phone_number,
        address=patient_data.address,
        blood_type=patient_data.blood_type,
        allergies=patient_data.allergies,
        emergency_contact_name=patient_data.emergency_contact_name,
        emergency_contact_phone=patient_data.emergency_contact_number,
        medical_history=patient_data.medical_history,
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)

    return db_patient


@router.get("/profile/info", response_model=schemas.Patient)
async def get_patient_profile(
    current_user: models.User = Depends(
        role_required([schemas.RoleEnum.PATIENT, schemas.RoleEnum.DOCTOR])
    ),
    db: Session = Depends(get_db),
):
    patient_profile = (
        db.query(models.Patient)
        .filter(models.Patient.user_id == current_user.id)
        .first()
    )
    if not patient_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found. Please complete profile first",
        )
    return patient_profile


@router.put("/profile", response_model=schemas.Patient)
async def update_patient_profile(
    patient_data=schemas.PatientUpdate,
    current_user: models.User = Depends(role_required(schemas.RoleEnum.PATIENT)),
    db: Session = Depends(get_db),
):
    patient_profile = (
        db.query(models.Patient)
        .filter(models.Patient.user_id == current_user.id)
        .first()
    )
    if not patient_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found, Please create profile",
        )
    update_data = patient_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient_profile, field, value)

    db.commit()
    db.refresh(patient_data)

    return patient_profile
