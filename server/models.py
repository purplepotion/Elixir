from bson.objectid import ObjectId
from mongoengine import Document, EmbeddedDocument, NULLIFY
from mongoengine import (
    DateTimeField,
    StringField,
    ReferenceField,
    ListField,
    IntField,
    EmailField,
    BooleanField,
    ObjectIdField,
    EmbeddedDocumentField,
)


class PatientNotifications(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    approved = BooleanField(default=False)
    healthOfficial = ObjectIdField()
    record = ObjectIdField()

    meta = {"collection": "patientNotifications"}


class Record(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(required=True)
    category = StringField(required=True)
    doctor = StringField(required=True)
    description = StringField(required=True)
    healthOfficials = ListField(ObjectIdField())
    attachments = ListField(StringField())
    meta = {"collection": "record"}


class ConsultationData(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    age = IntField(required=True)
    sex = StringField(required=True)
    symptoms = ListField(StringField(), required=True)
    description = StringField()

    meta = {"collection": "consultationData"}


class ConsultationRequest(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    patient = ObjectIdField()
    healthOfficial = ObjectIdField()
    consultationData = EmbeddedDocumentField(ConsultationData)
    approved = BooleanField(default=False)

    meta = {"collection": "consultationRequest"}


class Patient(Document):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(max_length=20, required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    healthOfficials = ListField(ObjectIdField())
    notifs = ListField(EmbeddedDocumentField(PatientNotifications))
    records = ListField(EmbeddedDocumentField(Record))

    meta = {"collection": "patient"}


class HealthOfficial(Document):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(max_length=20, required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    patients = ListField(ObjectIdField())
    consultationRequests = ListField(EmbeddedDocumentField(ConsultationRequest))
    records = StringField()

    meta = {"collection": "healthOfficial"}
