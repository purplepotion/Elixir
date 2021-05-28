import os
import re
import datetime
from bson import ObjectId
from server.config import Config
from server.utils import token_required, allowed_file
from server.models import (
    ConsultationData,
    ConsultationRequest,
    Patient,
    HealthOfficial,
    PatientNotifications,
    Record,
)
from flask_cors import CORS
from flask import request, redirect, send_from_directory, abort, jsonify, Blueprint


records = Blueprint("records", __name__)
# CORS(files)


@records.route("/api/files/<filename>", methods=["GET"])
def serveFiles(filename):
    try:
        return send_from_directory(
            Config.UPLOAD_FOLDER, filename=filename, as_attachment=True
        )

    except FileNotFoundError:
        abort(404)


@records.route("/api/upload", methods=["POST"])
@token_required
def upload(_id):
    if request.method == "POST":
        if (
            "file" not in request.files
        ):  # name the input attribute to 'file' in the frontend script
            return redirect(request.url)

        file = request.files["file"]
        if file.filename == "":
            return redirect(request.url)
        if file and allowed_file(file.filename):
            ext = file.filename.rsplit(".", 1)[1].lower()
            filename = str(datetime.datetime.now().timestamp()) + "." + ext
            file.save(os.path.join(Config.UPLOAD_FOLDER, filename))

            return jsonify(filename), 200

    return jsonify({"message": "Invalid"}), 400


@records.route("/api/users/records", methods=["GET", "POST"])
@token_required
def addRecord(_id):
    if request.method == "GET":
        records = list()
        patient = Patient.objects(_id=ObjectId(_id)).first()
        for record in patient.records:
            record_dict = dict()
            record_dict["id"] = str(record._id)
            record_dict["name"] = record.name
            record_dict["category"] = record.category
            record_dict["doctor"] = record.doctor
            record_dict["description"] = record.description
            record_dict["attachments"] = record.attachments

            records.append(record_dict)

        return jsonify(records), 200

    elif request.method == "POST":
        data = request.json
        name = data["name"]
        category = data["category"]
        doctor = data["doctor"]
        description = data["description"]
        attachment = data["file"]
        try:
            record = Record(
                name=name,
                category=category,
                doctor=doctor,
                description=description,
                attachments=[attachment],
            )
            patient = Patient.objects(_id=ObjectId(_id)).first()
            patient.records.append(record)
            # print('Reached!!!')

            patient.save()
            # record.save()

            return jsonify({"message": "Record added successfully."}), 200

        except:
            return jsonify({"message": "Unable to create the record."}), 500


@records.route("/api/users/records/<rid>", methods=["GET", "PUT"])
@token_required
def getSingleRecord(_id, rid):
    if request.method == "GET":
        rdict = dict()
        patient = Patient.objects(_id=ObjectId(_id)).first()
        for record in patient.records:
            if record._id == ObjectId(rid):
                rdict["id"] = str(record._id)
                rdict["name"] = record.name
                rdict["category"] = record.category
                rdict["doctor"] = record.doctor
                rdict["description"] = record.description
                rdict["attachments"] = record.attachments
                rdict["healthOfficials"] = []

                for healthOfficial in record.healthOfficials:
                    healthOfficial_obj = HealthOfficial.objects(
                        _id=ObjectId(healthOfficial)
                    ).first()
                    temp = {}
                    temp["id"] = str(healthOfficial_obj._id)
                    temp["name"] = healthOfficial_obj.name
                    temp["email"] = healthOfficial_obj.email
                    rdict["healthOfficials"].append(temp)
                break

        return jsonify(rdict), 200

    if request.method == "PUT":
        try:
            data = request.json
            patient = Patient.objects(_id=ObjectId(_id)).first()
            healthOfficialId = data["healthOfficialId"]
            for record in patient.records:
                if record._id == ObjectId(rid):
                    record.healthOfficials.remove(ObjectId(healthOfficialId))
                    break
            patient.save()
            return jsonify({"message": "Health Official Removed!"}), 200
        except:
            # print(e)
            return jsonify({"error": "Some Error occurred!"}), 500


@records.route("/api/users/records/<rid>/add", methods=["PUT"])
@token_required
def addAttachment(_id, rid):
    data = request.json
    # print(data["patientId"])
    patientId = _id
    if data["patientId"] != 0:
        patientId = data["patientId"]
    patient = Patient.objects(_id=ObjectId(patientId)).first()
    attachment = data["attachment"]
    for record in patient.records:
        if record._id == ObjectId(rid):
            record.attachments.append(attachment)
            break
    patient.save()
    return jsonify({"message": "Attachement Added!"}), 200


@records.route("/api/users/search", methods=["GET"])
@token_required
def getHealthOfficials(_id):
    hid = request.args.get("hid", default=None, type=str)
    name = request.args.get("name", default=None, type=str)
    regex = re.compile(f".*{name}.*", re.IGNORECASE)

    try:
        if hid is None and name is None:
            healthOfficials = HealthOfficial.objects.scalar("name", "email").to_json()
            return healthOfficials, 200

        elif hid and name is None:
            healthOfficial = HealthOfficial.objects(_id=ObjectId(hid)).scalar(
                "name", "email"
            )
            healthOfficial = healthOfficial.to_json()
            return healthOfficial, 200

        elif name and hid is None:
            healthOfficial = HealthOfficial.objects(name=regex).scalar("name", "email")
            healthOfficial = healthOfficial.to_json()
            return healthOfficial, 200

        else:
            return jsonify({"message": "Bad Request"}), 400

    except:
        return jsonify({"message": "Unexpected error occurred."}), 500


@records.route("/api/users/consultations", methods=["POST"])
@token_required
def addConsultationRequest(_id):
    if request.method == "POST":
        try:
            data = request.json
            hid = data["hid"]
            age = data["age"]
            sex = data["sex"]
            symptoms = data["symptoms"]
            description = data["description"]

            consultationData = ConsultationData(
                age=age, sex=sex, symptoms=symptoms, description=description
            )
            consultationRequest = ConsultationRequest(
                patient=ObjectId(_id),
                patientName=Patient.objects.get(_id=ObjectId(_id)).name,
                healthOfficial=ObjectId(hid),
                consultationData=consultationData,
            )

            healthOfficial = HealthOfficial.objects(_id=ObjectId(hid)).first()
            healthOfficial.consultationRequests.append(consultationRequest)
            healthOfficial.save()

            return jsonify({"message": "Request sent successfully."}), 200

        except:
            return jsonify({"message": "Unexpected error occurred."}), 500

    else:
        return jsonify({"message": "Bad Request"}), 400