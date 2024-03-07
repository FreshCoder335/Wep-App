// questions.js

// Check if questions are stored in localStorage
let questions = JSON.parse(localStorage.getItem('questions')) || [];

// If not, initialize with default questions
if (questions.length === 0) {
    questions = [
        {
            question: "What does CPU stand for?",
            options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Unit", "Central Process Unit"],
            correctAnswer: "Central Processing Unit",
            explanation: "The CPU, or Central Processing Unit, is the primary component that performs calculations and executes instructions in a computer."
        },
        {
            question: "Which component is known as the brain of the computer?",
            options: ["RAM", "Hard Drive", "CPU", "Motherboard"],
            correctAnswer: "CPU",
            explanation: "The CPU (Central Processing Unit) is often referred to as the brain of the computer because it processes instructions and performs calculations."
        },
    {
        question: "What does RAM stand for?",
        options: ["Random Access Memory", "Read-Only Memory", "Real-time Access Memory", "Random Antivirus Memory"],
        correctAnswer: "Random Access Memory",
        explanation: "RAM (Random Access Memory) is a type of computer memory that is used to store data that is actively being used or processed by a computer."
    },
    ];

    // Save default questions to localStorage
    localStorage.setItem('questions', JSON.stringify(questions));
}

// Ensure that these questions are accessible globally
window.questions = questions;