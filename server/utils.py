import jwt
from flask import request, jsonify
from functools import wraps
from server.config import Config


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"]

        if not token:
            return jsonify({"message": "Access to requested resource is denied."}), 403

        try:
            data = jwt.decode(token, Config.SECRET_KEY)
            _id = data["id"]
        except:
            return jsonify({"message": "Access to requested resource is denied"}), 403

        return f(_id, *args, **kwargs)

    return decorated


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS
    )
