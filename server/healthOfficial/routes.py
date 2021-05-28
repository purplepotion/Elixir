import re
import json
from bson import ObjectId
from flask import request, jsonify, Blueprint
from server.utils import token_required
from server.models import Patient, HealthOfficial, Record, ConsultationRequest
from flask_cors import CORS

healthOfficial = Blueprint("healthOfficial", __name__)
# CORS(healthOfficial)


@healthOfficial.route("/api/healthOfficial/patients", methods=["GET", "POST"])
@token_required
def addPatient(_id):
    if request.method == "POST":
        email = request.json["email"]
        try:
            healthOfficial = HealthOfficial.objects(_id=ObjectId(_id)).first()
            patient = Patient.objects(email=email).first()

            healthOfficial.patients.append(patient._id)
            healthOfficial.save()

            return jsonify({"message": "Patient has been added."}), 201

        except:
            return jsonify({"message": "Invalid request"}), 400

    if request.method == "GET":
        healthOfficial = HealthOfficial.objects(_id=ObjectId(_id)).first()
        patientData = list()
        for oid in healthOfficial.patients:
            data_dict = dict()
            data_dict["id"] = str(oid)
            patient = Patient.objects(_id=oid).first()
            data_dict["name"] = patient.name
            data_dict["email"] = patient.email
            patientData.append(data_dict)

        return jsonify(patientData), 200


@healthOfficial.route("/api/healthOfficial/patients/<pid>", methods=["GET"])
@token_required
def getPatientRecords(_id, pid):
    patient = Patient.objects(_id=ObjectId(pid)).first()
    recordList = list()
    for record in patient.records:
        rdict = dict()
        rdict["id"] = str(record._id)
        rdict["name"] = record.name
        rdict["category"] = record.category
        rdict["doctor"] = record.doctor
        rdict["description"] = record.description
        rdict["attachments"] = record.attachments
        rdict["isApproved"] = False

        if ObjectId(_id) in record.healthOfficials:
            rdict["isApproved"] = True

        recordList.append(rdict)

    return (
        jsonify(
            {
                "id": str(patient._id),
                "name": patient.name,
                "email": patient.email,
                "records": recordList,
            }
        ),
        200,
    )


@healthOfficial.route(
    "/api/healthOfficial/patients/<pid>/records/<rid>", methods=["GET"]
)
@token_required
def getRecords(_id, pid, rid):
    patient = Patient.objects(_id=ObjectId(pid)).first()
    rdict = dict()
    for record in patient.records:
        if record._id == ObjectId(rid):
            rdict["id"] = str(record._id)
            rdict["name"] = record.name
            rdict["category"] = record.category
            rdict["doctor"] = record.doctor
            rdict["description"] = record.description
            rdict["attachments"] = record.attachments
            rdict["isApproved"] = False

            if ObjectId(_id) in record.healthOfficials:
                rdict["isApproved"] = True

            break

    return jsonify(rdict), 200


@healthOfficial.route("/api/healthOfficial/patients/<pid>/records", methods=["POST"])
@token_required
def addPatientRecord(_id, pid):
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
        patient = Patient.objects(_id=ObjectId(pid)).first()
        patient.records.append(record)

        patient.save()
        # record.save()

        return jsonify({"message": "Record added successfully."}), 200

    except:
        return jsonify({"message": "Unable to create the record."}), 400


@healthOfficial.route("/api/healthOfficial/consultations/get", methods=["GET"])
@token_required
def getRequests(_id):
    req_id = request.args.get("req_id", default=None, type=str)
    healthOfficial = HealthOfficial.objects(_id=ObjectId(_id)).first()
    consultationRequests = healthOfficial.consultationRequests
    # try:
    if req_id is None:  # response with all requests
        resp = []
        for crequest in consultationRequests:
            crequest = json.loads(crequest.to_json())
            resp.append(crequest)
        return jsonify(resp), 200

    else:  # response with given req_id
        for crequest in consultationRequests:
            if crequest._id == ObjectId(req_id):
                resp = json.loads(crequest.to_json())
                return jsonify(resp), 200

    # except:
    return jsonify({"message": "Unexpected error occurred."}), 500


@healthOfficial.route("/api/healthOfficial/consultations/delete", methods=["POST"])
@token_required
def deleteRequest(_id):
    data = request.json
    req_id = data["req_id"]
    p_id = data["p_id"]
    approved = data["approved"]
    healthOfficial = HealthOfficial.objects(_id=ObjectId(_id)).first()
    crequests = []
    for crequest in healthOfficial.consultationRequests:
        if crequest._id == ObjectId(req_id):
            pass
        else:
            crequests.append(crequest)

    healthOfficial.consultationRequests = crequests

    # create new patient notification
    # type = consultation
    if approved == "True":
        healthOfficial.patients.append(ObjectId(p_id))
        # approved = true

    healthOfficial.save()
    return jsonify({"message": "Request executed successfully."})
