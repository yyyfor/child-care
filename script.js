// Phase Navigation System
class CareGuideNavigator {
    constructor() {
        this.currentPhase = 0;
        this.totalPhases = 6;
        this.phaseButtons = document.querySelectorAll('.phase-button');
        this.phaseSections = document.querySelectorAll('.phase-section');
        this.timelineProgress = document.getElementById('timelineProgress');

        this.init();
    }

    init() {
        // Add click handlers to phase buttons
        this.phaseButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.navigateToPhase(index));
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

        // Set initial state
        this.updateDisplay();

        // Smooth scroll behavior
        this.setupSmoothScroll();
    }

    navigateToPhase(phaseIndex) {
        if (phaseIndex < 0 || phaseIndex >= this.totalPhases) return;

        this.currentPhase = phaseIndex;
        this.updateDisplay();
        this.scrollToContent();
    }

    updateDisplay() {
        // Update phase buttons
        this.phaseButtons.forEach((button, index) => {
            if (index === this.currentPhase) {
                button.classList.add('active');
                button.setAttribute('aria-current', 'true');
            } else {
                button.classList.remove('active');
                button.removeAttribute('aria-current');
            }
        });

        // Update phase sections
        this.phaseSections.forEach((section, index) => {
            if (index === this.currentPhase) {
                section.classList.add('active');
                section.setAttribute('aria-hidden', 'false');
                // Trigger animation by removing and re-adding animation class
                section.style.animation = 'none';
                setTimeout(() => {
                    section.style.animation = '';
                }, 10);
            } else {
                section.classList.remove('active');
                section.setAttribute('aria-hidden', 'true');
            }
        });

        // Update timeline progress bar
        const progressPercentage = ((this.currentPhase + 1) / this.totalPhases) * 100;
        this.timelineProgress.style.width = `${progressPercentage}%`;

        // Update URL hash without scrolling
        history.replaceState(null, null, `#phase-${this.currentPhase + 1}`);
    }

    handleKeyboardNav(e) {
        // Arrow key navigation
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.navigateToPhase(this.currentPhase - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.navigateToPhase(this.currentPhase + 1);
        }
    }

    scrollToContent() {
        // Smooth scroll to main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const offset = 100; // Account for sticky nav
            const elementPosition = mainContent.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    setupSmoothScroll() {
        // Smooth scroll for any internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Check URL hash on page load
    checkInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            const match = hash.match(/phase-(\d+)/);
            if (match) {
                const phaseNum = parseInt(match[1]) - 1;
                if (phaseNum >= 0 && phaseNum < this.totalPhases) {
                    this.navigateToPhase(phaseNum);
                }
            }
        }
    }
}

// Card Animation Observer
class CardAnimationObserver {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, this.observerOptions);

        // Observe all care cards
        document.querySelectorAll('.care-card').forEach(card => {
            observer.observe(card);
        });
    }
}

// Print Functionality Enhancement
class PrintManager {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('beforeprint', () => {
            this.preparePrintView();
        });

        window.addEventListener('afterprint', () => {
            this.restoreNormalView();
        });
    }

    preparePrintView() {
        // Show all phases for printing
        document.querySelectorAll('.phase-section').forEach(section => {
            section.style.display = 'block';
            section.classList.add('printing');
        });

        // Add print timestamp
        this.addPrintTimestamp();
    }

    restoreNormalView() {
        // Restore normal phase visibility
        document.querySelectorAll('.phase-section').forEach((section, index) => {
            section.classList.remove('printing');
            if (!section.classList.contains('active')) {
                section.style.display = 'none';
            }
        });

        // Remove print timestamp
        this.removePrintTimestamp();
    }

    addPrintTimestamp() {
        const timestamp = document.createElement('div');
        timestamp.id = 'print-timestamp';
        timestamp.style.cssText = 'text-align: center; padding: 20px; font-size: 12px; color: #666;';
        timestamp.textContent = `Printed on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`;

        const footer = document.querySelector('.footer .container');
        if (footer) {
            footer.insertBefore(timestamp, footer.firstChild);
        }
    }

    removePrintTimestamp() {
        const timestamp = document.getElementById('print-timestamp');
        if (timestamp) {
            timestamp.remove();
        }
    }
}

// Progress Tracking (Optional - could be used for local storage)
class ProgressTracker {
    constructor() {
        this.storageKey = 'careGuideProgress';
        this.init();
    }

    init() {
        // Check if user wants progress tracking
        const hasVisited = localStorage.getItem(this.storageKey);
        if (!hasVisited) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                firstVisit: new Date().toISOString(),
                phasesViewed: [0],
                lastPhase: 0
            }));
        }
    }

    updateProgress(phaseIndex) {
        const progress = JSON.parse(localStorage.getItem(this.storageKey));
        if (!progress.phasesViewed.includes(phaseIndex)) {
            progress.phasesViewed.push(phaseIndex);
        }
        progress.lastPhase = phaseIndex;
        progress.lastVisit = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    getProgress() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    clearProgress() {
        localStorage.removeItem(this.storageKey);
    }
}

// Accessibility Enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Add ARIA labels
        this.addAriaLabels();

        // Skip to content link
        this.addSkipLink();

        // Focus management
        this.manageFocus();
    }

    addAriaLabels() {
        // Add descriptive labels to interactive elements
        document.querySelectorAll('.phase-button').forEach((button, index) => {
            button.setAttribute('aria-label', `Navigate to phase ${index + 1}: ${button.querySelector('.phase-label').textContent}`);
        });

        // Mark regions
        const main = document.querySelector('.main-content');
        if (main) main.setAttribute('role', 'main');

        const nav = document.querySelector('.timeline-nav');
        if (nav) nav.setAttribute('role', 'navigation');
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-primary);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            z-index: 10000;
        `;
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    manageFocus() {
        // When navigating phases, announce change to screen readers
        const phaseButtons = document.querySelectorAll('.phase-button');
        phaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const activeSection = document.querySelector('.phase-section.active');
                if (activeSection) {
                    const heading = activeSection.querySelector('.phase-title');
                    if (heading) {
                        // Briefly focus heading for screen reader announcement
                        heading.setAttribute('tabindex', '-1');
                        heading.focus();
                        setTimeout(() => {
                            heading.removeAttribute('tabindex');
                        }, 100);
                    }
                }
            });
        });
    }
}

// Reading Time Estimator (Optional Feature)
class ReadingTimeEstimator {
    constructor() {
        this.wordsPerMinute = 200;
        this.init();
    }

    init() {
        // Add reading time estimates to each phase
        document.querySelectorAll('.phase-section').forEach(section => {
            const wordCount = this.countWords(section);
            const readingTime = Math.ceil(wordCount / this.wordsPerMinute);
            this.addReadingTimeBadge(section, readingTime);
        });
    }

    countWords(element) {
        const text = element.textContent || element.innerText;
        return text.trim().split(/\s+/).length;
    }

    addReadingTimeBadge(section, minutes) {
        const badge = document.createElement('span');
        badge.className = 'reading-time-badge';
        badge.textContent = `${minutes} min read`;
        badge.style.cssText = `
            display: inline-block;
            background: rgba(212, 137, 108, 0.1);
            color: var(--color-primary);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            margin-left: 12px;
        `;

        const phaseDescription = section.querySelector('.phase-description');
        if (phaseDescription) {
            phaseDescription.appendChild(badge);
        }
    }
}

// Firebase Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Import Firebase functions
        const { auth, onAuthStateChanged } = await import('./firebase-config.js');
        this.auth = auth;

        // Get DOM elements
        this.authSection = document.getElementById('authSection');
        this.userSection = document.getElementById('userSection');
        this.notesContent = document.getElementById('notesContent');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.userEmail = document.getElementById('userEmail');
        this.authError = document.getElementById('authError');

        if (!this.authSection) return;

        // Set up event listeners
        this.setupEventListeners();

        // Listen for auth state changes
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            this.updateUI();
            if (user && window.notesManager) {
                window.notesManager.setUser(user);
            }
        });
    }

    setupEventListeners() {
        // Login form
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));

        // Signup form
        this.signupForm?.addEventListener('submit', (e) => this.handleSignup(e));

        // Toggle between login and signup
        document.getElementById('showSignup')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.loginForm.style.display = 'none';
            this.signupForm.style.display = 'block';
            this.authError.style.display = 'none';
        });

        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.signupForm.style.display = 'none';
            this.loginForm.style.display = 'block';
            this.authError.style.display = 'none';
        });

        // Sign out button
        document.getElementById('signOutBtn')?.addEventListener('click', () => this.handleSignOut());
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const { signInWithEmailAndPassword } = await import('./firebase-config.js');
            await signInWithEmailAndPassword(this.auth, email, password);
            this.loginForm.reset();
            this.hideError();
        } catch (error) {
            this.showError(error);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupPasswordConfirm').value;

        if (password !== confirmPassword) {
            this.showError({ code: 'auth/password-mismatch' });
            return;
        }

        try {
            const { createUserWithEmailAndPassword } = await import('./firebase-config.js');
            await createUserWithEmailAndPassword(this.auth, email, password);
            this.signupForm.reset();
            this.hideError();
        } catch (error) {
            this.showError(error);
        }
    }

    async handleSignOut() {
        try {
            const { signOut } = await import('./firebase-config.js');
            await signOut(this.auth);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    updateUI() {
        if (this.currentUser) {
            // User is logged in
            this.authSection.style.display = 'none';
            this.userSection.style.display = 'block';
            this.notesContent.style.display = 'block';
            this.userEmail.textContent = this.currentUser.email;
        } else {
            // User is logged out
            this.authSection.style.display = 'block';
            this.userSection.style.display = 'none';
            this.notesContent.style.display = 'none';
        }
    }

    showError(error) {
        const lang = window.languageManager?.getCurrentLanguage() || 'en';
        const t = translations[lang].auth;

        let message = t.errorGeneric;

        switch (error.code) {
            case 'auth/email-already-in-use':
                message = t.errorEmailInUse;
                break;
            case 'auth/invalid-email':
                message = t.errorInvalidEmail;
                break;
            case 'auth/weak-password':
                message = t.errorWeakPassword;
                break;
            case 'auth/wrong-password':
                message = t.errorWrongPassword;
                break;
            case 'auth/user-not-found':
                message = t.errorUserNotFound;
                break;
            case 'auth/password-mismatch':
                message = t.errorPasswordMismatch;
                break;
        }

        this.authError.textContent = message;
        this.authError.style.display = 'block';
    }

    hideError() {
        this.authError.style.display = 'none';
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Notes Manager with Firestore
class NotesManager {
    constructor() {
        this.notes = [];
        this.editingNoteId = null;
        this.currentUser = null;
        this.unsubscribe = null;
        this.init();
    }

    async init() {
        // Get DOM elements
        this.noteForm = document.getElementById('noteForm');
        this.noteTitle = document.getElementById('noteTitle');
        this.noteCategory = document.getElementById('noteCategory');
        this.noteContent = document.getElementById('noteContent');
        this.notesList = document.getElementById('notesList');
        this.noteSearch = document.getElementById('noteSearch');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
        this.emptyState = document.getElementById('emptyState');

        if (!this.noteForm) return;

        // Event listeners
        this.noteForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.noteSearch?.addEventListener('input', (e) => this.handleSearch(e));
        this.cancelEditBtn?.addEventListener('click', () => this.cancelEdit());
    }

    setUser(user) {
        this.currentUser = user;
        if (user) {
            this.loadNotesFromFirestore();
        } else {
            this.notes = [];
            if (this.unsubscribe) {
                this.unsubscribe();
                this.unsubscribe = null;
            }
            this.renderNotes();
        }
    }

    async loadNotesFromFirestore() {
        try {
            const { db, collection, query, orderBy, onSnapshot } = await import('./firebase-config.js');
            const notesRef = collection(db, 'users', this.currentUser.uid, 'notes');
            const q = query(notesRef, orderBy('timestamp', 'desc'));

            // Real-time listener
            this.unsubscribe = onSnapshot(q, (snapshot) => {
                this.notes = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    dateDisplay: doc.data().timestamp?.toDate().toLocaleDateString() || 'N/A'
                }));
                this.renderNotes();
            });
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.currentUser) return;

        const noteData = {
            title: this.noteTitle.value.trim(),
            category: this.noteCategory.value,
            content: this.noteContent.value.trim(),
            timestamp: null // Will be set by serverTimestamp
        };

        try {
            if (this.editingNoteId) {
                // Update existing note
                const { db, doc, updateDoc, serverTimestamp } = await import('./firebase-config.js');
                const noteRef = doc(db, 'users', this.currentUser.uid, 'notes', this.editingNoteId);
                await updateDoc(noteRef, { ...noteData, timestamp: serverTimestamp() });
                this.editingNoteId = null;
                this.cancelEditBtn.style.display = 'none';
            } else {
                // Add new note
                const { db, collection, addDoc, serverTimestamp } = await import('./firebase-config.js');
                const notesRef = collection(db, 'users', this.currentUser.uid, 'notes');
                await addDoc(notesRef, { ...noteData, timestamp: serverTimestamp() });
            }

            this.noteForm.reset();

            // Update save button text
            const submitBtn = this.noteForm.querySelector('button[type="submit"]');
            submitBtn.textContent = submitBtn.dataset.i18n ?
                (window.languageManager?.getCurrentLanguage() === 'zh' ? '保存笔记' : 'Save Note') :
                'Save Note';
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note. Please try again.');
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        this.renderNotes(searchTerm);
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        this.noteTitle.value = note.title;
        this.noteCategory.value = note.category;
        this.noteContent.value = note.content;
        this.editingNoteId = id;
        this.cancelEditBtn.style.display = 'inline-block';

        // Update save button text
        const submitBtn = this.noteForm.querySelector('button[type="submit"]');
        submitBtn.textContent = submitBtn.dataset.i18n ?
            (window.languageManager?.getCurrentLanguage() === 'zh' ? '更新笔记' : 'Update Note') :
            'Update Note';

        // Scroll to form
        this.noteForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async deleteNote(id) {
        const lang = window.languageManager?.getCurrentLanguage() || 'en';
        const confirmMsg = lang === 'zh' ? '确定要删除这条笔记吗？' : 'Are you sure you want to delete this note?';

        if (confirm(confirmMsg)) {
            try {
                const { db, doc, deleteDoc } = await import('./firebase-config.js');
                const noteRef = doc(db, 'users', this.currentUser.uid, 'notes', id);
                await deleteDoc(noteRef);
            } catch (error) {
                console.error('Error deleting note:', error);
                alert('Failed to delete note. Please try again.');
            }
        }
    }

    cancelEdit() {
        this.editingNoteId = null;
        this.noteForm.reset();
        this.cancelEditBtn.style.display = 'none';

        // Reset save button text
        const submitBtn = this.noteForm.querySelector('button[type="submit"]');
        submitBtn.textContent = submitBtn.dataset.i18n ?
            (window.languageManager?.getCurrentLanguage() === 'zh' ? '保存笔记' : 'Save Note') :
            'Save Note';
    }

    renderNotes(searchTerm = '') {
        if (!this.notesList) return;

        let filteredNotes = this.notes;

        // Filter by search term
        if (searchTerm) {
            filteredNotes = this.notes.filter(note =>
                note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm) ||
                note.category.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredNotes.length === 0) {
            if (this.emptyState) {
                this.emptyState.style.display = 'block';
            }
            this.notesList.innerHTML = this.emptyState ? '' : this.getEmptyStateHTML();
            return;
        }

        if (this.emptyState) {
            this.emptyState.style.display = 'none';
        }

        const lang = window.languageManager?.getCurrentLanguage() || 'en';
        const editText = lang === 'zh' ? '编辑' : 'Edit';
        const deleteText = lang === 'zh' ? '删除' : 'Delete';
        const categoryTranslations = {
            general: lang === 'zh' ? '一般' : 'General',
            health: lang === 'zh' ? '健康' : 'Health',
            feeding: lang === 'zh' ? '喂养' : 'Feeding',
            sleep: lang === 'zh' ? '睡眠' : 'Sleep',
            development: lang === 'zh' ? '发育' : 'Development',
            milestone: lang === 'zh' ? '里程碑' : 'Milestone'
        };

        this.notesList.innerHTML = filteredNotes.map(note => `
            <div class="note-card ${note.category}">
                <div class="note-header">
                    <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                    <div class="note-meta">
                        <span class="note-category">${categoryTranslations[note.category] || note.category}</span>
                        <span class="note-date">${note.dateDisplay}</span>
                    </div>
                </div>
                <div class="note-content">${this.escapeHtml(note.content)}</div>
                <div class="note-actions">
                    <button class="note-btn edit" onclick="notesManager.editNote('${note.id}')">${editText}</button>
                    <button class="note-btn delete" onclick="notesManager.deleteNote('${note.id}')">${deleteText}</button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getEmptyStateHTML() {
        const lang = window.languageManager?.getCurrentLanguage() || 'en';
        return `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <h3>${lang === 'zh' ? '还没有笔记' : 'No notes yet'}</h3>
                <p>${lang === 'zh' ? '从上面添加你的第一条笔记开始' : 'Start by adding your first note above'}</p>
            </div>
        `;
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    const navigator = new CareGuideNavigator();
    const printManager = new PrintManager();
    const accessibilityManager = new AccessibilityManager();

    // Optional enhancements
    const cardObserver = new CardAnimationObserver();
    const progressTracker = new ProgressTracker();
    const readingTimeEstimator = new ReadingTimeEstimator();

    // Check for initial hash in URL
    navigator.checkInitialHash();

    // Track phase views
    const originalNavigate = navigator.navigateToPhase.bind(navigator);
    navigator.navigateToPhase = function(phaseIndex) {
        originalNavigate(phaseIndex);
        progressTracker.updateProgress(phaseIndex);
    };

    // Add smooth reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in effect
    document.querySelectorAll('.care-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(card);
    });

    // Initialize language manager (make it global so notes can access it)
    window.languageManager = new LanguageManager();

    // Page Navigator functionality
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');
    const pageNavigator = document.getElementById('pageNavigator');
    const navigatorOverlay = document.getElementById('navigatorOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function openNavigator() {
        pageNavigator.classList.add('active');
        navigatorOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNavigator() {
        pageNavigator.classList.remove('active');
        navigatorOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', openNavigator);
    }

    if (navClose) {
        navClose.addEventListener('click', closeNavigator);
    }

    if (navigatorOverlay) {
        navigatorOverlay.addEventListener('click', closeNavigator);
    }

    // Close navigator when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeNavigator();
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close navigator on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pageNavigator.classList.contains('active')) {
            closeNavigator();
        }
    });

    // Auth Manager (initialize first)
    window.authManager = new AuthManager();

    // Notes Manager (make it global so onclick handlers can access it)
    window.notesManager = new NotesManager();

    console.log('Maternal & Infant Care Guide initialized successfully');
});

// Service Worker Registration (Optional - for offline capability)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable offline capability
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('ServiceWorker registered'))
        //     .catch(err => console.log('ServiceWorker registration failed'));
    });
}
