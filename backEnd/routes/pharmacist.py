from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from auth import get_db, get_current_user, role_required
from models import User , Prescription, PrescriptionFill
import schemas
from datetime import datetime

router = APIRouter(prefix="/pharmacist", tags=["pharmacist"])

@router.get("/prescriptions", response_model=list[schemas.Prescription])
async def get_prescriptions(
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(role_required(schemas.RoleEnum.PHARMACIST)),
):
    prescriptions = db.query(Prescription).all()
    return prescriptions

@router.get("/prescriptions/{prescription_id}", response_model=schemas.Prescription)
async def get_prescription_by_id(
        prescription_id: int,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(role_required(schemas.RoleEnum.PHARMACIST)),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return prescription

@router.post("/prescriptions/{prescription_id}/fill", response_model=schemas.Prescription)
async def fill_prescription(
        prescription_id: int,
        fill_data: schemas.PrescriptionFillCreate,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(role_required(schemas.RoleEnum.PHARMACIST)),
):
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")

    total_allowed_fills = prescription.max_refills + 1

    if prescription.times_filled >= total_allowed_fills:
        raise HTTPException(status_code=400, detail="Too many fills")

    db_fill = PrescriptionFill(
        prescription_id=prescription.id,
        pharmacist_id=current_user.id,
        quantity_dispensed=fill_data.quantity_dispensed,
        notes=fill_data.notes,
        filled_date=datetime.utcnow(),
    )
    prescription.times_filled += 1


    if prescription.times_filled >= prescription.max_refills:
        prescription.is_filled = True

    prescription.updated_at = datetime.utcnow()

    try:
        db.add(db_fill)
        db.commit()
        db.refresh(db_fill)
        db.add(prescription)
        db.commit()
        db.refresh(prescription)
        return prescription
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to fill prescription: {str(e)}")