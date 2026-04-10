from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Activity(Base):
    __tablename__ = "activities"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    app_name = Column(String, index=True)
    window_title = Column(String)
    duration_seconds = Column(Integer, default=0)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Idea(Base):
    __tablename__ = "ideas"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String, index=True)
    content = Column(Text)
    tags = Column(String) # Comma separated
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    connections = relationship("IdeaConnection", back_populates="source_idea", foreign_keys="IdeaConnection.source_idea_id")

class IdeaConnection(Base):
    __tablename__ = "idea_connections"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    source_idea_id = Column(String, ForeignKey("ideas.id"))
    target_idea_id = Column(String, ForeignKey("ideas.id"))
    relation_type = Column(String)
    
    source_idea = relationship("Idea", foreign_keys=[source_idea_id], back_populates="connections")
    target_idea = relationship("Idea", foreign_keys=[target_idea_id])

class FileRecord(Base):
    __tablename__ = "file_records"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    filename = Column(String)
    filepath = Column(String, unique=True, index=True)
    category = Column(String)
    summary = Column(Text)
    scanned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Habit(Base):
    __tablename__ = "habits"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    pattern_name = Column(String)
    frequency = Column(Integer, default=1)
    last_detected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Decision(Base):
    __tablename__ = "decisions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String)
    context = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    factors = relationship("DecisionFactor", back_populates="decision")

class DecisionFactor(Base):
    __tablename__ = "decision_factors"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    decision_id = Column(String, ForeignKey("decisions.id"))
    name = Column(String)
    weight = Column(Float, default=1.0)
    is_pro = Column(Boolean, default=True)
    
    decision = relationship("Decision", back_populates="factors")
