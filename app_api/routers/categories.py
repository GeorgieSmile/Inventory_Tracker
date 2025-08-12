from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import db_dependency 
from models import sqlalchemy_models, request_models, response_models

# Create an APIRouter instance
router = APIRouter()

@router.get("/categories/", response_model=List[response_models.Category], tags=["Categories"])
def get_all_categories(db: db_dependency):
    """
    Retrieve all categories.
    """
    categories = db.query(sqlalchemy_models.CategoryDB).all()
    return categories