import schemas, models
from auth import get_db, role_required
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/patient",
    tags=["patient"],
)


@router.get("/dashboard")
def patient_dashboard(
    current_user: models.User = Depends(role_required(schemas.RoleEnum.PATIENT)),
    db: Session = Depends(get_db),
):
    return {
        "message": f"Welcome patient {current_user.first_name}",
        "email": current_user.email,
    }
