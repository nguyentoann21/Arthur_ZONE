import os
from flask import Flask, request, jsonify
import pyodbc
import bcrypt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Connect to the database
connect_string = os.getenv("DATABASE_URL")
connection = pyodbc.connect(connect_string)


class UserRepository:
    def find_by_username(self, cursor, username):
        cursor.execute(
            "SELECT username, password, role, fullname FROM Basic_User WHERE username=?",
            (username,),
        )
        return cursor.fetchone()

    def add_user(self, cursor, username, hashed_password, role, fullname):
        cursor.execute(
            "INSERT INTO Basic_User (username, password, role, fullname) VALUES (?, ?, ?, ?)",
            (username, hashed_password, role, fullname),
        )
        connection.commit()


def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(stored_password, provided_password):
    return bcrypt.checkpw(
        provided_password.encode("utf-8"), stored_password.encode("utf-8")
    )


@app.route("/register", methods=["POST"])
def register():
    username = request.form["username"]
    fullname = request.form["fullname"]
    password = request.form["password"]
    role = request.form["role"]
    cursor = connection.cursor()
    user_repo = UserRepository()

    if user_repo.find_by_username(cursor, username):
        return jsonify({"message": "Username already exist"}), 409

    hashed_password = hash_password(password)
    user_repo.add_user(cursor, username, hashed_password, role, fullname)
    return jsonify({"message": "Registration successful"}), 201


@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]
    cursor = connection.cursor()
    user_repo = UserRepository()

    user = user_repo.find_by_username(cursor, username)
    if user and verify_password(user.password, password):
        return jsonify(
            {
                "message": "Login successful",
                "fullname": user.fullname,
                "role": user.role,
            }
        )
    return jsonify({"message": "Invalid username or password"}), 401


if __name__ == "__main__":
    # Get port from .env, default port is 5000
    port = int(os.getenv("PORT", "5000"))
    app.run(debug=False, port=port)
