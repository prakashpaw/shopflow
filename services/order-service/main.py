from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app
import requests
import os
from routes.orders import router as order_router

app = FastAPI()

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

app.include_router(order_router, prefix="/orders")

@app.get("/health")
def health_check():
    return {"status": "OK"}
