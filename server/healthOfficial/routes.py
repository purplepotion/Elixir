from bson import ObjectId
from flask import request, jsonify, Blueprint
from server.utils import token_required
from server.models import Patient, HealthOfficial, Record, Notifications
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