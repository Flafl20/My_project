import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy.sql.functions import user

from models import User, Role
from database import SessionLocal, engine
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import schemas
from routes import patient, doctor, pharmacist,bioanalyst

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = ["http://localhost:3000", "http://localhost:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "KDPraB50fY8+GPwNNqrvQFOV9ZFuRObR0ob0bQ4AOs9scXpWDtVLVdfeUqEHm8/C"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_user_by_Email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):

    try:
        if isinstance(user.password, str):
            password = user.password.encode("utf-8")[:72]
        else:
            password = user.password[:72]

        hashed_password = pwd_context.hash(password.decode("utf-8"))
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active,
            role=user.role,
            created_at=datetime.utcnow(),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        db_role = Role(roleName=user.role, user_id=db_user.id)
        db.add(db_role)
        db.commit()

        return db_user

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error Creting user:{str(e)}")


@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_Email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)


def authenticate_user(email: str, password: str, db: Session):
    user = get_user_by_Email(email=email, db=db)
    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="the email or the password are wrong ",
        )
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + timedelta(minutes=15)
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(
        email=form_data.username, password=form_data.password, db=db
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="email or password are invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {"access_token": access_token, "token_type": "bearer"}


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token isinvalid or expired",
            )
        return {"email": email, "role": role}
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")


@app.get("/verify-token")
async def verify_auth_token(token_data: dict = Depends(verify_token)):
    return {"is_valid": True, "email": token_data["email"], "role": token_data["role"]}


app.include_router(patient.router)
app.include_router(doctor.router)
app.include_router(pharmacist.router)
app.include_router(bioanalyst.router)