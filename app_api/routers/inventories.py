from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime
from database import db_dependency
from models import sqlalchemy_models, request_models, response_models

router = APIRouter(
    prefix="/inventory-movements",
    tags=["Inventory Movements"]
)

@router.get("/", response_model=List[response_models.InventoryMovement])
def get_all_inventory_movements(
    db: db_dependency,
    product_id: Optional[int] = Query(None, description="Filter by product ID"),
    movement_type: Optional[str] = Query(None, description="Filter by movement type (e.g., SALE, STOCK_IN)")
):
    """
    Retrieve all inventory movements, with optional filtering.
    """
    query = db.query(sqlalchemy_models.InventoryMovementDB)
    
    if product_id:
        query = query.filter(sqlalchemy_models.InventoryMovementDB.product_id == product_id)
        
    if movement_type:
        # Basic validation for movement_type
        allowed_types = {'OPENING', 'STOCK_IN', 'SALE'}
        if movement_type.upper() not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"ประเภท movement_type ไม่ถูกต้อง ค่าที่อนุญาตคือ: {', '.join(allowed_types)}"
            )
        query = query.filter(sqlalchemy_models.InventoryMovementDB.movement_type == movement_type.upper())
        
    movements = query.order_by(sqlalchemy_models.InventoryMovementDB.movement_date.desc()).all()
    
    if not movements:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลการเคลื่อนไหวสินค้าตามเงื่อนไขที่ระบุ"
        )
        
    return movements


@router.get("/{movement_id}", response_model=response_models.InventoryMovement)
def get_inventory_movement_by_id(movement_id: int, db: db_dependency):
    """
    Retrieve a single inventory movement by its ID.
    """
    movement = db.query(sqlalchemy_models.InventoryMovementDB).filter(
        sqlalchemy_models.InventoryMovementDB.movement_id == movement_id
    ).first()
    
    if movement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลการเคลื่อนไหวสินค้าที่ระบุ"
        )
        
    return movement


@router.patch("/{movement_id}", response_model=response_models.InventoryMovement)
def update_inventory_movement_type(movement_id: int, movement_update: request_models.InventoryMovementUpdate, db: db_dependency):
    """
    Update only the movement_type of an existing inventory movement.
    """
    # 1. Find the movement
    movement_db = db.query(sqlalchemy_models.InventoryMovementDB).filter(
        sqlalchemy_models.InventoryMovementDB.movement_id == movement_id
    ).first()
    
    if not movement_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ไม่พบข้อมูลการเคลื่อนไหวสินค้าที่มี ID {movement_id}"
        )
    
    # 2. Update only movement_type
    movement_db.movement_type = movement_update.movement_type.upper()
    db.commit()
    db.refresh(movement_db)
    
    return movement_db
