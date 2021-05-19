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


class Notifications(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    approved = BooleanField(default=False)
    healthOfficial = ObjectIdField()
    record = ObjectIdField()

    meta = {"collection": "notifications"}


class Record(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(required=True)
    category = StringField(required=True)
    doctor = StringField(required=True)
    description = StringField(required=True)
    healthOfficials = ListField(ObjectIdField())
    attachments = ListField(StringField())
    meta = {"collection": "record"}


class Patient(Document):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(max_length=20, required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    healthOfficials = ListField(ObjectIdField())
    notifs = ListField(EmbeddedDocumentField(Notifications))
    records = ListField(EmbeddedDocumentField(Record))

    meta = {"collection": "patient"}


class HealthOfficial(Document):
    _id = ObjectIdField(default=ObjectId)
    name = StringField(max_length=20, required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    patients = ListField(ObjectIdField())
    # outgoingRequests = ListField(
    #     ReferenceField(Notifications, reverse_delete_rule=NULLIFY)
    # )

    records = StringField()

    meta = {"collection": "healthOfficial"}
