from flask import Flask, render_template, request, redirect, session, jsonify

app = Flask(__name__)
app.secret_key = "studyai-secret-key"

# Temporary users
users = {}


# =========================
# HOME
# =========================

@app.route("/")
def home():
    if "user" not in session:
        return redirect("/login")

    return render_template("index.html")


# =========================
# LOGIN
# =========================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        if not email or not password:
            return "Please enter email and password."

        if email not in users:
            return "Account not found. Please signup first."

        if users[email]["password"] != password:
            return "Incorrect password."

        session["user"] = email
        session["name"] = users[email]["name"]

        return redirect("/")

    return render_template("login.html")


# =========================
# SIGNUP
# =========================

@app.route("/signup", methods=["GET", "POST"])
def signup():

    if request.method == "POST":

        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        if not name or not email or not password:
            return "Please fill all fields."

        if email in users:
            return "Account already exists. Please login."

        users[email] = {
            "name": name,
            "password": password
        }

        session["user"] = email
        session["name"] = name

        return redirect("/")

    return render_template("signup.html")


# =========================
# LOGOUT
# =========================

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/login")


# =========================
# USER INFO
# =========================

@app.route("/api/user")
def user_info():

    if "user" not in session:
        return jsonify({"logged_in": False})

    return jsonify({
        "logged_in": True,
        "name": session.get("name"),
        "email": session.get("user")
    })


# =========================
# AI CHAT
# =========================

@app.route("/api/chat", methods=["POST"])
def chat():

    if "user" not in session:
        return jsonify({"error": "Please login first."}), 401

    data = request.get_json() or {}
    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "error": "Please enter a question."
        }), 400

    response = (
        f"🤖 I received your question: {message}\n\n"
        "This is your StudyAI demo response."
    )

    return jsonify({
        "response": response
    })


# =========================
# NOTES
# =========================

@app.route("/api/notes", methods=["POST"])
def notes():

    if "user" not in session:
        return jsonify({"error": "Please login first."}), 401

    data = request.get_json() or {}
    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({
            "error": "Please enter a topic."
        }), 400

    notes = f"""
📚 STUDY NOTES

Topic: {topic}

1. Introduction
{topic} is an important topic. Start by understanding
its definition, purpose and basic concepts.

2. Key Points

• Understand the basic concept of {topic}.
• Learn important terms.
• Study practical examples.
• Practice questions.
• Revise regularly.

3. Quick Revision

✓ Definition
✓ Main concepts
✓ Examples
✓ Practice
✓ Revision
"""

    return jsonify({
        "notes": notes
    })


# =========================
# QUIZ
# =========================

@app.route("/api/quiz", methods=["POST"])
def quiz():

    if "user" not in session:
        return jsonify({"error": "Please login first."}), 401

    data = request.get_json() or {}
    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({
            "error": "Please enter a topic."
        }), 400

    questions = [

        {
            "question": f"What is important when learning {topic}?",
            "options": [
                "Understanding concepts",
                "Ignoring concepts",
                "Never practicing",
                "Skipping revision"
            ],
            "answer": 0
        },

        {
            "question": f"What helps you understand {topic}?",
            "options": [
                "Practice and examples",
                "Only guessing",
                "Avoiding questions",
                "Skipping study"
            ],
            "answer": 0
        },

        {
            "question": f"What is useful when revising {topic}?",
            "options": [
                "Regular revision",
                "Ignoring notes",
                "Never practicing",
                "Skipping topics"
            ],
            "answer": 0
        }
    ]

    return jsonify({
        "topic": topic,
        "questions": questions
    })


# =========================
# STUDY PLANNER
# =========================

@app.route("/api/planner", methods=["POST"])
def planner():

    if "user" not in session:
        return jsonify({"error": "Please login first."}), 401

    data = request.get_json() or {}

    subject = data.get("subject", "").strip()
    days = data.get("days", "").strip()

    if not subject or not days:
        return jsonify({
            "error": "Please enter subject and number of days."
        }), 400

    try:
        days = int(days)
    except ValueError:
        return jsonify({
            "error": "Days must be a number."
        }), 400

    if days < 1 or days > 30:
        return jsonify({
            "error": "Days must be between 1 and 30."
        }), 400

    plan = []

    for day in range(1, days + 1):
        plan.append({
            "day": day,
            "task": f"Study {subject}",
            "activity": "Learn → Practice → Revision"
        })

    return jsonify({
        "subject": subject,
        "days": days,
        "plan": plan
    })


# =========================
# PROGRESS
# =========================

@app.route("/api/progress")
def progress():

    if "user" not in session:
        return jsonify({
            "error": "Please login first."
        }), 401

    return jsonify({
        "python": 80,
        "web_development": 70,
        "artificial_intelligence": 55,
        "mathematics": 65,
        "overall": 72
    })


# =========================
# RUN
# =========================

if __name__ == "__main__":
    app.run(debug=True)