import os
import jwt
import datetime
from bson import ObjectId

# from flask_cors import CORS
from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from server.utils import token_required
from server.models import Patient, HealthOfficial, Record, Notifications
from server.config import Config

users = Blueprint("users", __name__)
# CORS(users)


@users.route("/", methods=["GET"])
def index():
    response = jsonify("Connected to Elixir !")

    return response, 200


@users.route("/api/users", methods=["POST"])
def signup():
    data = request.json
    if (
        not data
        or not data["name"]
        or not data["email"]
        or not data["password"]
        or not data["userType"]
    ):
        return jsonify({"message": "Information entered in not complete"}), 400

    checkUser = None
    if data["userType"] == "patient":
        checkUser = Patient.objects(email=data["email"]).first()
    else:
        checkUser = HealthOfficial.objects(email=data["email"]).first()

    if checkUser:
        return jsonify({"message": "User already exists!"}), 400

    hashedpassword = generate_password_hash(data["password"])

    try:
        _id = None
        if data["userType"] == "patient":
            patient = Patient(
                name=data["name"], email=data["email"], password=hashedpassword
            )
            patient.save()
            _id = str(patient._id)

        else:
            healthOfficial = HealthOfficial(
                name=data["name"], email=data["email"], password=hashedpassword
            )
            healthOfficial.save()
            _id = str(healthOfficial._id)

        token = jwt.encode(
            {
                "id": _id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
            },
            Config.SECRET_KEY,
        )

        return jsonify(
            {
                "name": data["name"],
                "email": data["email"],
                "userType": data["userType"],
                "id": _id,
                "token": token.decode("utf-8"),
            }
        )

    except:
        return jsonify({"message": "Bad request"}), 400


@users.route("/api/users/login", methods=["POST"])
def login():
    try:
        data = request.json
        if (
            not data
            or not data["email"]
            or not data["password"]
            or not data["userType"]
        ):
            return jsonify({"message": "Incomplete login information"}), 400

        checkUser, token = None, None

        if data["userType"] == "patient":
            checkUser = Patient.objects(email=data["email"]).first()
        else:
            checkUser = HealthOfficial.objects(email=data["email"]).first()

        if checkUser:
            if check_password_hash(checkUser["password"], data["password"]):
                token = jwt.encode(
                    {
                        "id": str(checkUser._id),
                        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
                    },
                    Config.SECRET_KEY,
                )
            else:
                return jsonify({"message": "Invalid email or password"}), 404
        else:
            return (
                jsonify(
                    {
                        "message": "User doesn't exist! Please check your email address and password."
                    }
                ),
                404,
            )

        return jsonify(
            {
                "name": checkUser["name"],
                "email": checkUser["email"],
                "id": str(checkUser._id),
                "userType": data["userType"],
                "token": token.decode("utf-8"),
            }
        )
    except:
        return jsonify({"message": "Some Error Occured!"}), 500


@users.route("/api/users/profile", methods=["GET", "PUT"])
@token_required
def userProfile(_id):
    userData = Patient.objects(_id=ObjectId(_id)).first()
    if not userData:
        userData = HealthOfficial.objects(_id=ObjectId(_id)).first()

    if request.method == "GET":
        return jsonify({"name": userData["name"], "email": userData["email"]}), 200

    elif request.method == "PUT":
        userData = Patient.objects(_id=ObjectId(_id))
        if not userData:
            userData = HealthOfficial.objects(_id=ObjectId(_id))

        data = request.json
        try:
            userData.update(
                name=data["name"],
                email=data["email"],
                password=generate_password_hash(data["password"]),
            )

            return (
                jsonify({"message": "Credentials have been updated successfully."}),
                200,
            )

        except:
            return jsonify({"message": "Invalid update request."}), 400
