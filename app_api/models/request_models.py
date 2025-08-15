from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CategoryCreate(BaseModel):
    name: str

class ProductCreate(BaseModel):
    name: str
    category_id: Optional[int] = None
    sku: Optional[str] = None
    price: float
    reorder_level: int = 10

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=150)
    category_id: Optional[int] = None
    sku: Optional[str] = Field(None, max_length=64)
    price: Optional[float] = Field(None, gt=0)
    reorder_level: Optional[int] = None

class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    discount: float = 0

class SaleCreate(BaseModel):
    sale_datetime: Optional[datetime] = None
    payment_method: str  # 'Cash', 'Card', or 'QR'
    notes: Optional[str] = None
    items: List[SaleItemCreate]

class SaleUpdate(BaseModel):
    sale_datetime: Optional[datetime] = None
    payment_method: Optional[str] = Field(None, regex="^(Cash|Card|QR)$")
    notes: Optional[str] = Field(None, max_length=255)

class SaleItemUpdate(BaseModel):
    product_id: Optional[int] = None
    quantity: Optional[int] = Field(None, gt=0)
    unit_price: Optional[float] = Field(None, gt=0)
    discount: Optional[float] = Field(None, ge=0)

class StockInItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_cost: float

class StockInCreate(BaseModel):
    stock_in_date: Optional[datetime] = None
    ref_no: Optional[str] = None
    notes: Optional[str] = None
    items: List[StockInItemCreate]

class StockInUpdate(BaseModel):
    ref_no: Optional[str] = Field(None, max_length=80)
    stock_in_date: Optional[datetime] = None
    notes: Optional[str] = Field(None, max_length=255)

class StockInItemUpdate(BaseModel):
    product_id: Optional[int] = None
    quantity: Optional[int] = Field(None, gt=0)
    unit_cost: Optional[float] = Field(None, gt=0)