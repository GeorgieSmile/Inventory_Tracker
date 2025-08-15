from fastapi import FastAPI
from database import Base, engine
from routers import categories, products, stocks

app = FastAPI()

app.include_router(categories.router)
app.include_router(products.router)
app.include_router(stocks.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Inventory and Sales API"}


    