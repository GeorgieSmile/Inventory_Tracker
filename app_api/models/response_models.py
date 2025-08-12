from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Category(BaseModel):
    category_id: int         
    name: str                 
    
    class Config:
        from_attributes = True

class Product(BaseModel):
    product_id: int                    
    name: str                          
    category: Optional[Category] = None  # Can be NULL in database
    sku: Optional[str] = None          # Can be NULL in database
    price: float                       
    reorder_level: int                 
    
    class Config:
        from_attributes = True

class SaleItem(BaseModel):
    sale_item_id: int         
    sale_id: int              
    product_id: int           
    quantity: int             
    unit_price: float         
    discount: float           
    
    class Config:
        from_attributes = True

class Sale(BaseModel):
    sale_id: int                      
    sale_datetime: datetime           
    total_amount: float               
    payment_method: str               
    notes: Optional[str] = None       # Can be NULL in database
    items: List[SaleItem] = []        
    
    class Config:
        from_attributes = True

class StockInItem(BaseModel):
    stock_in_item_id: int     
    stock_in_id: int          
    product_id: int          
    quantity: int             
    unit_cost: float          
    
    class Config:
        from_attributes = True

class StockIn(BaseModel):
    stock_in_id: int                  
    ref_no: Optional[str] = None      # Can be NULL in database
    stock_in_date: datetime           
    total_cost: float                 
    notes: Optional[str] = None       # Can be NULL in database
    items: List[StockInItem] = []     
    
    class Config:
        from_attributes = True

class InventoryMovement(BaseModel):
    movement_id: int                         
    product_id: int                          
    movement_type: str                       
    quantity: int                            
    unit_cost: Optional[float] = None        # Can be NULL (for sales)
    sale_item_id: Optional[int] = None       # Can be NULL
    stock_in_item_id: Optional[int] = None   # Can be NULL
    movement_date: datetime                  
    
    class Config:
        from_attributes = True

class ProductStock(BaseModel):
    product_id: int           
    name: str                 
    price: float              
    reorder_level: int        
    stock_on_hand: int        
    needs_restock: int        
    
    class Config:
        from_attributes = True