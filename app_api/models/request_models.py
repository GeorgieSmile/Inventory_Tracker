from pydantic import BaseModel
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

class StockInItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_cost: float

class StockInCreate(BaseModel):
    stock_in_date: Optional[datetime] = None
    ref_no: Optional[str] = None
    notes: Optional[str] = None
    items: List[StockInItemCreate]