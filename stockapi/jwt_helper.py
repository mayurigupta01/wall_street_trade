from os import error
import jwt
from stockapi.config import Config


def encode_jwt_token(db_object):
    payload = {
        "email": db_object.email,
        "fn": db_object.fn,
        "ln": db_object.ln,
        "project": Config.PROJECT_NAME
    }
    encoded_jwt = jwt.encode({"some": payload}, "secret", algorithm="HS256")
    return encoded_jwt


def decode_jwt_token(token):
    try:
        decoded_token = jwt.decode(token, "secret", algorithms="HS256")
        payload = decoded_token["some"]
        return payload
    except error as e:
        print(e)
        return None
