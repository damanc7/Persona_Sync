from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class SectionEnum(str, Enum):
    identity = "identity"
    professional = "professional"
    preferences = "preferences"
    goals = "goals"
    context = "context"


class ProfileField(BaseModel):
    section: SectionEnum
    key: str
    value: str
    source: Optional[str] = "user"
    data_type: Optional[str] = "text"


class ProfileUpdateRequest(BaseModel):
    fields: List[ProfileField]


class HealthResponse(BaseModel):
    status: str
