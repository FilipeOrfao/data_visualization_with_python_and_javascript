import sqlalchemy
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()


def connect_to_db():

    return sqlalchemy.create_engine(
        f"postgresql+psycopg2://{os.getenv('PG_USER')}:{os.getenv('PG_PASSWORD')}@{os.getenv('PG_HOST')}:{os.getenv('PG_PORT')}/{os.getenv('PG_DATABASE')}"
    )
