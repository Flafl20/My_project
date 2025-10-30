from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from models import User, Patient, LabTest
from sqlalchemy.orm import Session
from auth import get_db, get_current_user, role_required
import schemas
from datetime import datetime
from starlette.responses import FileResponse
import os
import uuid
import shutil

router = APIRouter(prefix="/bio-analyst", tags=["bio-analyst"])

LAB_RESULTS_DIR = os.path.expanduser("~/Documents/lab-results")

os.makedirs(LAB_RESULTS_DIR, exist_ok=True)

@router.post("/test", response_model=schemas.LabTest)
async def create_lab_test(
        patient_id: int = Form(...),
        test_name: str = Form(...),
        notes: str | None = Form(...),
        file: UploadFile = File(...),
        current_user: schemas.User = Depends(role_required(schemas.RoleEnum.BIO_ANALYST)),
        db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    file_path = ""
    try:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(LAB_RESULTS_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create lab test: {e}")

    finally:
        file.file.close()

    db_lab_test = LabTest(
        patient_id=patient_id,
        bio_analyst_id=current_user.id,
        test_name=test_name,
        notes=notes,
        test_date=datetime.now(),
        file_path=file_path,
        original_filename=file.filename,
        content_type=file.content_type
    )

    try:
        db.add(db_lab_test)
        db.commit()
        db.refresh(db_lab_test)
    except Exception as e:
        db.rollback()
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to create lab test: {e}")

@router.get("/patients/{patient_id}/tests", response_model=list[schemas.LabTest])
async def get_lab_test_for_patients(
        patient_id: int ,
        db: Session = Depends(get_db),
        current_user: User = Depends(role_required(schemas.RoleEnum.BIO_ANALYST)),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    tests = db.query(LabTest).filter(LabTest.patient_id == patient_id).all()
    return tests

@router.get("/tests/{test_id}", response_model=schemas.LabTest)
async def get_lab_test(
        test_id: int,
        db: Session = Depends(get_db),
        cureent_user : User = Depends(role_required(schemas.RoleEnum.BIO_ANALYST)),
):
    test = db.query(LabTest).filter(LabTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Lab test not found")
    return test

@router.get("/tests/{test_id}/file")
async def get_lab_test_file(
        test_id: int,
        current_user: User = Depends(role_required(schemas.RoleEnum.BIO_ANALYST)),
        db: Session = Depends(get_db),
):
    test = db.query(LabTest).filter(LabTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Lab test not found")
    if not os.path.exists(test.file_path):
        raise HTTPException(status_code=500, detail="File not found on server. It may have  been moved or deleted.")

    return FileResponse(
        path=test.file_path,
        filename=test.original_filename,
        media_type=test.content_type,
    )

@router.get("/tests", response_model=list[schemas.LabTest])
async def get_lab_tests(
        db: Session = Depends(get_db),
        current_user: User = Depends(role_required(schemas.RoleEnum.BIO_ANALYST)),
):
    tests = db.query(LabTest).all()
    return tests