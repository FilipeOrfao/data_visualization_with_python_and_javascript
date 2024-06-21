from pathlib import Path
from typing import Union, Optional
from fastapi import FastAPI, Response, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import pandas as pd
from sqlalchemy import text

from connection import connect_to_db

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/js", StaticFiles(directory="."), name="js")
app.mount("/data", StaticFiles(directory="data"), name="data")

template_obj = Jinja2Templates(directory="static")


@app.get("/")
def get_helthcheck():
    return {"message": "all ok"}


@app.get("/hi")
def greet():
    return {"thing": "Hello? World?"}


@app.get("/hi/{who}")
def greet(who):
    return f"Hello {who}!!!"


@app.get("/winners")
async def winners_list(request: Request):
    return template_obj.TemplateResponse(
        name="testj2.html",
        context={
            "request": request,
            "heading": "A little winners list",
            "winners": [
                {"name": "Albert Einstein", "category": "Physics"},
                {"name": "V.S. Naipaul", "category": "Literature"},
                {"name": "Dorothy Hodgkin", "category": "Chemistry"},
            ],
        },
    )


@app.get("/api/winners")
def get_country_data(
    category: Optional[str] = None,
    country: Optional[str] = None,
    year: Optional[int] = None,
    gender: Optional[str] = None,
):

    engine = connect_to_db()
    query = "SELECT * FROM winners WHERE 1=1"
    params = {}

    if category:
        query += " AND category = :category"
        params["category"] = category.capitalize()

    if gender:
        query += " AND category = :category"
        params["category"] = category

    if country:
        query += " AND country = :country"
        params["country"] = country.capitalize()

    if year:
        query += " AND year = :year"
        params["year"] = year

    with engine.connect() as conn:
        winners = pd.read_sql_query(text(query), conn, params=params)
    print(winners)
    return winners.to_dict(orient="records")


# use this for the reload to work
# uvicorn server:app --reload
if __name__ == "__main__":
    uvicorn.run(app="__main__:app", host="localhost", port=8888, reload=True)
