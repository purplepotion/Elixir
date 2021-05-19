from flask import Flask

# from flask_cors import CORS
from mongoengine import connect
from server.config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    connect("elixir", host=Config.MONGO_URI)

    from server.users.routes import users
    from server.healthOfficial.routes import healthOfficial
    from server.notifications.routes import notifications
    from server.records.routes import records

    app.register_blueprint(users)
    app.register_blueprint(healthOfficial)
    app.register_blueprint(notifications)
    app.register_blueprint(records)

    # CORS(app)

    return app
