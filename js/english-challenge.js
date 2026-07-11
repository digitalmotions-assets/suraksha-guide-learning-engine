/==============================================================================PROJECT: Security English ChallengeVERSION: 1.0.0PLATFORM: Google Blogger, GitHub Pages, Bootstrap 5 (No jQuery, No Frameworks)ARCHITECTURE: Pure ES6 JavaScript, Single File Modular DesignDESCRIPTION: A complete, production-ready Learning Management System (LMS)for security personnel to learn professional English.==============================================================================*//Main application class handling the Learning Management SystemEncapsulates all state, DOM manipulation, data fetching, and business logic./
class EnglishChallenge {
/*Initializes the English Challenge Engine.Sets up default state, configuration, and structural bindings.*/constructor() {// Configurationthis.config = {containerId: 'englishChallenge',lessonsUrl: 'data/lessons.json',quizzesUrl: 'data/quizzes.json',passScorePercentage: 80,storageKey: 'security_english_challenge_v1_progress',themeKey: 'security_english_challenge_v1_theme',maxQuestions: 10,courseTotalDays: 365,defaultLanguage: 'en',supportLanguage: 'hi' // Hindi};// Application Statethis.state = {lessons: [],quizzes: [],currentDay: 1,completedLessons: [], // Array of day numbersscores: {}, // Map of day -> highest scorestreak: 0,lastActiveDate: null,isLoaded: false,isLoading: true,error: null,theme: 'light',currentQuizAnswers: {} // Tracks user selections for current quiz};// DOM Element Cachethis.dom = {container: null,sidebar: null,mainContent: null,progressBar: null,progressText: null,lessonList: null,toastContainer: null};// Initialize Applicationthis.init();}/Bootstraps the application workflow.*/async init() {this.restoreProgress();this.restoreTheme();this.cache();if (!this.dom.container) {console.error([LMS Error] Container #${this.config.containerId} not found.);return;}// Initial skeleton renderthis.render();this.bindEvents();// Load Dataawait this.fetchData();}/Caches the main container element.Other elements are cached after rendering.*/cache() {this.dom.container = document.getElementById(this.config.containerId);}/Restores user progress from localStorage.*/restoreProgress() {try {const savedData = localStorage.getItem(this.config.storageKey);if (savedData) {const parsed = JSON.parse(savedData);this.state.completedLessons = parsed.completedLessons || [];this.state.scores = parsed.scores || {};this.state.streak = parsed.streak || 0;this.state.lastActiveDate = parsed.lastActiveDate || null;     // Set current day to highest completed + 1 (if available)
     const highestCompleted = Math.max(0, ...this.state.completedLessons);
     this.state.currentDay = highestCompleted + 1;

     this.calculateStreak();
 }
} catch (e) {console.warn('[LMS Storage] Failed to restore progress:', e);}}/Saves user progress to localStorage.*/saveProgress() {try {const dataToSave = {completedLessons: this.state.completedLessons,scores: this.state.scores,streak: this.state.streak,lastActiveDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD};localStorage.setItem(this.config.storageKey, JSON.stringify(dataToSave));} catch (e) {console.warn('[LMS Storage] Failed to save progress:', e);this.showError('Local Storage Error', 'Could not save your progress. Please check your browser settings.');}}/Restores the visual theme (Light/Dark).*/restoreTheme() {const savedTheme = localStorage.getItem(this.config.themeKey) || 'light';this.state.theme = savedTheme;document.documentElement.setAttribute('data-bs-theme', savedTheme);}/Toggles the application theme.*/toggleTheme() {this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';document.documentElement.setAttribute('data-bs-theme', this.state.theme);localStorage.setItem(this.config.themeKey, this.state.theme);}/Calculates the daily learning streak.*/calculateStreak() {const today = new Date().toISOString().split('T')[0];if (this.state.lastActiveDate) {const lastActive = new Date(this.state.lastActiveDate);const current = new Date(today);const diffTime = Math.abs(current - lastActive);const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); if (diffDays === 1) {
     // Maintained streak
 } else if (diffDays > 1) {
     // Lost streak
     this.state.streak = 0;
 }
}this.state.lastActiveDate = today;}/Fetches both lessons and quizzes concurrently.*/async fetchData() {this.renderLoading();try {const [lessonsData, quizzesData] = await Promise.all([this.loadLessons(),this.loadQuiz()]); this.state.lessons = lessonsData;
 this.state.quizzes = quizzesData;
 this.state.isLoaded = true;
 this.state.isLoading = false;

 // Ensure currentDay is valid
 if (this.state.currentDay > this.state.lessons.length) {
     this.state.currentDay = this.state.lessons.length > 0 ? this.state.lessons.length : 1;
 }

 this.renderApplication();
} catch (error) {this.state.isLoading = false;this.state.error = error.message;this.renderErrorScreen();}}/Loads lesson data from JSON.@returns {Promise} Array of lesson objects*/async loadLessons() {const response = await fetch(this.config.lessonsUrl);if (!response.ok) throw new Error('Failed to load lessons data.');return await response.json();}/Loads quiz data from JSON.@returns {Promise} Array of quiz objects*/async loadQuiz() {const response = await fetch(this.config.quizzesUrl);if (!response.ok) throw new Error('Failed to load quizzes data.');return await response.json();}/Renders the initial loading state.*/renderLoading() {this.dom.container.innerHTML = <div class="d-flex flex-column justify-content-center align-items-center vh-100 w-100"> <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"> <span class="visually-hidden">Loading...</span> </div> <h4 class="mt-4 text-muted">Loading Course Materials...</h4> <p class="text-secondary small">Security English Challenge</p> </div>;}/Renders the primary application layout after data is loaded.*/renderApplication() {this.dom.container.innerHTML = `Security English         <div class="col-md-4 col-lg-3 bg-light border-end lms-sidebar offcanvas-md offcanvas-start" tabindex="-1" id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel">
             <div class="offcanvas-header border-bottom d-md-none">
                 <h5 class="offcanvas-title" id="sidebarOffcanvasLabel">Course Navigation</h5>
                 <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" data-bs-target="#sidebarOffcanvas"></button>
             </div>
             <div class="offcanvas-body flex-column p-0 h-100 d-flex">
                 ${this.generateSidebarHTML()}
             </div>
         </div>

         <div class="col-md-8 col-lg-9 bg-body main-content-area" id="mainContentArea" style="height: 100vh; overflow-y: auto;">
             <div class="p-3 p-md-5" id="lessonContainer">
                 </div>
         </div>
     </div>
 </div>
 <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastContainer" style="z-index: 1100"></div>
`;// Cache new dynamic elementsthis.dom.sidebar = document.getElementById('sidebarList');this.dom.mainContent = document.getElementById('lessonContainer');this.dom.toastContainer = document.getElementById('toastContainer');this.dom.progressBar = document.getElementById('sidebarProgressBar');this.dom.progressText = document.getElementById('sidebarProgressText');// Render current statethis.updateSidebar();this.renderLesson(this.state.currentDay);}/Generates HTML for the sidebar structure.@returns {string} HTML string*/generateSidebarHTML() {const totalLessons = this.state.lessons.length;const completedCount = this.state.completedLessons.length;const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;return `Security EnglishProfessional Communication Course     <div class="progress-section mt-3">
         <div class="d-flex justify-content-between mb-1 small fw-semibold">
             <span>Course Progress</span>
             <span id="sidebarProgressText">${progressPercentage}%</span>
         </div>
         <div class="progress bg-white bg-opacity-25" style="height: 8px;">
             <div id="sidebarProgressBar" class="progress-bar bg-warning" role="progressbar" style="width: ${progressPercentage}%" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
         </div>
     </div>

     <div class="d-flex justify-content-between mt-3 text-center w-100">
         <div class="bg-white bg-opacity-10 rounded p-2 flex-grow-1 me-2">
             <div class="fs-4 fw-bold text-warning">${this.state.streak}</div>
             <div class="small opacity-75">Day Streak <i class="bi bi-fire text-danger"></i></div>
         </div>
         <div class="bg-white bg-opacity-10 rounded p-2 flex-grow-1">
             <div class="fs-4 fw-bold text-info">${completedCount}</div>
             <div class="small opacity-75">Completed <i class="bi bi-check-circle-fill"></i></div>
         </div>
     </div>
 </div>

 <div class="sidebar-list flex-grow-1 overflow-auto bg-body-tertiary">
     <div class="list-group list-group-flush rounded-0" id="sidebarList">
         </div>
 </div>
`;}/Updates sidebar classes and logic based on current progress.*/updateSidebar() {if (!this.dom.sidebar) return;let html = '';this.state.lessons.forEach(lesson => {const isCompleted = this.state.completedLessons.includes(lesson.day);const isCurrent = this.state.currentDay === lesson.day; // Logic: A lesson is unlocked if it's completed, OR if it's the exact next lesson after highest completed
 const highestCompleted = Math.max(0, ...this.state.completedLessons);
 const isUnlocked = lesson.day <= highestCompleted + 1;

 let icon = '';
 let statusClass = '';

 if (isCompleted) {
     icon = '<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>';
     statusClass = 'completed';
 } else if (isUnlocked) {
     icon = '<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill text-primary" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg>';
     statusClass = 'unlocked';
 } else {
     icon = '<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" fill="currentColor" class="bi bi-lock-fill text-secondary" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>';
     statusClass = 'locked bg-light text-muted opacity-50';
 }

 const activeClass = isCurrent ? 'active border-primary border-start border-4' : 'border-start border-4 border-transparent';

 html += `
     <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 lesson-nav-item ${activeClass} ${statusClass}" data-day="${lesson.day}" ${!isUnlocked && !isCompleted ? 'disabled aria-disabled="true"' : ''}>
         <div class="d-flex flex-column text-start">
             <span class="fw-bold mb-1">Day ${lesson.day}</span>
             <span class="small text-truncate" style="max-width: 200px;">${this.sanitizeHTML(lesson.title)}</span>
         </div>
         <div class="fs-5">${icon}</div>
     </button>
 `;
});this.dom.sidebar.innerHTML = html;this.updateProgress();}/Updates the progress bar visually.*/updateProgress() {if (!this.dom.progressBar || !this.dom.progressText) return;const total = this.state.lessons.length;const comp = this.state.completedLessons.length;const pct = total > 0 ? Math.round((comp / total) * 100) : 0;this.dom.progressBar.style.width = ${pct}%;this.dom.progressBar.setAttribute('aria-valuenow', pct);this.dom.progressText.innerText = ${pct}%;}/Renders a specific lesson by day.@param {number} day Day number*/renderLesson(day) {const lesson = this.state.lessons.find(l => l.day === parseInt(day));if (!lesson) {this.showError('Lesson Not Found', We couldn't find the data for Day ${day}.);return;}// Check if unlockedconst highestCompleted = Math.max(0, ...this.state.completedLessons);if (day > highestCompleted + 1) {this.showToast('Access Denied', 'You must complete previous lessons to unlock this one.', 'warning');return;}this.state.currentDay = day;this.saveProgress();this.updateSidebar();// Scroll to topif(this.dom.mainContent) {this.dom.mainContent.parentElement.scrollTop = 0;}// Close mobile offcanvas if openconst offcanvasEl = document.getElementById('sidebarOffcanvas');if (offcanvasEl) {// Using standard DOM removal of Bootstrap classes to avoid importing bootstrap JSoffcanvasEl.classList.remove('show');document.body.style.overflow = '';document.body.style.paddingRight = '';const backdrop = document.querySelector('.offcanvas-backdrop');if(backdrop) backdrop.remove();}const isCompleted = this.state.completedLessons.includes(day);const score = this.state.scores[day] || 0;let html = `Day ${lesson.day} • ${lesson.level}</span>
<h1 class="display-5 fw-bold text-body-emphasis mb-3">${this.sanitizeHTML(lesson.title)}</h1>
<h3 class="h5 text-secondary fw-normal">${this.sanitizeHTML(lesson.subtitle)}         <div class="card bg-info bg-opacity-10 border-info border-opacity-25 mt-4">
             <div class="card-body d-flex align-items-start">
                 <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" fill="currentColor" class="bi bi-bullseye text-info me-3 flex-shrink-0" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/><path d="M8 11A3 3 0 1 1 8 5a3 3 0 0 1 0 6zm0 1A4 4 0 1 0 8 4a4 4 0 0 0 0 8z"/><path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>
                 <div>
                     <h6 class="fw-bold mb-1 text-info-emphasis">Lesson Objective</h6>
                     <p class="mb-0 text-body-secondary">${this.sanitizeHTML(lesson.objective)}</p>
                 </div>
             </div>
         </div>
     </div>

     ${this.renderVocabulary(lesson.vocabulary)}

     ${this.renderSentences(lesson.sentences)}

     ${this.renderConversation(lesson.conversation)}

     <div class="alert alert-warning border-warning shadow-sm mt-5 mb-5 d-flex" role="alert">
         <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" fill="currentColor" class="bi bi-lightbulb-fill text-warning flex-shrink-0 me-3" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5z"/></svg>
         <div>
             <h5 class="alert-heading fw-bold">Daily Security Tip</h5>
             <p class="mb-0">${this.sanitizeHTML(lesson.dailyTip)}</p>
         </div>
     </div>

     <div class="card shadow-sm border-0 bg-body-tertiary mt-5" id="quizSectionContainer">
         <div class="card-body p-4 p-md-5 text-center">
             <h2 class="fw-bold mb-3">Knowledge Check</h2>
             <p class="text-secondary mb-4">Take the quiz to test your understanding and unlock the next lesson. You need <strong>${this.config.passScorePercentage}%</strong> to pass.</p>
             ${isCompleted ? `<div class="mb-3 text-success fw-bold"><i class="bi bi-check-circle-fill me-2"></i>You have completed this lesson (Best Score: ${score}%)</div>` : ''}
             <button class="btn ${isCompleted ? 'btn-outline-primary' : 'btn-primary'} btn-lg px-5 py-3 shadow-sm rounded-pill fw-bold" id="btnStartQuiz" data-day="${lesson.day}">
                 ${isCompleted ? 'Retake Quiz' : 'Start Quiz Now'}
             </button>
         </div>
     </div>

     <div class="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
         <button class="btn btn-outline-secondary" id="btnPrevLesson" ${lesson.day === 1 ? 'disabled' : ''}>
             <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg> Previous Lesson
         </button>
         <button class="btn btn-outline-secondary" id="btnNextLesson" ${!isCompleted || lesson.day === this.state.lessons.length ? 'disabled' : ''}>
             Next Lesson <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" fill="currentColor" class="bi bi-arrow-right ms-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
         </button>
     </div>

     <div class="mt-5 text-center text-secondary small pb-5">
         Security English Challenge v1.0 &copy; ${new Date().getFullYear()}
     </div>
 </div>
`;this.dom.mainContent.innerHTML = html;this.addCSSRules();}/Renders the vocabulary table.*/renderVocabulary(vocabArray) {if (!vocabArray || vocabArray.length === 0) return '';let rows = vocabArray.map(item => <tr> <td class="fw-bold text-primary w-50">${this.sanitizeHTML(item.en)}</td> <td class="text-secondary w-50">${this.sanitizeHTML(item.hi)}</td> </tr>).join('');return <div class="mb-5"> <h4 class="fw-bold mb-3 border-start border-4 border-primary ps-3">Vocabulary</h4> <div class="table-responsive rounded shadow-sm border"> <table class="table table-hover table-striped mb-0 bg-body"> <thead class="table-dark"> <tr> <th scope="col">English Word/Phrase</th> <th scope="col">Hindi Meaning</th> </tr> </thead> <tbody>${rows}</tbody> </table> </div> </div>;}/Renders useful sentences list.*/renderSentences(sentencesArray) {if (!sentencesArray || sentencesArray.length === 0) return '';let list = sentencesArray.map(item => <li class="list-group-item p-3 border-0 border-bottom"> <div class="fw-semibold fs-5 mb-1 text-body">${this.sanitizeHTML(item.en)}</div> <div class="text-secondary">${this.sanitizeHTML(item.hi)}</div> </li>).join('');return <div class="mb-5"> <h4 class="fw-bold mb-3 border-start border-4 border-success ps-3">Useful Sentences</h4> <div class="card shadow-sm border-0"> <ul class="list-group list-group-flush rounded">${list}</ul> </div> </div>;}/Renders the conversation using a professional Chat UI.*/renderConversation(conversationArray) {if (!conversationArray || conversationArray.length === 0) return '';let chats = conversationArray.map(line => {const isGuard = line.speaker.toLowerCase().includes('guard');const alignClass = isGuard ? 'align-self-end text-end' : 'align-self-start text-start';const bgClass = isGuard ? 'bg-primary text-white' : 'bg-secondary bg-opacity-10 text-body';const avatar = isGuard ? '💂‍♂️' : '👤'; return `
     <div class="d-flex flex-column ${alignClass} mb-3" style="max-width: 80%;">
         <div class="small text-muted mb-1 px-1 fw-bold">${avatar} ${this.sanitizeHTML(line.speaker)}</div>
         <div class="p-3 rounded-4 shadow-sm ${bgClass} ${isGuard ? 'rounded-bottom-0 rounded-start-4' : 'rounded-bottom-0 rounded-end-4'}">
             <div class="fs-6">${this.sanitizeHTML(line.en)}</div>
             ${line.hi ? `<div class="small mt-1 opacity-75 border-top border-secondary border-opacity-25 pt-1">${this.sanitizeHTML(line.hi)}</div>` : ''}
         </div>
     </div>
 `;
}).join('');return <div class="mb-5"> <h4 class="fw-bold mb-3 border-start border-4 border-info ps-3">Real-world Conversation</h4> <div class="card border-0 shadow-sm bg-body-tertiary"> <div class="card-body d-flex flex-column p-4" style="max-height: 500px; overflow-y: auto;"> ${chats} </div> </div> </div>;}/Renders the interactive quiz interface.@param {number} day Lesson day number*/renderQuiz(day) {const quizData = this.state.quizzes.find(q => q.day === parseInt(day));if (!quizData || !quizData.questions) {this.showToast('Quiz Unavailable', 'Quiz data is missing for this lesson.', 'danger');return;}// Shuffle questions and select up to maxlet questions = this.shuffleArray([...quizData.questions]).slice(0, this.config.maxQuestions);this.state.currentQuizAnswers = {};let questionsHTML = questions.map((q, index) => {// Ensure options are shuffled but keep track of correct answer string matchinglet options = this.shuffleArray([...q.options]); let optionsHTML = options.map((opt, optIndex) => {
     const optId = `q${index}_opt${optIndex}`;
     return `
         <div class="form-check custom-radio mb-3 p-3 border rounded hover-bg-light transition-all">
             <input class="form-check-input ms-1 me-3 quiz-radio" type="radio" name="question_${index}" id="${optId}" value="${this.sanitizeHTML(opt)}" data-correct="${opt === q.answer ? 'true' : 'false'}">
             <label class="form-check-label w-100 stretched-link cursor-pointer fw-medium" for="${optId}">
                 ${this.sanitizeHTML(opt)}
             </label>
         </div>
     `;
 }).join('');

 return `
     <div class="card mb-4 shadow-sm border-0 quiz-question-card" id="questionCard_${index}">
         <div class="card-body p-4">
             <h5 class="card-title fw-bold mb-4">
                 <span class="badge bg-secondary me-2">Q${index + 1}</span> 
                 ${this.sanitizeHTML(q.question)}
             </h5>
             <div class="options-container">
                 ${optionsHTML}
             </div>
             <div class="feedback-area mt-3 d-none p-3 rounded" id="feedback_${index}"></div>
         </div>
     </div>
 `;
}).join('');const container = document.getElementById('quizSectionContainer');if (container) {container.innerHTML = `Quiz: Day ${day}Cancel         <form id="quizForm" data-day="${day}">
             ${questionsHTML}

             <div class="sticky-bottom bg-body p-3 border-top shadow-lg d-flex justify-content-between align-items-center mt-5 rounded-top">
                 <div class="text-secondary fw-semibold">
                     Answer all questions to submit
                 </div>
                 <button type="submit" class="btn btn-primary btn-lg px-5 shadow fw-bold">Submit Answers</button>
             </div>
         </form>
     </div>
 `;

 // Scroll to quiz
 container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}}/Handles quiz submission, evaluation, and scoring.@param {Event} e Form submit event*/submitQuiz(e) {e.preventDefault();const form = e.target;const day = parseInt(form.getAttribute('data-day'));const questions = form.querySelectorAll('.quiz-question-card');let correctCount = 0;let totalCount = questions.length;let allAnswered = true;// Reset feedbackform.querySelectorAll('.feedback-area').forEach(el => el.classList.add('d-none'));form.querySelectorAll('.custom-radio').forEach(el => {el.classList.remove('bg-success', 'bg-danger', 'bg-opacity-10', 'border-success', 'border-danger');});questions.forEach((card, index) => {const selected = card.querySelector(input[name="question_${index}"]:checked);const feedbackEl = card.querySelector(#feedback_${index}); if (!selected) {
     allAnswered = false;
     card.classList.add('border', 'border-danger');
     return;
 }
 card.classList.remove('border', 'border-danger');

 const isCorrect = selected.getAttribute('data-correct') === 'true';
 const parentDiv = selected.closest('.custom-radio');

 // Disable all inputs in this card to prevent changing after submit
 card.querySelectorAll('input').forEach(input => input.disabled = true);

 if (isCorrect) {
     correctCount++;
     parentDiv.classList.add('bg-success', 'bg-opacity-10', 'border-success');
     feedbackEl.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2"></i> <strong>Correct!</strong>`;
     feedbackEl.classList.add('bg-success', 'bg-opacity-10', 'text-success');
 } else {
     parentDiv.classList.add('bg-danger', 'bg-opacity-10', 'border-danger');

     // Highlight correct answer
     const correctInput = card.querySelector(`input[data-correct="true"]`);
     if (correctInput) {
         correctInput.closest('.custom-radio').classList.add('border-success', 'border-2');
     }

     feedbackEl.innerHTML = `<i class="bi bi-x-circle-fill text-danger me-2"></i> <strong>Incorrect.</strong> The correct answer was: ${this.sanitizeHTML(correctInput.value)}`;
     feedbackEl.classList.add('bg-danger', 'bg-opacity-10', 'text-danger');
 }
 feedbackEl.classList.remove('d-none');
});if (!allAnswered) {this.showToast('Incomplete Quiz', 'Please answer all questions before submitting.', 'warning');return;}const scorePercentage = Math.round((correctCount / totalCount) * 100);this.processQuizResult(day, scorePercentage);}/Processes the final quiz result, updates progress, and renders results screen.@param {number} day Lesson day@param {number} score % Score*/processQuizResult(day, score) {const passed = score >= this.config.passScorePercentage;// Save score if it's the highestif (!this.state.scores[day] || score > this.state.scores[day]) {this.state.scores[day] = score;}let unlockMessage = '';if (passed) {if (!this.state.completedLessons.includes(day)) {this.state.completedLessons.push(day);this.state.streak++;unlockMessage = <div class="alert alert-success mt-4 fw-bold shadow-sm"><i class="bi bi-unlock-fill me-2"></i>Lesson ${day + 1} Unlocked!</div>;}this.saveProgress();this.updateSidebar();}const container = document.getElementById('quizSectionContainer');if (container) {container.innerHTML = <div class="card shadow border-0 text-center p-5 animation-fade-in ${passed ? 'bg-success' : 'bg-danger'} bg-opacity-10"> <h2 class="display-4 fw-bold ${passed ? 'text-success' : 'text-danger'} mb-3"> ${score}% </h2> <h3 class="fw-bold mb-3">${passed ? 'Outstanding Work!' : 'Keep Trying!'}</h3> <p class="text-secondary fs-5"> ${passed  ? 'You have successfully passed the knowledge check and mastered today\'s vocabulary.'  :You need ${this.config.passScorePercentage}% to pass. Review the lesson and try again.} </p> ${unlockMessage} <div class="mt-4 d-flex justify-content-center gap-3"> <button class="btn btn-outline-secondary px-4 py-2" id="btnRetakeQuiz" data-day="${day}"> <i class="bi bi-arrow-clockwise me-2"></i>Retake Quiz </button> ${passed && day < this.state.lessons.length ? Next Lesson : ''} </div> </div>;container.scrollIntoView({ behavior: 'smooth', block: 'center' });}}/Handles global event delegation for dynamic elements.*/bindEvents() {if (!this.dom.container) return;this.dom.container.addEventListener('click', (e) => {// Sidebar Lesson Navigationconst navItem = e.target.closest('.lesson-nav-item');if (navItem && !navItem.disabled && !navItem.hasAttribute('aria-disabled')) {const day = parseInt(navItem.getAttribute('data-day'));this.renderLesson(day);} // Start/Retake Quiz Button
 const btnStart = e.target.closest('#btnStartQuiz') || e.target.closest('#btnRetakeQuiz');
 if (btnStart) {
     const day = parseInt(btnStart.getAttribute('data-day'));
     this.renderQuiz(day);
 }

 // Cancel Quiz Button
 const btnCancel = e.target.closest('#btnCancelQuiz');
 if (btnCancel) {
     this.renderLesson(this.state.currentDay);
 }

 // Navigation: Previous
 const btnPrev = e.target.closest('#btnPrevLesson');
 if (btnPrev) {
     if (this.state.currentDay > 1) {
         this.renderLesson(this.state.currentDay - 1);
     }
 }

 // Navigation: Next
 const btnNext = e.target.closest('#btnNextLesson') || e.target.closest('#btnNextFromQuiz');
 if (btnNext) {
     if (this.state.currentDay < this.state.lessons.length) {
         this.renderLesson(this.state.currentDay + 1);
     }
 }

 // Theme Toggle
 const btnTheme = e.target.closest('#btnThemeToggle');
 if (btnTheme) {
     this.toggleTheme();
 }

 // Retry Fetch
 const btnRetry = e.target.closest('#btnRetryFetch');
 if(btnRetry) {
     this.fetchData();
 }
});// Quiz Form Submissionthis.dom.container.addEventListener('submit', (e) => {if (e.target.id === 'quizForm') {this.submitQuiz(e);}});}/Renders a full screen error if JSON parsing or fetching fails.*/renderErrorScreen() {this.dom.container.innerHTML = <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-4"> <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="80" height="80" fill="currentColor" class="bi bi-exclamation-triangle-fill text-danger mb-4" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg> <h2 class="fw-bold text-dark mb-2">System Offline</h2> <p class="text-secondary mb-4" style="max-width: 500px;"> We are unable to load the course materials. This might be due to a network error, missing data files, or server maintenance.<br><br> <small class="text-muted border p-2 rounded d-inline-block bg-white">${this.sanitizeHTML(this.state.error || 'Unknown Error')}</small> </p> <button class="btn btn-primary btn-lg px-4 shadow-sm rounded-pill" id="btnRetryFetch"> <i class="bi bi-arrow-clockwise me-2"></i> Retry Connection </button> </div>;}/  Displays a Bootstrap-styled Toast notification.  @param {string} title  @param {string} message  @param {string} type 'success', 'danger', 'warning', 'info'*/showToast(title, message, type = 'info') {if (!this.dom.toastContainer) return;  const id = 'toast_' + Math.random().toString(36).substr(2, 9);let icon = '';if(type === 'success') icon = '';if(type === 'danger') icon = '';if(type === 'warning') icon = '';if(type === 'info') icon = '';const toastHTML = <div id="${id}" class="toast align-items-center border-0 shadow-lg mb-2" role="alert" aria-live="assertive" aria-atomic="true"> <div class="toast-header"> ${icon} <strong class="me-auto text-capitalize">${title}</strong> <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button> </div> <div class="toast-body fw-medium"> ${this.sanitizeHTML(message)} </div> </div>;this.dom.toastContainer.insertAdjacentHTML('beforeend', toastHTML);// Manual basic toast logic to avoid requiring Bootstrap JSconst toastEl = document.getElementById(id);// ShowsetTimeout(() => toastEl.classList.add('show'), 10);// Hide and removeconst removeToast = () => {toastEl.classList.remove('show');setTimeout(() => toastEl.remove(), 300);};// Auto hidesetTimeout(removeToast, 4000);// Close buttontoastEl.querySelector('.btn-close').addEventListener('click', removeToast);}/Utility: Shuffles an array in place using Fisher-Yates algorithm.@param {Array} array@returns {Array} Shuffled array*/shuffleArray(array) {for (let i = array.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]];}return array;}/Utility: Sanitizes HTML strings to prevent XSS.@param {string} str Raw string@returns {string} Sanitized string*/sanitizeHTML(str) {if (!str) return '';const temp = document.createElement('div');temp.textContent = str;return temp.innerHTML;}/Injects custom CSS definitions specifically needed for the applicationthat are not covered by standard Bootstrap 5.*/addCSSRules() {if (document.getElementById('lmsCustomStyles')) return;const style = document.createElement('style');style.id = 'lmsCustomStyles';style.textContent = `:root {--lms-sidebar-width: 320px;--lms-transition: all 0.3s ease-in-out;}.cursor-pointer { cursor: pointer; }.transition-all { transition: var(--lms-transition); } /* Animations */
 .animation-fade-in { animation: fadeIn 0.5s ease forwards; }
 .animation-slide-up { animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
 @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

 /* Sidebar Customizations */
 .lms-sidebar { height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
 .sidebar-list::-webkit-scrollbar { width: 6px; }
 .sidebar-list::-webkit-scrollbar-track { background: transparent; }
 .sidebar-list::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
 [data-bs-theme="dark"] .sidebar-list::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); }

 /* Custom Form Check (Quiz Options) */
 .custom-radio { position: relative; }
 .custom-radio.hover-bg-light:hover { background-color: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.2) !important; }
 [data-bs-theme="dark"] .custom-radio.hover-bg-light:hover { background-color: rgba(255,255,255,0.05); }

 /* Navigation States */
 .lesson-nav-item.locked { pointer-events: none; }
 .lesson-nav-item { border-left-color: transparent !important; }
 .lesson-nav-item.active { background-color: var(--bs-primary-bg-subtle) !important; color: var(--bs-primary-text-emphasis) !important; border-left-color: var(--bs-primary) !important; }

 /* Mobile adjustments */
 @media (max-width: 767.98px) {
     .main-content-area { height: calc(100vh - 56px) !important; }
 }
`;document.head.appendChild(style);}}// Bootstrap Initialization Trigger// Ensures the DOM is fully parsed before initializing the LMS Engine.document.addEventListener('DOMContentLoaded', () => {// Only initialize if the target container exists on the pageif (document.getElementById('englishChallenge')) {window.EnglishChallengeApp = new EnglishChallenge();}});
