// Variables to track quiz state and user information
let currentQuestion = 0; // Index of the current question being displayed
let score = 0; // User's score in the quiz
const quizContainer = document.getElementById('quiz'); // Container for quiz questions
const resultContainer = document.getElementById('result'); // Container for quiz results

// Variables to store quiz timing and user information
let quizStartTime; // Timestamp when the quiz starts
let quizEndTime; // Timestamp when the quiz ends
let timerInterval; // Interval for updating timer display
let currentUsername; // User's username
let currentRollNumber; // User's roll number

// Function to start the quiz
function startQuiz() {
    // Retrieve input fields for username and roll number
    const usernameInput = document.getElementById('username');
    const rollNumberInput = document.getElementById('rollNumber');

    // Error handling if input fields are not found
    if (!usernameInput || !rollNumberInput) {
        console.error('Username or Roll Number input not found.');
        return;
    }

    // Retrieve values of username and roll number from input fields
    const username = usernameInput.value;
    const rollNumber = rollNumberInput.value;

    // Check if both username and roll number are provided
    if (username.trim() === '' || rollNumber.trim() === '') {
        return;
    }

    // Store the username and roll number in localStorage and variables
    localStorage.setItem('username', username);
    localStorage.setItem('rollNumber', rollNumber);
    currentUsername = username;
    currentRollNumber = rollNumber;

    // Check if the quiz is already in progress
    if (!checkQuizState()) {
        // If not, shuffle questions and options
        shuffleQuestions();

        // Record start time of the quiz
        quizStartTime = new Date();
        currentQuestion++;
        showQuestion();
    }
}

// Function to check if the quiz state is loaded from localStorage
function checkQuizState() {
    // Retrieve quiz state and user information from localStorage
    const storedQuestion = localStorage.getItem('currentQuestion');
    const storedScore = localStorage.getItem('score');
    const storedTimeTaken = localStorage.getItem('timeTaken');
    const storedUsername = localStorage.getItem('username');
    const storedRollNumber = localStorage.getItem('rollNumber');

    // Check if necessary data is available in localStorage
    if (
        storedQuestion !== null &&
        storedScore !== null &&
        storedTimeTaken !== null &&
        storedUsername !== null &&
        storedRollNumber !== null &&
        storedUsername !== 'N/A' &&
        storedRollNumber !== 'N/A'
    ) {
        // Parse stored data and update variables
        currentQuestion = parseInt(storedQuestion, 10);
        score = parseInt(storedScore, 10);
        const timeTakenInSeconds = parseFloat(storedTimeTaken);
        quizStartTime = new Date(Date.now() - timeTakenInSeconds * 1000);

        // Update input fields with stored username and roll number
        const usernameInput = document.getElementById('username');
        const rollNumberInput = document.getElementById('rollNumber');
        if (usernameInput && rollNumberInput) {
            usernameInput.value = storedUsername;
            rollNumberInput.value = storedRollNumber;
        }

        // Display the current question
        showQuestion();
        return true; // Indicate that quiz state is loaded successfully
    } else {
        // Show start page if quiz state is not loaded
        showStartPage();
        return false; // Indicate that quiz state is not loaded
    }
}

// Function to display the start page of the quiz
function showStartPage() {
    // Retrieve stored username and roll number from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedRollNumber = localStorage.getItem('rollNumber');

    // Retrieve input fields for username and roll number
    const usernameInput = document.getElementById('username');
    const rollNumberInput = document.getElementById('rollNumber');

    // Error handling if input fields are not found
    if (!usernameInput || !rollNumberInput) {
        console.error('Username or Roll Number input not found.');
        return;
    }

    // Populate input fields with stored values, if available
    if (storedUsername && storedRollNumber && storedUsername !== 'N/A' && storedRollNumber !== 'N/A') {
        usernameInput.value = storedUsername;
        rollNumberInput.value = storedRollNumber;
    }

    // Display input fields for username and roll number
    quizContainer.innerHTML = `
        <form id="startForm">
            <label for="username">Username:</label>
            <input type="text" id="username" value="${storedUsername || ''}" required />
            <label for="rollNumber">Roll Number:</label>
            <input type="text" id="rollNumber" value="${storedRollNumber || ''}" required />
            <button type="button" onclick="startQuiz()">Start Quiz</button>
        </form>
    `;

    checkLocalStorage(); // Check and log localStorage data
}

// Function to display the current question
function showQuestion() {
    // Create or retrieve the element to display timer
    let timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) {
        timeDisplay = document.createElement('div');
        timeDisplay.id = 'timeDisplay';
        quizContainer.appendChild(timeDisplay);
    }

    // Error handling for invalid question index or data
    if (!questions || currentQuestion < 1 || currentQuestion > questions.length) {
        console.error('Questions not loaded or invalid current question index.');
        return;
    }

    // Retrieve data for the current question
    const questionData = questions[currentQuestion - 1];

    // Error handling if question data is not found
    if (!questionData) {
        console.error('Question data not found for current question index.');
        return;
    }

    // Display the current question and options
    quizContainer.innerHTML = `
        <div id="timeDisplay"></div>
        <h2>Question ${currentQuestion}: ${questionData.question}</h2>
        <div class="options">
            ${questionData.options.map((option, index) => `
                <label>
                    <input type="radio" name="answer" value="${option}" />
                    ${option}
                </label>
            `).join('')}
        </div>
        <button onclick="handleAnswer()">Next</button>
    `;

    // Update timer display
    updateTimerDisplay();
}

// Function to save quiz state in localStorage
function saveQuizState() {
    // Save current question index and score
    localStorage.setItem('currentQuestion', currentQuestion.toString());
    localStorage.setItem('score', score.toString());

    // Retrieve input fields for username and roll number
    const usernameInput = document.getElementById('username');
    const rollNumberInput = document.getElementById('rollNumber');

    // Retrieve and sanitize username and roll number
    const username = usernameInput ? usernameInput.value.trim() || 'N/A' : 'N/A';
    const rollNumber = rollNumberInput ? rollNumberInput.value.trim() || 'N/A' : 'N/A';

    // Save username and roll number in localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('rollNumber', rollNumber);

    // Calculate and save time taken for the quiz
    const currentTime = new Date();
    const timeTakenInSeconds = (currentTime - quizStartTime) / 1000;
    localStorage.setItem('timeTaken', timeTakenInSeconds.toString());
}

// Function to shuffle questions and options
function shuffleQuestions() {
    questions = shuffleArray(questions);

    questions.forEach(question => {
        question.options = shuffleArray(question.options);
    });
}

// Function to update timer display
function updateTimerDisplay() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        const currentTime = new Date();
        const timeTakenInSeconds = (currentTime - quizStartTime) / 1000;
        const minutes = Math.floor(timeTakenInSeconds / 60);
        const seconds = Math.floor(timeTakenInSeconds % 60);
        const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;

        timeDisplay.innerText = formattedTime;
    }
}

// Function to handle user's answer submission
function handleAnswer() {
    // Retrieve selected option and next button
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const nextButton = document.querySelector('button');

    // Error handling if no option is selected or button is disabled
    if (selectedOption && !nextButton.disabled) {
        nextButton.disabled = true;

        // Retrieve user's answer and correct answer for the current question
        const userAnswer = selectedOption.value;
        const currentQuestionData = questions[currentQuestion - 1];

        // Error handling for missing question data
        if (currentQuestionData) {
            const correctAnswer = currentQuestionData.correctAnswer;

            // Check if the answer is correct, update score, and provide feedback
            if (userAnswer === correctAnswer) {
                score++;
                selectedOption.parentNode.style.color = 'green';
            } else {
                selectedOption.parentNode.style.color = 'red';
            }

            // Display feedback and proceed to the next question
            displayAnswerFeedback(userAnswer, correctAnswer);
            currentQuestion++;

            // Save quiz state
            saveQuizState();

            // Check if there are more questions or if the quiz is completed
            if (currentQuestion <= questions.length) {
                // Proceed to the next question after a delay
                setTimeout(() => {
                    selectedOption.parentNode.style.color = '';
                    showQuestion();
                    nextButton.disabled = false;
                }, 3000);
            } else {
                // End the quiz and display results after a delay
                quizEndTime = new Date();
                setTimeout(() => {
                    selectedOption.parentNode.style.color = '';
                    showResult();
                }, 3000);
            }
        } else {
            console.error('Question data not found for current question index.');
        }
    }
}

// Function to display answer feedback
function displayAnswerFeedback(userAnswer, correctAnswer) {
    const questionData = questions[currentQuestion - 1];
    const isCorrect = userAnswer === correctAnswer;

    // Display correctness and explanation of the answer
    quizContainer.innerHTML += `
        <p>${isCorrect ? 'Correct!' : 'Wrong!'}</p>
        <p>Explanation: ${questionData.explanation}</p>
    `;
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to display quiz results
function showResult() {
    // Calculate percentage score
    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;

    // Retrieve username and roll number
    const usernameInput = document.getElementById('username');
    const rollNumberInput = document.getElementById('rollNumber');
    const username = currentUsername || (usernameInput ? usernameInput.value || 'N/A' : 'N/A');
    const rollNumber = currentRollNumber || (rollNumberInput ? rollNumberInput.value || 'N/A' : 'N/A');

    // Display quiz result
    resultContainer.innerHTML = `
        <h2>Quiz Result</h2>
        <p>Name: ${username}</p>
        <p>Roll Number: ${rollNumber}</p>
        <p>Your Score: ${score} out of ${totalQuestions}</p>
        <p>Percentile: ${percentage.toFixed(2)}%</p>
        <p>Time Taken: ${calculateTimeTaken()}</p>
        <button onclick="reviewQuiz()">Review Questions</button>
    `;
    resultContainer.classList.remove('hidden');

    // Save quiz result for reporting purposes
    saveQuizResultForReport();

    // Reset quiz state
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('score');
    localStorage.removeItem('timeTaken');
    currentQuestion = 0;
    score = 0;

    // Clear timer interval
    clearInterval(timerInterval);

    // Check localStorage for debugging
    checkLocalStorage();
}

// Function to calculate time taken for the quiz
function calculateTimeTaken() {
    const currentTime = new Date();
    const timeTakenInSeconds = (currentTime - quizStartTime) / 1000;
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = Math.floor(timeTakenInSeconds % 60);
    return `${padZero(minutes)}:${padZero(seconds)}`;
}

// Function to pad zero to single-digit numbers
function padZero(value) {
    return value < 10 ? `0${value}` : value;
}

// Function to review quiz questions and answers
function reviewQuiz() {
    // Display questions, user's answers, and correct answers for review
    resultContainer.innerHTML += `
        <div class="review-container">
            ${questions.map((question, index) => `
                <div class="question">${index + 1}. ${question.question}</div>
                <div class="${question.options.indexOf(question.correctAnswer) === index ? 'correct' : 'wrong'}">
                    Your Answer: ${question.options[index]}
                </div>
                <div class="explanation">Explanation: ${question.explanation}</div>
            `).join('')}
        </div>
    `;
    resultContainer.querySelector('.review-container').classList.remove('hidden');
}

// Function to check and log localStorage data for debugging
function checkLocalStorage() {
    const storedUsername = localStorage.getItem('username');
    const storedRollNumber = localStorage.getItem('rollNumber');
    console.log('Stored Username in checkLocalStorage:', storedUsername);
    console.log('Stored Roll Number in checkLocalStorage:', storedRollNumber);
}

// Function to save quiz result for reporting purposes
function saveQuizResultForReport() {
    // Retrieve username and roll number for reporting
    const reportUsername = localStorage.getItem('reportUsername') || 'N/A';
    const reportRollNumber = localStorage.getItem('reportRollNumber') || 'N/A';

    // Calculate attempted, correct, and wrong answers
    const totalQuestions = questions.length;
    const attemptedQuestions = currentQuestion - 1 >= 0 ? currentQuestion - 1 : 0;
    const correctAnswers = score >= 0 ? score : 0;
    const wrongAnswers = attemptedQuestions - correctAnswers >= 0 ? attemptedQuestions - correctAnswers : 0;

    // Store quiz result data in localStorage
    localStorage.setItem('reportUsername', reportUsername);
    localStorage.setItem('reportRollNumber', reportRollNumber);

    // Construct quiz result object
    const quizResultData = {
        name: reportUsername,
        rollNumber: reportRollNumber,
        totalQuestions: totalQuestions,
        attemptedQuestions: attemptedQuestions,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers
    };

    // Retrieve existing quiz report data and append new result
    const existingData = getQuizReportData();
    existingData.push(quizResultData);

    // Store updated quiz report data in localStorage
    localStorage.setItem('QuizResultReportDataSet', JSON.stringify(existingData));
}

// Function to logout and clear login data
function logout() {
    localStorage.removeItem('quizResultLogin'); // Clear login data
    document.getElementById('loginSection').style.display = 'block'; // Show login section
    document.getElementById('quizReportSection').style.display = 'none'; // Hide quiz report section
}

// Call checkLocalStorage to log localStorage data and showStartPage on page load
checkLocalStorage();
showStartPage();
