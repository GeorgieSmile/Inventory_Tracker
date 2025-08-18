from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from database import db_dependency
from models import sqlalchemy_models, response_models, request_models
from datetime import timedelta, datetime

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/product-stock", response_model=response_models.PaginatedResponse[response_models.ProductStock])
def get_product_stock_report(
    db: db_dependency,
    search_params: request_models.ProductStockSearchParams = Depends()
):
    """
    Retrieve the current product stock data from the v_product_stock view with search and pagination.
    """
    # Base query from the view
    query = db.query(sqlalchemy_models.ProductStockView)

    # Apply filters
    if search_params.productFilter == "r":
        query = query.filter(sqlalchemy_models.ProductStockView.needs_restock == 1)
    elif search_params.productFilter == "nr":
        query = query.filter(sqlalchemy_models.ProductStockView.needs_restock == 0)
    
    if search_params.search:
        # Search in product name (case-insensitive)
        search_filter = f"%{search_params.search}%"
        query = query.filter(
            sqlalchemy_models.ProductStockView.name.ilike(search_filter)
        )

    # Get total count before pagination
    total = query.count()
    
    if total == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลสต็อกสินค้า"
        )

    # Calculate pagination
    total_pages = (total + search_params.limit - 1) // search_params.limit
    
    # Apply pagination and ordering
    stock_data = query.order_by(sqlalchemy_models.ProductStockView.name)\
                     .offset((search_params.page - 1) * search_params.limit)\
                     .limit(search_params.limit)\
                     .all()

    return response_models.PaginatedResponse(
        items=stock_data,
        total=total,
        page=search_params.page,
        limit=search_params.limit,
        total_pages=total_pages,
        has_next=search_params.page < total_pages,
        has_prev=search_params.page > 1
    )


@router.get("/profitability", response_model=response_models.PaginatedResponse[response_models.ProfitabilityReport])
def get_profitability_report(
    db: db_dependency,
    search_params: request_models.ProfitabilityReportSearchParams = Depends()
):
    """
    Retrieve the profit and loss report for each sold product with search and pagination.
    """
    query = db.query(sqlalchemy_models.ProfitabilityReportView)

    # Apply date filters
    if search_params.start_date:
        try:
            start_date = datetime.strptime(search_params.start_date, "%Y-%m-%d").date()
            query = query.filter(sqlalchemy_models.ProfitabilityReportView.sale_datetime >= start_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="รูปแบบวันที่ไม่ถูกต้อง ใช้ YYYY-MM-DD")

    if search_params.end_date:
        try:        
            end_date = datetime.strptime(search_params.end_date, "%Y-%m-%d").date()
            # Add one day to include the entire end date
            end_date = datetime.combine(end_date, datetime.max.time())
            query = query.filter(sqlalchemy_models.ProfitabilityReportView.sale_datetime <= end_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="รูปแบบวันที่ไม่ถูกต้อง ใช้ YYYY-MM-DD")
    
    # Apply search filter
    if search_params.search:
        # Search in product name (case-insensitive)
        search_filter = f"%{search_params.search}%"
        query = query.filter(
            sqlalchemy_models.ProfitabilityReportView.product_name.ilike(search_filter)
        )
    
    # Apply product filter
    if search_params.product_id:
        query = query.filter(sqlalchemy_models.ProfitabilityReportView.product_id == search_params.product_id)

    # Get total count before pagination
    total = query.count()
    
    if total == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลกำไรขาดทุนตามเงื่อนไขที่ระบุ"
        )

    # Calculate pagination    
    total_pages = (total + search_params.limit - 1) // search_params.limit
    
    # Apply pagination and ordering (latest sales first)
    report_data = query.order_by(sqlalchemy_models.ProfitabilityReportView.sale_datetime.desc())\
                       .offset((search_params.page - 1) * search_params.limit)\
                       .limit(search_params.limit)\
                       .all()

    return response_models.PaginatedResponse(
        items=report_data,
        total=total,
        page=search_params.page,
        limit=search_params.limit,
        total_pages=total_pages,
        has_next=search_params.page < total_pages,
        has_prev=search_params.page > 1
    )