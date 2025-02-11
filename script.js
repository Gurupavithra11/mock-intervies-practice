const questions = {
    genpact: [
        "Tell me about yourself.",
        "What do you know about Genpact?",
        "Describe a time you solved a problem at work.",
        "Why do you want to join Genpact?",
        "Where do you see yourself in 5 years?"
        "What do you know about Genpact?"
        "Why do you want to work for Genpact?"
        "What are your strengths and weaknesses?"
        "How do you handle pressure?"
        "What value do you bring to Genpact?"
        "What types of operating systems are you familiar with? Give examples as well?"
        "What are real-time Operating Systems?"
        "What are the types of real-time Operating Systems?"
        "What do you know about threads in Operating Systems?"
        "What do you understand by multithreading?"
        "Talk two minutes on any topic?"
    ],
    infosys: [
        "Introduce yourself.",
        "Why do you want to work at Infosys?",
        "Tell me about a technical challenge you faced.",
        "What are your strengths and weaknesses?",
        "How do you handle pressure in the workplace?"
    ]
};

let selectedCompany = "genpact";
let questionIndex = 0;
let mediaRecorder, audioChunks = [];
let answerTimeout;

const questionElement = document.getElementById("question");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const nextBtn = document.getElementById("nextBtn");

function startInterview() {
    selectedCompany = document.getElementById("company").value;
    document.getElementById("company-selection").style.display = "none";
    document.getElementById("interview-section").style.display = "block";
    questionIndex = 0;
    askQuestion();
}

function askQuestion() {
    if (questionIndex >= questions[selectedCompany].length) {
        alert("Interview finished!");
        return;
    }

    questionElement.innerText = questions[selectedCompany][questionIndex];

    // Use AI voice to read the question
    const speech = new SpeechSynthesisUtterance(questions[selectedCompany][questionIndex]);
    speech.lang = "en-US"; // Set language
    speech.rate = 1.0; // Speed of voice
    speech.pitch = 1.0; // Pitch level
    window.speechSynthesis.speak(speech);

    // If user doesn't respond in 10 seconds, move to next question
    answerTimeout = setTimeout(() => {
        console.log("No response, moving to next question...");
        nextQuestion();
    }, 10000);
}

function startRecording() {
    clearTimeout(answerTimeout);
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                console.log("Recorded audio:", audioBlob);
                audioChunks = [];
            };

            startBtn.disabled = true;
            stopBtn.disabled = false;
        });
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function nextQuestion() {
    questionIndex++;
    askQuestion();
}

// Event Listeners
startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
nextBtn.addEventListener("click", nextQuestion);
