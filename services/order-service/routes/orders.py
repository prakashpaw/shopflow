from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional
import requests
import os

router = APIRouter()
AUTH_URL = os.getenv("AUTH_URL", "http://localhost:4001")

class OrderItem(BaseModel):
    product_id: int
    quantity: int

class Order(BaseModel):
    items: List[OrderItem]

orders_db = []

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization token")
    # For a real system we would validate the token with auth service
    # Just an example implementation here
    return authorization.split(" ")[1]

@router.post("/")
def create_order(order: Order, token: str = Depends(verify_token)):
    new_order = {
        "id": len(orders_db) + 1,
        "items": [item.dict() for item in order.items],
        "status": "pending"
    }
    orders_db.append(new_order)
    return new_order

@router.get("/")
def get_orders(token: str = Depends(verify_token)):
    return orders_db
