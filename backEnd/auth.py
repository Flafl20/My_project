from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
import schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "KDPraB50fY8+GPwNNqrvQFOV9ZFuRObR0ob0bQ4AOs9scXpWDtVLVdfeUqEHm8/C"
ALGORITHM = "HS256"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


def role_required(*allowed_roles: schemas.RoleEnum) -> callable:
    async def role_checker(current_user: User = Depends(get_current_user)):
        user_role = current_user.role if isinstance(current_user.role, schemas.RoleEnum) else schemas.RoleEnum(current_user.role)

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for this role",
            )
        return current_user

    return role_checker
