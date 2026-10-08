function askAI() {

    let question = document.getElementById("question").value;

    let answer = document.getElementById("answer");

    if (question.trim() === "") {

        answer.innerHTML = "Please enter a study question.";

    } else {

        answer.innerHTML =
            "🤖 AI Assistant: I received your question.<br><br>" +
            "Your question is: <b>" + question + "</b><br><br>" +
            "This is a demo AI Study Assistant. You can connect a real AI API later.";
    }
}