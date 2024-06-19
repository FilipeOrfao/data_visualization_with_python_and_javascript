from pathlib import Path
from typing import Union
from fastapi import FastAPI, Response, Request
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI()


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
def winners_list(request: Request):
    # return {"these": "are the winners"}
    return template_obj.TemplateResponse(
        request=request,
        name="testj2.html",
        context={
            "heading": "A little winners list",
            "winners": [
                {"name": "Albert Einstein", "category": "Physics"},
                {"name": "V.S. Naipaul", "category": "Literature"},
                {"name": "Dorothy Hodgkin", "category": "Chemistry"},
            ],
        },
    )


# use this for the reload to work
# uvicorn server:app --reload
if __name__ == "__main__":
    uvicorn.run(app="__main__:app", host="localhost", port=8888, reload=True)
