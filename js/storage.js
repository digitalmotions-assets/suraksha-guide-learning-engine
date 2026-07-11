"use strict";

/* ==========================================================
   storage.js
   Security Learning Engine
   Version : 1.0.0
========================================================== */

const Storage = {

    defaultData() {

        return {

            completedLessons: [],

            scores: {},

            currentLesson: 1,

            streak: 0,

            progress: 0,

            theme: "light",

            language: "en",

            lastVisit: null,

            badges: [],

            certificate: false

        };

    },

    async restore() {

        try {

            const saved = localStorage.getItem(

                SGLE.config.storageKey

            );

            if (!saved) {

                SGLE.state = {

                    ...SGLE.state,

                    ...this.defaultData()

                };

                return;

            }

            const data = JSON.parse(saved);

            SGLE.state.completedLessons =

                data.completedLessons || [];

            SGLE.state.scores =

                data.scores || {};

            SGLE.state.currentLesson =

                data.currentLesson || 1;

            SGLE.state.streak =

                data.streak || 0;

            SGLE.state.progress =

                data.progress || 0;

            SGLE.state.theme =

                data.theme || "light";

            SGLE.state.language =

                data.language || "en";

            SGLE.state.lastVisit =

                data.lastVisit || null;

            SGLE.state.badges =

                data.badges || [];

            SGLE.state.certificate =

                data.certificate || false;

        }

        catch (error) {

            console.error(

                "Storage Restore Error",

                error

            );

            this.reset();

        }

    },

    save() {

        try {

            const data = {

                completedLessons:

                    SGLE.state.completedLessons,

                scores:

                    SGLE.state.scores,

                currentLesson:

                    SGLE.state.currentLesson,

                streak:

                    SGLE.state.streak,

                progress:

                    SGLE.state.progress,

                theme:

                    SGLE.state.theme,

                language:

                    SGLE.state.language,

                lastVisit:

                    new Date().toISOString(),

                badges:

                    SGLE.state.badges,

                certificate:

                    SGLE.state.certificate

            };

            localStorage.setItem(

                SGLE.config.storageKey,

                JSON.stringify(data)

            );

        }

        catch (error) {

            console.error(

                "Storage Save Error",

                error

            );

        }

    },

    completeLesson(day, score) {

        if (

            !SGLE.state.completedLessons.includes(day)

        ) {

            SGLE.state.completedLessons.push(day);

        }

        SGLE.state.scores[day] = score;

        SGLE.state.currentLesson = day + 1;

        SGLE.state.progress = Math.round(

            (

                SGLE.state.completedLessons.length /

                SGLE.config.totalLessons

            ) * 100

        );

        this.save();

    },

    isCompleted(day) {

        return SGLE.state.completedLessons.includes(day);

    },

    isUnlocked(day) {

        if (day === 1) return true;

        return this.isCompleted(day - 1);

    },

    getScore(day) {

        return SGLE.state.scores[day] || 0;

    },

    updateTheme(theme) {

        SGLE.state.theme = theme;

        this.save();

    },

    updateLanguage(language) {

        SGLE.state.language = language;

        this.save();

    },

    addBadge(name) {

        if (

            SGLE.state.badges.includes(name)

        ) return;

        SGLE.state.badges.push(name);

        this.save();

    },

    reset() {

        localStorage.removeItem(

            SGLE.config.storageKey

        );

        SGLE.state = {

            ...SGLE.state,

            ...this.defaultData()

        };

    },

    exportData() {

        return JSON.stringify({

            completedLessons:

                SGLE.state.completedLessons,

            scores:

                SGLE.state.scores,

            progress:

                SGLE.state.progress,

            streak:

                SGLE.state.streak,

            badges:

                SGLE.state.badges,

            theme:

                SGLE.state.theme,

            language:

                SGLE.state.language,

            version:

                SGLE.version

        });

    },

    importData(json) {

        try {

            const data = JSON.parse(json);

            localStorage.setItem(

                SGLE.config.storageKey,

                JSON.stringify(data)

            );

            location.reload();

        }

        catch (error) {

            console.error(

                "Import Failed",

                error

            );

        }

    }

};
