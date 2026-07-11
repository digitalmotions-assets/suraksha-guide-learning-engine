"use strict";

/* ==========================================================
   quiz-engine.js
   Security Learning Engine (SGLE)
   Version : 1.0.0
========================================================== */

const QuizEngine = {

    quizzes: [],

    currentQuiz: null,

    currentDay: 1,

    async load() {

        try {

            const response = await fetch(SGLE.config.quizFile);

            if (!response.ok) {
                throw new Error("Unable to load quizzes.json");
            }

            this.quizzes = await response.json();

            SGLE.state.quizzes = this.quizzes;

        } catch (error) {

            console.error("Quiz Load Error:", error);

            throw error;

        }

    },

    getQuiz(day) {

        return this.quizzes.find(q => q.day === day);

    },

    render(day) {

        this.currentDay = day;

        this.currentQuiz = this.getQuiz(day);

        if (!this.currentQuiz) {

            UI.showError("Quiz not found.");

            return;

        }

        QuizRenderer.render(this.currentQuiz);

    },

    submit() {

        const result = QuizValidator.validate(

            this.currentQuiz

        );

        if (!result) return;

        this.finish(result);

    },

    finish(result) {

        if (result.pass) {

            Storage.completeLesson(

                this.currentDay,

                result.score

            );

            Toast.success(

                "Congratulations!",

                "Lesson Completed Successfully."

            );

        } else {

            Toast.warning(

                "Try Again",

                "You need at least "

                + SGLE.config.passPercentage +

                "% to unlock next lesson."

            );

        }

        QuizRenderer.showResult(result);

        Sidebar.render();

    },

    retry() {

        this.render(this.currentDay);

    },

    nextLesson() {

        if (

            Storage.isUnlocked(

                this.currentDay + 1

            )

        ) {

            LessonEngine.render(

                this.currentDay + 1

            );

        }

    },

    previousLesson() {

        if (this.currentDay > 1) {

            LessonEngine.render(

                this.currentDay - 1

            );

        }

    }

};
