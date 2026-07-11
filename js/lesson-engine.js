"use strict";

/* ==========================================================
   lesson-engine.js
   Security Learning Engine
   Version : 1.0.0
========================================================== */

const LessonEngine = {

    async load() {

        try {

            const response = await fetch(SGLE.config.lessonFile);

            if (!response.ok) {
                throw new Error("Unable to load lessons.json");
            }

            SGLE.state.lessons = await response.json();

        } catch (error) {

            console.error(error);

            throw error;

        }

    },

    getCurrentLesson() {

        return SGLE.state.lessons.find(

            lesson => lesson.day === SGLE.state.currentLesson

        );

    },

    getLesson(day) {

        return SGLE.state.lessons.find(

            lesson => lesson.day === day

        );

    },

    renderCurrent() {

        this.render(SGLE.state.currentLesson);

    },

    render(day) {

        const lesson = this.getLesson(day);

        if (!lesson) {

            document.getElementById("englishChallenge").innerHTML = `

<div class="alert alert-danger">

Lesson not found.

</div>

`;

            return;

        }

        SGLE.state.currentLesson = day;

        const html = `

<div class="ec-card">

<div class="mb-4">

<span class="badge bg-primary">

Day ${lesson.day}

</span>

<h2 class="mt-3">

${lesson.title}

</h2>

<p class="text-muted">

${lesson.subtitle || ""}

</p>

</div>

<div class="mb-4">

<h4>Objective</h4>

<p>

${lesson.objective}

</p>

</div>

${this.renderVocabulary(lesson)}

${this.renderSentences(lesson)}

${this.renderConversation(lesson)}

${this.renderPractice(lesson)}

${this.renderTip(lesson)}

<div class="mt-5">

<button

class="btn btn-success"

id="startQuizBtn">

Start Quiz

</button>

</div>

</div>

`;

        document.getElementById(

            "englishChallenge"

        ).innerHTML = html;

        this.bindEvents();

    },

    renderVocabulary(lesson) {

        if (!lesson.vocabulary) return "";

        let rows = "";

        lesson.vocabulary.forEach(word => {

            rows += `

<tr>

<td>${word.english}</td>

<td>${word.hindi}</td>

</tr>

`;

        });

        return `

<div class="mt-5">

<h3>Vocabulary</h3>

<table class="table table-bordered">

<thead>

<tr>

<th>English</th>

<th>Hindi</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

</div>

`;

    },

    renderSentences(lesson) {

        if (!lesson.sentences) return "";

        let html = "";

        lesson.sentences.forEach(item => {

            html += `

<div class="card mb-2">

<div class="card-body">

<strong>

${item.english}

</strong>

<p>

${item.hindi}

</p>

</div>

</div>

`;

        });

        return `

<div class="mt-5">

<h3>Useful Sentences</h3>

${html}

</div>

`;

    },

    renderConversation(lesson) {

        if (!lesson.conversation) return "";

        let html = "";

        lesson.conversation.forEach(chat => {

            html += `

<div class="border rounded p-3 mb-3">

<strong>

${chat.speaker}

</strong>

<p>

${chat.english}

</p>

<small>

${chat.hindi}

</small>

</div>

`;

        });

        return `

<div class="mt-5">

<h3>Conversation</h3>

${html}

</div>

`;

    },

    renderPractice(lesson) {

        if (!lesson.practice) return "";

        return `

<div class="alert alert-warning mt-5">

<h4>Practice</h4>

<p>

${lesson.practice}

</p>

</div>

`;

    },

    renderTip(lesson) {

        if (!lesson.dailyTip) return "";

        return `

<div class="alert alert-success mt-5">

<h4>Daily Tip</h4>

<p>

${lesson.dailyTip}

</p>

</div>

`;

    },

    next() {

        if (

            SGLE.state.currentLesson <

            SGLE.config.totalLessons

        ) {

            this.render(

                SGLE.state.currentLesson + 1

            );

        }

    },

    previous() {

        if (

            SGLE.state.currentLesson > 1

        ) {

            this.render(

                SGLE.state.currentLesson - 1

            );

        }

    },

    bindEvents() {

        const quizButton =

            document.getElementById(

                "startQuizBtn"

            );

        if (quizButton) {

            quizButton.addEventListener(

                "click",

                () => {

                    QuizEngine.render(

                        SGLE.state.currentLesson

                    );

                }

            );

        }

    }

};
