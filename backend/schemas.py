from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ActivityBase(BaseModel):
    app_name: str
    window_title: str
    duration_seconds: int

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True
        
class IdeaBase(BaseModel):
    title: str
    content: str
    tags: Optional[str] = ""

class IdeaCreate(IdeaBase):
    pass

class IdeaResponse(IdeaBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
