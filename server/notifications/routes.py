from bson import ObjectId
from flask import request, jsonify, Blueprint
from server.utils import token_required
from server.models import Patient, HealthOfficial, Record, Notifications
from flask_cors import CORS

notifications = Blueprint("notifications", __name__)
# CORS(notifications)


@notifications.route("/api/notifications", methods=["POST", "GET"])
@token_required
def getNotifications(_id):
    if request.method == "POST":
        pid = request.json["patientId"]
        rid = request.json["recordId"]

        try:
            notif = Notifications(healthOfficial=ObjectId(_id), record=ObjectId(rid))
            patient = Patient.objects(_id=ObjectId(pid)).first()
            patient.notifs.append(notif)
            patient.save()

            return jsonify({"message": "Notification sent."}), 201

        except:
            return jsonify({"message": "Failed to add notification"}), 400

    elif request.method == "GET":
        patient = Patient.objects(_id=ObjectId(_id)).first()
        recordlist = patient.records
        resp_notifList = list()

        for notif in patient.notifs:
            notif_obj = dict()
            notif_obj["id"] = str(notif._id)
            notif_obj["approved"] = notif.approved

            rid = notif.record
            record_obj = dict()
            record_obj["id"] = str(rid)

            for recs in recordlist:
                if recs._id == rid:
                    record_obj["name"] = recs.name
                    record_obj["category"] = recs.category

                    break

            notif_obj["record"] = record_obj
            healthOfficial_obj = dict()
            healthOfficial_obj["id"] = str(notif.healthOfficial)

            healthOfficial = HealthOfficial.objects(
                _id=ObjectId(notif.healthOfficial)
            ).first()
            healthOfficial_name = healthOfficial.name
            healthOfficial_obj["name"] = healthOfficial_name

            notif_obj["healthOfficial"] = healthOfficial_obj

            resp_notifList.append(notif_obj)

        return jsonify(resp_notifList), 200


@notifications.route("/api/notifications/<nid>", methods=["POST"])
@token_required
def approveNotifs(_id, nid):
    approved = request.json["isApproved"]
    patient = Patient.objects(_id=ObjectId(_id)).first()

    try:
        if approved:
            rid, hid = None, None
            for notif in patient.notifs:
                if notif._id == ObjectId(nid):
                    rid = notif.record
                    hid = notif.healthOfficial
                    break

            for record in patient.records:
                if record._id == rid:
                    record.healthOfficials.append(hid)
                    break
        else:
            pass

        patient.save()
        notifs = []
        for notif in patient.notifs:
            if notif._id != ObjectId(nid):
                notifs.append(notif)
        patient.notifs = notifs
        patient.save()

        return jsonify({"message": "Request has been processed."}), 201

    except:
        return jsonify({"message": "Unable to process the request."}), 400
