import os


with open("000/index.html", "r") as file:
    html_boilerplate = file.read()
with open("000/style.css", "r") as file:
    css_boilerplate = file.read()
with open("000/static/libs/crossfilter.min.js", "r") as file:
    crossfilter_min_boilerplate = file.read()
with open("000/static/libs/d3-fetch.min.js", "r") as file:
    d3_fetch_min_boilerplate = file.read()
with open("000/static/libs/d3.min.js", "r") as file:
    d3_min_boilerplate = file.read()
with open("000/static/libs/topojson.min.js", "r") as file:
    topojson_min_boilerplate = file.read()


def make_folders(chapter):
    os.makedirs(f"{chapter:03}_", exist_ok=True)
    os.makedirs(f"{chapter:03}_/data", exist_ok=True)
    os.makedirs(f"{chapter:03}_/data/db", exist_ok=True)
    os.makedirs(f"{chapter:03}_/static", exist_ok=True)
    os.makedirs(f"{chapter:03}_/static/libs", exist_ok=True)


def make_files(chapter):
    with open(f"{chapter:03}_/index.html", "w") as f:
        f.write(html_boilerplate)
    with open(f"{chapter:03}_/style.css", "w") as f:
        f.write(css_boilerplate)
    with open(f"{chapter:03}_/script.js", "w") as f:
        f.write("")
    with open(f"{chapter:03}_/main.py", "w") as f:
        f.write("")
    with open(f"{chapter:03}_/main.ipynb", "w") as f:
        f.write("")
    with open(f"{chapter:03}_/static/libs/crossfilter.min.js", "w") as f:
        f.write(crossfilter_min_boilerplate)
    with open(f"{chapter:03}_/static/libs/d3-fetch.min.js", "w") as f:
        f.write(d3_fetch_min_boilerplate)
    with open(f"{chapter:03}_/static/libs/d3.min.js", "w") as f:
        f.write(d3_min_boilerplate)
    with open(f"{chapter:03}_/static/libs/topojson.min.js", "w") as f:
        f.write(topojson_min_boilerplate)


for i in range(1, 23):
    make_folders(i)
    make_files(i)
