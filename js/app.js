"use strict";

/* ==========================================================
   Security Learning Engine
   app.js
   Version : 1.0.0
   Author  : Suraksha Guide

   Core Bootstrap File
========================================================== */

const SGLE = {

    version: "1.0.0",

    config: {

        appName: "Security English Challenge",

        totalLessons: 30,

        passPercentage: 80,

        lessonFile: "data/lessons.json",

        quizFile: "data/quizzes.json",

        storageKey: "sgle_progress",

        themeKey: "sgle_theme"

    },

    state: {

        lessons: [],

        quizzes: [],

        currentLesson: 1,

        completedLessons: [],

        scores: {},

        theme: "light",

        loaded: false

    }

};

/* ==========================================================
   Main Application
========================================================== */

class SecurityLearningApp {

    constructor() {

        this.container = document.getElementById("englishChallenge");

    }

    async init() {

        if (!this.container) {

            console.error("Container #englishChallenge not found.");

            return;

        }

        this.showLoader();

        try {

            await Storage.restore();

            await LessonEngine.load();

            await QuizEngine.load();

            Sidebar.render();

            LessonEngine.renderCurrent();

            this.hideLoader();

        }

        catch (e) {

            console.error(e);

            this.showError(e.message);

        }

    }

    showLoader() {

        this.container.innerHTML = `

<div class="text-center py-5">

<div class="spinner-border text-primary"></div>

<h4 class="mt-3">

Loading Security English Challenge...

</h4>

</div>

`;

    }

    hideLoader() {

        document.body.classList.add("sg-loaded");

    }

    showError(message) {

        this.container.innerHTML = `

<div class="alert alert-danger">

<h4>Application Error</h4>

<p>${message}</p>

<button class="btn btn-primary"

onclick="location.reload()">

Retry

</button>

</div>

`;

    }

}

/* ==========================================================
   Initialize
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    window.App = new SecurityLearningApp();

    window.App.init();

});
