from fastapi import FastAPI
from database import engine

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Inventory and Sales API"}

