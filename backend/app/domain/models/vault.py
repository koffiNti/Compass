import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.db import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class VaultItem(Base):
    __tablename__ = "vault_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    item_type = Column(String(30), nullable=False, default="article") # article, idea, lecture_note, bookmark, document
    content_markdown = Column(Text, nullable=True)
    source_url = Column(String(500), nullable=True)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", backref="vault_items")


class VaultEmbedding(Base):
    __tablename__ = "vault_embeddings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    vault_item_id = Column(String(36), ForeignKey("vault_items.id", ondelete="CASCADE"), nullable=False)
    chunk_index = Column(Integer, nullable=False, default=0)
    chunk_content = Column(Text, nullable=False)
    embedding_json = Column(JSON, nullable=True) # Vector stored as JSON float list for portable engine support
    created_at = Column(DateTime(timezone=True), default=utc_now)

    vault_item = relationship("VaultItem", backref="embeddings")
