import secrets
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from app import models, schemas
from app.auth import get_password_hash

# --- User CRUD ---

def get_user_by_email(db: Session, email: str) -> models.User:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> models.User:
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_pw = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_to_pro(db: Session, user_id: int) -> models.User:
    db_user = get_user_by_id(db, user_id)
    if db_user:
        db_user.is_pro = True
        db.commit()
        db.refresh(db_user)
    return db_user


# --- Folder CRUD ---

def get_folders_for_user(db: Session, user_id: int) -> list[models.Folder]:
    return db.query(models.Folder).filter(models.Folder.user_id == user_id).all()

def create_folder(db: Session, folder: schemas.FolderCreate, user: models.User) -> models.Folder:
    if not user.is_pro:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Folders are a Pro-tier feature. Please upgrade to Pro."
        )
    db_folder = models.Folder(name=folder.name, user_id=user.id)
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder


# --- Tag CRUD ---

def get_tags_for_user(db: Session, user_id: int) -> list[models.Tag]:
    return db.query(models.Tag).filter(models.Tag.user_id == user_id).all()

def get_or_create_tags_for_user(db: Session, tag_names: list[str], user_id: int) -> list[models.Tag]:
    tags = []
    for name in tag_names:
        clean_name = name.strip().lower()
        if not clean_name:
            continue
        tag = db.query(models.Tag).filter(
            models.Tag.name == clean_name,
            models.Tag.user_id == user_id
        ).first()
        if not tag:
            tag = models.Tag(name=clean_name, user_id=user_id)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        tags.append(tag)
    return tags


# --- Snippet CRUD ---

def get_snippet_by_id(db: Session, snippet_id: int, user_id: int) -> models.Snippet:
    return db.query(models.Snippet).filter(
        models.Snippet.id == snippet_id,
        models.Snippet.user_id == user_id
    ).first()

def get_public_snippet_by_slug(db: Session, slug: str) -> models.Snippet:
    return db.query(models.Snippet).filter(
        models.Snippet.slug == slug,
        models.Snippet.is_public == True
    ).first()

def get_snippets_for_user(
    db: Session,
    user_id: int,
    search: str = None,
    folder_id: int = None,
    tag_name: str = None
) -> list[models.Snippet]:
    query = db.query(models.Snippet).filter(models.Snippet.user_id == user_id)
    
    if folder_id is not None:
        query = query.filter(models.Snippet.folder_id == folder_id)
        
    if tag_name:
        query = query.join(models.Snippet.tags).filter(models.Tag.name == tag_name.strip().lower())
        
    if search:
        search_term = f"%{search}%"
        # Join tags to search by tag name as well
        query = query.join(models.Snippet.tags, isouter=True).filter(
            or_(
                models.Snippet.title.ilike(search_term),
                models.Snippet.content.ilike(search_term),
                models.Tag.name.ilike(search_term)
            )
        )
        
    return query.distinct().order_by(models.Snippet.created_at.desc()).all()

def create_snippet(db: Session, snippet: schemas.SnippetCreate, user: models.User) -> models.Snippet:
    # 1. Check Snippet Count Limit for Free Users
    if not user.is_pro:
        existing_count = db.query(models.Snippet).filter(models.Snippet.user_id == user.id).count()
        if existing_count >= 10:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free tier is limited to 10 snippets. Upgrade to Pro for unlimited snippets!"
            )
        
        # 2. Check Tag Limit for Free Users (Max 3 tags)
        if len(snippet.tags) > 3:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free tier is limited to 3 tags per snippet. Upgrade to Pro to add more!"
            )
            
        # 3. Check Public Link Limit for Free Users
        if snippet.is_public:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Public sharing is a Pro-tier feature. Upgrade to Pro to share snippets!"
            )
            
        # 4. Check Folder Limit for Free Users
        if snippet.folder_id is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Folders are a Pro-tier feature. Upgrade to Pro to organize snippets!"
            )

    # Resolve tags (get or create)
    db_tags = get_or_create_tags_for_user(db, snippet.tags, user.id)
    
    # Generate random 8-character URL-safe slug
    slug = secrets.token_urlsafe(6)
    
    db_snippet = models.Snippet(
        title=snippet.title,
        content=snippet.content,
        language=snippet.language,
        is_public=snippet.is_public,
        slug=slug,
        folder_id=snippet.folder_id,
        user_id=user.id,
        tags=db_tags
    )
    db.add(db_snippet)
    db.commit()
    db.refresh(db_snippet)
    return db_snippet

def update_snippet(
    db: Session,
    snippet_id: int,
    snippet_update: schemas.SnippetUpdate,
    user: models.User
) -> models.Snippet:
    db_snippet = get_snippet_by_id(db, snippet_id, user.id)
    if not db_snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found"
        )
        
    # Free tier checks on updates
    if not user.is_pro:
        if snippet_update.is_public:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Public sharing is a Pro-tier feature. Upgrade to Pro to share snippets!"
            )
        if snippet_update.folder_id is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Folders are a Pro-tier feature. Upgrade to Pro to organize snippets!"
            )
        if snippet_update.tags is not None and len(snippet_update.tags) > 3:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free tier is limited to 3 tags per snippet. Upgrade to Pro to add more!"
            )

    # Perform field updates
    for var, val in snippet_update.model_dump(exclude_unset=True).items():
        if var == "tags":
            db_tags = get_or_create_tags_for_user(db, val, user.id)
            db_snippet.tags = db_tags
        else:
            setattr(db_snippet, var, val)

    # Generate a slug if it doesn't have one and is being set to public
    if db_snippet.is_public and not db_snippet.slug:
        db_snippet.slug = secrets.token_urlsafe(6)

    db.commit()
    db.refresh(db_snippet)
    return db_snippet

def delete_snippet(db: Session, snippet_id: int, user_id: int) -> bool:
    db_snippet = db.query(models.Snippet).filter(
        models.Snippet.id == snippet_id,
        models.Snippet.user_id == user_id
    ).first()
    if not db_snippet:
        return False
    db.delete(db_snippet)
    db.commit()
    return True
