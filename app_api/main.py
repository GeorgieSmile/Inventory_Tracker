from fastapi import FastAPI
from database import engine
from routers import categories

app = FastAPI()

app.include_router(categories.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Inventory and Sales API"}

