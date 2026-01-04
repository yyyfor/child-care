// Phase Navigation System
class CareGuideNavigator {
    constructor() {
        this.currentPhase = 0;
        this.totalPhases = 5;
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

    // Initialize language manager
    const languageManager = new LanguageManager();

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
