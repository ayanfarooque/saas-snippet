import os
# Force reload for Neon Postgres database config and bcrypt hashing
import razorpay
from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from dotenv import load_dotenv

from app import models, schemas, crud
from app.database import engine, Base, get_db
from app.auth import get_current_user, create_access_token, verify_password

load_dotenv()

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Zero to Subscriber — Snippet/Prompt Library SaaS")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Razorpay
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder"), os.getenv("RAZORPAY_KEY_SECRET", "secret_placeholder"))
)

class PaymentVerification(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


@app.get("/")
def read_root():
    return {"message": "SaaS Snippet API is running!"}


# --- Auth Routes ---

@app.post("/signup", response_model=schemas.Token)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    user = crud.create_user(db, user_in)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/login", response_model=schemas.Token)
def login(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user_in.email)
    if not db_user or not verify_password(user_in.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", response_model=schemas.UserResponse)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# --- Folder Routes ---

@app.get("/folders", response_model=List[schemas.FolderResponse])
def get_folders(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_folders_for_user(db, current_user.id)


@app.post("/folders", response_model=schemas.FolderResponse)
def create_folder(
    folder_in: schemas.FolderCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_folder(db, folder_in, current_user)


# --- Tag Routes ---

@app.get("/tags", response_model=List[schemas.TagResponse])
def get_tags(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_tags_for_user(db, current_user.id)


# --- Snippet Routes ---

@app.get("/snippets", response_model=List[schemas.SnippetResponse])
def get_snippets(
    search: Optional[str] = None,
    folder_id: Optional[int] = None,
    tag: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_snippets_for_user(
        db,
        user_id=current_user.id,
        search=search,
        folder_id=folder_id,
        tag_name=tag
    )


@app.post("/snippets", response_model=schemas.SnippetResponse)
def create_snippet(
    snippet_in: schemas.SnippetCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_snippet(db, snippet_in, current_user)


@app.get("/snippets/{snippet_id}", response_model=schemas.SnippetResponse)
def get_snippet(
    snippet_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_snippet = crud.get_snippet_by_id(db, snippet_id, current_user.id)
    if not db_snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found"
        )
    return db_snippet


@app.put("/snippets/{snippet_id}", response_model=schemas.SnippetResponse)
def update_snippet(
    snippet_id: int,
    snippet_update: schemas.SnippetUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.update_snippet(db, snippet_id, snippet_update, current_user)


@app.delete("/snippets/{snippet_id}")
def delete_snippet(
    snippet_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_snippet(db, snippet_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found"
        )
    return {"message": "Snippet deleted successfully"}


# --- Public Access Routes ---

@app.get("/s/{slug}", response_model=schemas.PublicSnippetResponse)
def get_public_snippet(slug: str, db: Session = Depends(get_db)):
    db_snippet = crud.get_public_snippet_by_slug(db, slug)
    if not db_snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Public snippet not found"
        )
    return {
        "title": db_snippet.title,
        "content": db_snippet.content,
        "language": db_snippet.language,
        "slug": db_snippet.slug,
        "created_at": db_snippet.created_at,
        "tags": [tag.name for tag in db_snippet.tags]
    }


# --- Razorpay Integration Routes ---

@app.post("/create-razorpay-order")
def create_razorpay_order(
    current_user: models.User = Depends(get_current_user)
):
    try:
        amount_paise = 75000  # ₹750 INR
        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"receipt_user_{current_user.id}",
            "payment_capture": 1
        }
        order = razorpay_client.order.create(data=order_data)
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": os.getenv("RAZORPAY_KEY_ID")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/verify-payment")
def verify_payment(
    data: PaymentVerification,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        params_dict = {
            'razorpay_order_id': data.razorpay_order_id,
            'razorpay_payment_id': data.razorpay_payment_id,
            'razorpay_signature': data.razorpay_signature
        }
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        crud.update_user_to_pro(db, user_id=current_user.id)
        return {"status": "success", "message": "Successfully upgraded to Pro!"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment signature verification failed. Please try again."
        )