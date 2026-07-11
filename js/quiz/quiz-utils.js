"use strict";

/* ==========================================================
   quiz-utils.js
   Security Learning Engine (SGLE)
   Version : 1.0.0
========================================================== */

const QuizUtils = {

    /* ==========================================
       Random Integer
    ========================================== */

    random(min, max) {

        return Math.floor(

            Math.random() * (max - min + 1)

        ) + min;

    },

    /* ==========================================
       Shuffle Array
    ========================================== */

    shuffle(array) {

        const arr = [...array];

        for (

            let i = arr.length - 1;

            i > 0;

            i--

        ) {

            const j = Math.floor(

                Math.random() * (i + 1)

            );

            [arr[i], arr[j]] = [

                arr[j],

                arr[i]

            ];

        }

        return arr;

    },

    /* ==========================================
       Shuffle Questions
    ========================================== */

    shuffleQuestions(questions) {

        return this.shuffle(questions);

    },

    /* ==========================================
       Shuffle Options
    ========================================== */

    shuffleOptions(question) {

        const correctAnswer = question.options[question.answer];

        const options = this.shuffle(question.options);

        const newAnswer = options.indexOf(correctAnswer);

        return {

            ...question,

            options,

            answer: newAnswer

        };

    },

    /* ==========================================
       Deep Shuffle Quiz
    ========================================== */

    prepareQuiz(quiz) {

        let questions = this.shuffleQuestions(

            quiz.questions

        );

        questions = questions.map(

            question =>

            this.shuffleOptions(question)

        );

        return {

            ...quiz,

            questions

        };

    },

    /* ==========================================
       Format Time
    ========================================== */

    formatTime(seconds) {

        const min = Math.floor(

            seconds / 60

        );

        const sec = seconds % 60;

        return (

            String(min).padStart(2, "0")

            +

            ":"

            +

            String(sec).padStart(2, "0")

        );

    },

    /* ==========================================
       Countdown Timer
    ========================================== */

    startTimer(seconds, callback) {

        let remaining = seconds;

        const timer = setInterval(() => {

            callback(

                remaining,

                this.formatTime(remaining)

            );

            remaining--;

            if (remaining < 0) {

                clearInterval(timer);

            }

        }, 1000);

        return timer;

    },

    stopTimer(timer) {

        clearInterval(timer);

    },

    /* ==========================================
       Percentage
    ========================================== */

    percentage(correct, total) {

        if (!total) return 0;

        return Math.round(

            (correct / total) * 100

        );

    },

    /* ==========================================
       Pass Check
    ========================================== */

    isPass(score) {

        return (

            score >=

            SGLE.config.passPercentage

        );

    },

    /* ==========================================
       Progress
    ========================================== */

    calculateProgress() {

        return Math.round(

            (

                SGLE.state.completedLessons.length /

                SGLE.config.totalLessons

            ) * 100

        );

    },

    /* ==========================================
       Badge
    ========================================== */

    badge(progress) {

        if (progress >= 100)

            return "Master";

        if (progress >= 75)

            return "Gold";

        if (progress >= 50)

            return "Silver";

        if (progress >= 25)

            return "Bronze";

        return "Beginner";

    },

    /* ==========================================
       Current Date
    ========================================== */

    today() {

        return new Date()

            .toISOString()

            .split("T")[0];

    },

    /* ==========================================
       UUID
    ========================================== */

    uuid() {

        return "xxxx-xxxx-4xxx-yxxx"

        .replace(/[xy]/g, c => {

            const r =

                Math.random() * 16 | 0;

            const v =

                c === "x"

                ? r

                : (r & 0x3 | 0x8);

            return v.toString(16);

        });

    },

    /* ==========================================
       Debounce
    ========================================== */

    debounce(fn, delay = 300) {

        let timeout;

        return (...args) => {

            clearTimeout(timeout);

            timeout = setTimeout(() => {

                fn.apply(this, args);

            }, delay);

        };

    },

    /* ==========================================
       Scroll Top
    ========================================== */

    scrollTop() {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

};
