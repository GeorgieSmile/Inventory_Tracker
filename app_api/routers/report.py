from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from database import db_dependency
from models import sqlalchemy_models, response_models
from datetime import date, timedelta

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/product-stock", response_model=List[response_models.ProductStock])
def get_product_stock_report(
    db: db_dependency,
    needs_restock_only: bool = Query(False, description="Filter only products that need restocking (needs_restock = true)")
):
    """
    Retrieve the current product stock data from the v_product_stock view.
    """
    # Base query from the view
    query = db.query(sqlalchemy_models.ProductStockView)

    if needs_restock_only:
        # Filter for products where needs_restock is True (1)
        query = query.filter(sqlalchemy_models.ProductStockView.needs_restock == 1)

    # Order results by product name
    stock_data = query.order_by(sqlalchemy_models.ProductStockView.name).all()

    if not stock_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลสต็อกสินค้า"
        )

    return stock_data

@router.get("/profitability", response_model=List[response_models.ProfitabilityReport])
def get_profitability_report(
    db: db_dependency,
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)")
):
    """
    Retrieve the profit and loss report for each sold product.
    """
    query = db.query(sqlalchemy_models.ProfitabilityReportView)

    # Filter by start date if provided
    if start_date:
        query = query.filter(sqlalchemy_models.ProfitabilityReportView.sale_datetime >= start_date)

    # Filter by end date if provided (inclusive until the end of the specified day)
    if end_date:
        query = query.filter(sqlalchemy_models.ProfitabilityReportView.sale_datetime < end_date + timedelta(days=1))

    # Order results by sale date (latest first)
    report_data = query.order_by(sqlalchemy_models.ProfitabilityReportView.sale_datetime.desc()).all()

    # Return 404 if no matching data found
    if not report_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลกำไรขาดทุนตามเงื่อนไขที่ระบุ"
        )

    return report_data