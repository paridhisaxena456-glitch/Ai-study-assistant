// ========================================
// AI STUDY ASSISTANT - SCRIPT.JS
// ========================================


// ========================================
// SECTION NAVIGATION
// ========================================

function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");
    const buttons = document.querySelectorAll(".nav-btn");

    // Hide all sections
    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Remove active from navigation
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    // Add active to clicked navigation button
    buttons.forEach(button => {

        const onclickValue = button.getAttribute("onclick");

        if (onclickValue &&
            onclickValue.includes(`'${sectionId}'`)) {

            button.classList.add("active");
        }

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// DARK MODE
// ========================================

function toggleTheme() {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "studyAITheme",
        darkMode ? "dark" : "light"
    );
}


// Load saved theme

document.addEventListener("DOMContentLoaded", function () {

    const savedTheme =
        localStorage.getItem("studyAITheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

});


// ========================================
// LOAD USER
// ========================================

async function loadUser() {

    try {

        const response = await fetch("/api/user");

        const data = await response.json();

        if (data.logged_in) {

            const studentName =
                document.getElementById("studentName");

            if (studentName) {
                studentName.textContent = data.name;
            }
        }

    } catch (error) {

        console.log("User loading error:", error);

    }
}


// ========================================
// PROFILE
// ========================================

async function showProfile() {

    const profileBox =
        document.getElementById("profileBox");

    if (!profileBox) {
        return;
    }

    profileBox.style.display = "block";

    profileBox.innerHTML = `
        <h3>👤 Your Profile</h3>
        <p>Loading profile...</p>
    `;

    try {

        const response =
            await fetch("/api/user");

        const data =
            await response.json();

        if (!data.logged_in) {

            profileBox.innerHTML = `
                <p>Please login first.</p>
            `;

            return;
        }

        profileBox.innerHTML = `

            <h3>👤 Your Profile</h3>

            <p>
                <strong>Name:</strong>
                ${data.name}
            </p>

            <p>
                <strong>Email:</strong>
                ${data.email}
            </p>

        `;

    } catch (error) {

        profileBox.innerHTML = `
            <p>Unable to load profile.</p>
        `;

        console.log(error);
    }
}


// ========================================
// AI CHAT
// ========================================

async function sendMessage() {

    const input =
        document.getElementById("message");

    const chatBox =
        document.getElementById("chatBox");

    if (!input || !chatBox) {
        return;
    }

    const message =
        input.value.trim();

    if (message === "") {
        return;
    }


    // Add user message

    const userMessage =
        document.createElement("div");

    userMessage.className =
        "message user-message";

    userMessage.textContent =
        message;

    chatBox.appendChild(userMessage);


    // Clear input

    input.value = "";


    // Loading message

    const botMessage =
        document.createElement("div");

    botMessage.className =
        "message bot-message";

    botMessage.textContent =
        "🤔 Thinking...";

    chatBox.appendChild(botMessage);


    chatBox.scrollTop =
        chatBox.scrollHeight;


    try {

        const response =
            await fetch("/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: message
                })

            });


        const data =
            await response.json();


        if (data.response) {

            botMessage.textContent =
                data.response;

        } else {

            botMessage.textContent =
                data.error ||
                "Something went wrong.";

        }

    } catch (error) {

        botMessage.textContent =
            "❌ Server connection error.";

        console.log(error);
    }


    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// ========================================
// CHAT ENTER KEY
// ========================================

document.addEventListener("keydown", function (event) {

    const messageInput =
        document.getElementById("message");

    if (
        event.key === "Enter" &&
        document.activeElement === messageInput
    ) {

        event.preventDefault();

        sendMessage();
    }

});


// ========================================
// NOTES GENERATOR
// ========================================

async function generateNotes() {

    const input =
        document.getElementById("noteTopic");

    const result =
        document.getElementById("notesResult");

    if (!input || !result) {
        return;
    }

    const topic =
        input.value.trim();

    if (topic === "") {

        result.innerHTML =
            "⚠️ Please enter a topic.";

        return;
    }


    result.innerHTML =
        "📚 Generating notes...";


    try {

        const response =
            await fetch("/api/notes", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    topic: topic
                })

            });


        const data =
            await response.json();


        if (data.notes) {

            result.innerHTML = `
                <pre>${data.notes}</pre>
            `;

        } else {

            result.innerHTML =
                data.error ||
                "Unable to generate notes.";

        }

    } catch (error) {

        result.innerHTML =
            "❌ Server error.";

        console.log(error);
    }
}


// ========================================
// QUIZ GENERATOR
// ========================================

async function generateQuiz() {

    const input =
        document.getElementById("quizTopic");

    const result =
        document.getElementById("quizResult");

    if (!input || !result) {
        return;
    }

    const topic =
        input.value.trim();

    if (topic === "") {

        result.innerHTML =
            "⚠️ Please enter a topic.";

        return;
    }


    result.innerHTML =
        "📝 Generating quiz...";


    try {

        const response =
            await fetch("/api/quiz", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    topic: topic
                })

            });


        const data =
            await response.json();


        if (!data.questions) {

            result.innerHTML =
                data.error ||
                "Unable to generate quiz.";

            return;
        }


        let quizHTML = "";


        data.questions.forEach(
            function (question, index) {

                quizHTML += `

                    <div class="quiz-question">

                        <h3>
                            ${index + 1}.
                            ${question.question}
                        </h3>

                `;


                question.options.forEach(
                    function (option, optionIndex) {

                        quizHTML += `

                            <button
                                class="quiz-option"
                                onclick="checkAnswer(
                                    this,
                                    ${optionIndex},
                                    ${question.answer}
                                )">

                                ${option}

                            </button>

                        `;

                    }
                );


                quizHTML += `
                    </div>
                `;

            }
        );


        result.innerHTML =
            quizHTML;


    } catch (error) {

        result.innerHTML =
            "❌ Server error.";

        console.log(error);
    }
}


// ========================================
// CHECK QUIZ ANSWER
// ========================================

function checkAnswer(
    button,
    selectedAnswer,
    correctAnswer
) {

    const questionBox =
        button.closest(".quiz-question");

    if (!questionBox) {
        return;
    }


    const options =
        questionBox.querySelectorAll(
            ".quiz-option"
        );


    options.forEach(function (option) {

        option.disabled = true;

    });


    if (selectedAnswer === correctAnswer) {

        button.textContent =
            button.textContent + " ✅";

    } else {

        button.textContent =
            button.textContent + " ❌";

    }
}


// ========================================
// STUDY PLANNER
// ========================================

async function createPlanner() {

    const subjectInput =
        document.getElementById(
            "plannerSubject"
        );

    const daysInput =
        document.getElementById(
            "plannerDays"
        );

    const result =
        document.getElementById(
            "plannerResult"
        );


    if (
        !subjectInput ||
        !daysInput ||
        !result
    ) {
        return;
    }


    const subject =
        subjectInput.value.trim();

    const days =
        daysInput.value.trim();


    if (subject === "" || days === "") {

        result.innerHTML =
            "⚠️ Please enter subject and number of days.";

        return;
    }


    result.innerHTML =
        "📅 Creating study plan...";


    try {

        const response =
            await fetch("/api/planner", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    subject: subject,

                    days: days

                })

            });


        const data =
            await response.json();


        if (!data.plan) {

            result.innerHTML =
                data.error ||
                "Unable to create study plan.";

            return;
        }


        let plannerHTML = "";


        data.plan.forEach(function (day) {

            plannerHTML += `

                <div class="settings-item">

                    <div>

                        <strong>
                            📅 Day ${day.day}
                        </strong>

                        <p>
                            ${day.task}
                            <br>
                            ${day.activity}
                        </p>

                    </div>

                </div>

            `;

        });


        result.innerHTML =
            plannerHTML;


    } catch (error) {

        result.innerHTML =
            "❌ Server error.";

        console.log(error);
    }
}


// ========================================
// START APP
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUser();

    }
);