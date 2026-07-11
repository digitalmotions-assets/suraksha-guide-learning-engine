"use strict";

/* ==========================================================
   quiz-validator.js
   Security Learning Engine (SGLE)
   Version : 1.0.0
========================================================== */

const QuizValidator = {

    validate(quiz) {

        if (!quiz || !quiz.questions) {
            return null;
        }

        let total = quiz.questions.length;
        let correct = 0;

        const answers = [];

        quiz.questions.forEach((question, index) => {

            const selected = document.querySelector(
                `input[name="question_${index}"]:checked`
            );

            if (!selected) {

                answers.push({

                    question: index + 1,

                    selected: null,

                    correct: question.answer,

                    status: false

                });

                return;

            }

            const value = parseInt(selected.value);

            const status = value === question.answer;

            if (status) {

                correct++;

            }

            answers.push({

                question: index + 1,

                selected: value,

                correct: question.answer,

                status: status

            });

        });

        const score = Math.round(

            (correct / total) * 100

        );

        const pass =

            score >= SGLE.config.passPercentage;

        return {

            pass: pass,

            score: score,

            total: total,

            correct: correct,

            wrong: total - correct,

            answers: answers

        };

    },

    getWrongAnswers(result) {

        return result.answers.filter(

            item => !item.status

        );

    },

    getCorrectAnswers(result) {

        return result.answers.filter(

            item => item.status

        );

    },

    isPassed(result) {

        return result.pass;

    },

    percentage(correct, total) {

        return Math.round(

            (correct / total) * 100

        );

    }

};
