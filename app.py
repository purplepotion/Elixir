import os
from server import create_app
from flask_cors import CORS

app = create_app()
CORS(app)

if __name__ == "__main__":
    # production
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))

    # Development
    # app.run(debug=True)