from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import List, Optional

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_pro: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# --- Folder Schemas ---
class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    pass

class FolderResponse(FolderBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Tag Schemas ---
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Snippet Schemas ---
class SnippetBase(BaseModel):
    title: str
    content: str
    language: str = "plaintext"
    is_public: bool = False
    folder_id: Optional[int] = None

class SnippetCreate(SnippetBase):
    tags: List[str] = Field(default_factory=list)

class SnippetUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    language: Optional[str] = None
    is_public: Optional[bool] = None
    folder_id: Optional[int] = None
    tags: Optional[List[str]] = None

class SnippetResponse(SnippetBase):
    id: int
    slug: Optional[str] = None
    user_id: int
    created_at: datetime
    tags: List[TagResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class PublicSnippetResponse(BaseModel):
    title: str
    content: str
    language: str
    slug: str
    created_at: datetime
    tags: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)