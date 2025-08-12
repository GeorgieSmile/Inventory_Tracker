from fastapi import APIRouter, HTTPException, status
from typing import List
from database import db_dependency
from models import sqlalchemy_models, request_models, response_models

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.post("/", response_model=response_models.Product, status_code=status.HTTP_201_CREATED)
def create_product(product: request_models.ProductCreate, db: db_dependency):
    """
    Create a new product.
    """
    # Check if SKU already exists
    if product.sku:
        existing_product = db.query(sqlalchemy_models.ProductDB).filter(sqlalchemy_models.ProductDB.sku == product.sku).first()
        if existing_product:
            raise HTTPException(status_code=400, detail=f"มีสินค้าที่มี SKU '{product.sku}' นี้อยู่แล้ว")

    new_product = sqlalchemy_models.ProductDB(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/", response_model=List[response_models.Product])
def get_all_products(db: db_dependency):
    """
    Retrieve all products, sorted by ID.
    """
    products = db.query(sqlalchemy_models.ProductDB).order_by(sqlalchemy_models.ProductDB.product_id).all()
    if not products:
        raise HTTPException(status_code=404, detail="ไม่พบสินค้า")
    return products

@router.get("/{product_id}", response_model=response_models.Product)
def get_product_by_id(product_id: int, db: db_dependency):
    """
    Retrieve a single product by its ID.
    """
    db_product = db.query(sqlalchemy_models.ProductDB).filter(sqlalchemy_models.ProductDB.product_id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="ไม่พบสินค้าที่ต้องการ")
    return db_product

@router.patch("/{product_id}", response_model=response_models.Product)
def update_product(product_id: int, product_update: request_models.ProductUpdate, db: db_dependency):
    """
    Update a product's details partially.
    """
    db_product = db.query(sqlalchemy_models.ProductDB).filter(sqlalchemy_models.ProductDB.product_id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="ไม่พบสินค้าที่ต้องการ Update")

    # If category_id is provided, check if it exists
    if product_update.category_id is not None:
        category = db.query(sqlalchemy_models.CategoryDB).filter(sqlalchemy_models.CategoryDB.category_id == product_update.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail=f"ไม่พบหมวดหมู่ ID: {product_update.category_id}")

    # If SKU is provided, check for conflict
    if product_update.sku:
        existing_sku = db.query(sqlalchemy_models.ProductDB).filter(
            sqlalchemy_models.ProductDB.sku == product_update.sku,
            sqlalchemy_models.ProductDB.product_id != product_id
        ).first()
        if existing_sku:
            raise HTTPException(status_code=400, detail=f"มีสินค้าอื่นใช้ SKU '{product_update.sku}' นี้แล้ว")

    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(product_id: int, db: db_dependency):
    """
    Delete a product by its ID.
    """
    db_product = db.query(sqlalchemy_models.ProductDB).filter(sqlalchemy_models.ProductDB.product_id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="ไม่พบสินค้าที่ต้องการลบ")

    db.delete(db_product)
    db.commit()

    return {"detail": f"{db_product.name} ถูกลบเรียบร้อยแล้ว"}

