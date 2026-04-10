from backend.database import SessionLocal, engine, Base
from backend.models import User
from backend.services.auth import get_password_hash

def create_user(username, password):
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        print(f"User {username} already exists")
    else:
        hashed_pw = get_password_hash(password)
        new_user = User(username=username, hashed_password=hashed_pw)
        db.add(new_user)
        db.commit()
        print(f"User {username} created successfully!")
    db.close()

if __name__ == "__main__":
    create_user("Krish", "passward18102005")
