from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://hussain:12345@localhost:5432/healthdata"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# with engine.connect() as conn:
#     conn.execute(text("DROP TABLE IF EXISTS lab_tests CASCADE"))
#     conn.execute(text("DROP TABLE IF EXISTS prescription_fills CASCADE"))
#     conn.execute(text("DROP TABLE IF EXISTS prescription CASCADE"))
#     conn.execute(text("DROP TABLE IF EXISTS doctors CASCADE"))
#     conn.execute(text("DROP TABLE IF EXISTS patients CASCADE"))
#     conn.execute(text("DROP TABLE IF EXISTS roles CASCADE"))
#     conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
#     conn.commit()
#     print("Dropped Tables: presciption_fills, presipton, doctors, paitents")
