"use strict";

/* ==========================================================
   quiz-renderer.js
   Security Learning Engine (SGLE)
   Version : 1.0.0
========================================================== */

const QuizRenderer = {

    render(quiz) {

        const container = document.getElementById("englishChallenge");

        if (!container) return;

        let html = `
        <div class="ec-card">

            <div class="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <span class="badge bg-primary">
                        Day ${quiz.day}
                    </span>

                    <h2 class="mt-3">
                        Quiz Assessment
                    </h2>

                </div>

                <div>

                    <span class="badge bg-success">

                        Pass Marks

                        ${SGLE.config.passPercentage}%

                    </span>

                </div>

            </div>

            <div id="quizQuestions">
        `;

        quiz.questions.forEach((question, index) => {

            html += this.questionCard(question, index);

        });

        html += `

            </div>

            <div class="text-center mt-4">

                <button

                    id="submitQuiz"

                    class="btn btn-primary btn-lg">

                    Submit Quiz

                </button>

            </div>

        </div>
        `;

        container.innerHTML = html;

        this.bindEvents();

    },

    questionCard(question, index) {

        let options = "";

        question.options.forEach((option, optionIndex) => {

            options += `

            <label class="ec-option">

                <input

                    type="radio"

                    name="question_${index}"

                    value="${optionIndex}">

                ${option}

            </label>

            `;

        });

        return `

        <div class="ec-question">

            <h4>

                ${index + 1}.

                ${question.question}

            </h4>

            ${options}

        </div>

        `;

    },

    showResult(result) {

        const container = document.getElementById("englishChallenge");

        if (!container) return;

        container.innerHTML = `

        <div class="ec-card text-center">

            <h2>

                Quiz Result

            </h2>

            <div class="display-4 my-4">

                ${result.score}%

            </div>

            <div class="alert

                ${result.pass

                    ? "alert-success"

                    : "alert-danger"}">

                ${result.pass

                    ? "Congratulations! You Passed."

                    : "You did not reach the required score."}

            </div>

            <div class="mb-4">

                Correct Answers :

                ${result.correct}

                /

                ${result.total}

            </div>

            <button

                id="retryQuiz"

                class="btn btn-warning me-2">

                Retry Quiz

            </button>

            ${result.pass ? `

            <button

                id="nextLesson"

                class="btn btn-success">

                Next Lesson

            </button>

            ` : ""}

        </div>

        `;

        this.bindResultEvents();

    },

    bindEvents() {

        const submit = document.getElementById("submitQuiz");

        if (!submit) return;

        submit.addEventListener(

            "click",

            () => {

                QuizEngine.submit();

            }

        );

    },

    bindResultEvents() {

        const retry = document.getElementById("retryQuiz");

        if (retry) {

            retry.addEventListener(

                "click",

                () => {

                    QuizEngine.retry();

                }

            );

        }

        const next = document.getElementById("nextLesson");

        if (next) {

            next.addEventListener(

                "click",

                () => {

                    QuizEngine.nextLesson();

                }

            );

        }

    }

};
