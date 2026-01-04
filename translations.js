// Bilingual translations for Maternal & Infant Care Guide
const translations = {
    en: {
        hero: {
            title: "Maternal & Infant Care Guide",
            subtitle: "A comprehensive handbook for parents from late pregnancy through baby's first 6 months",
            badge1: "Professional Care Planning",
            badge2: "Evidence-Based Guidance",
            badge3: "First-Time Parents"
        },
        nav: {
            phase1: "Before Labor",
            phase2: "During Labor",
            phase3: "0-1 Month",
            phase4: "1-3 Months",
            phase5: "3-6 Months"
        },
        intro: {
            text: "This guide provides structured, actionable guidance for both mother and father through five critical stages of early parenthood. Each phase includes specific responsibilities, safety protocols, required preparations, and professional recommendations often overlooked by first-time parents.",
            printBtn: "Print Guide"
        },
        phases: {
            phase1: {
                title: "Before Labor",
                description: "Late pregnancy & pre-delivery preparation (Weeks 32-40)"
            },
            phase2: {
                title: "During Labor and Delivery",
                description: "Active labor through immediate postpartum (0-48 hours)"
            },
            phase3: {
                title: "Birth to 1 Month",
                description: "Newborn period - Fourth trimester survival"
            },
            phase4: {
                title: "1 to 3 Months",
                description: "Emerging patterns and early development"
            },
            phase5: {
                title: "3 to 6 Months",
                description: "Established routines and major milestones"
            }
        },
        sections: {
            motherResp: "Mother's Responsibilities",
            fatherResp: "Father's Responsibilities",
            safety: "Safety Considerations",
            items: "Items & Materials to Prepare",
            teaching: "Developmental Activities & Teaching",
            languageDev: "English Language Development",
            motorDev: "Physical & Motor Development",
            brainDev: "Brain & Cognitive Development",
            recommendations: "Additional Professional Recommendations"
        },
        navigator: {
            title: "Quick Navigation",
            caregiving: "Caregiving",
            development: "Development",
            additional: "Additional"
        },
        footer: {
            note: "This guide provides general information based on professional medical knowledge. Always consult your healthcare provider for advice specific to your situation. In case of emergency, call 911 or your local emergency services.",
            attribution: "Maternal & Infant Care Planning Guide | Professional Healthcare Resource for First-Time Parents"
        }
    },
    zh: {
        hero: {
            title: "母婴护理指南",
            subtitle: "从孕晚期到宝宝6个月的全面育儿手册",
            badge1: "专业护理规划",
            badge2: "循证医学指导",
            badge3: "新手父母必读"
        },
        nav: {
            phase1: "产前准备",
            phase2: "分娩期间",
            phase3: "出生-1个月",
            phase4: "1-3个月",
            phase5: "3-6个月"
        },
        intro: {
            text: "本指南为父母双方提供从孕晚期到宝宝出生后六个月期间五个关键阶段的结构化、可操作性指导。每个阶段都包含具体职责、安全须知、必要准备事项，以及新手父母容易忽视的专业建议。",
            printBtn: "打印指南"
        },
        phases: {
            phase1: {
                title: "产前准备",
                description: "孕晚期及产前准备（孕32-40周）"
            },
            phase2: {
                title: "分娩及产后",
                description: "活跃产程至产后即刻（0-48小时）"
            },
            phase3: {
                title: "出生至1个月",
                description: "新生儿期 - 第四孕期生存指南"
            },
            phase4: {
                title: "1至3个月",
                description: "规律初现与早期发展"
            },
            phase5: {
                title: "3至6个月",
                description: "建立常规与重要里程碑"
            }
        },
        sections: {
            motherResp: "母亲的职责",
            fatherResp: "父亲的职责",
            safety: "安全注意事项",
            items: "需要准备的物品和材料",
            teaching: "发育活动与早教",
            languageDev: "英语启蒙",
            motorDev: "运动启蒙",
            brainDev: "大脑开发启蒙",
            recommendations: "额外的专业建议"
        },
        navigator: {
            title: "快速导航",
            caregiving: "护理指导",
            development: "发育启蒙",
            additional: "其他建议"
        },
        footer: {
            note: "本指南提供基于专业医学知识的一般性信息。请务必咨询您的医疗保健提供者，获取针对您具体情况的建议。如遇紧急情况，请拨打120或当地急救电话。",
            attribution: "母婴护理规划指南 | 新手父母专业医疗资源"
        }
    }
};

// Language Manager Class
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
        this.contentTranslations = null;
        this.originalContent = new Map(); // Store original English content
        this.init();
    }

    async init() {
        // Load detailed content translations
        await this.loadContentTranslations();

        // Store original English content before any translation
        this.storeOriginalContent();

        // Set initial language
        this.setLanguage(this.currentLang);

        // Add event listeners to language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    async loadContentTranslations() {
        try {
            const response = await fetch('content-translations.json');
            this.contentTranslations = await response.json();
        } catch (error) {
            console.warn('Could not load content translations:', error);
        }
    }

    storeOriginalContent() {
        // Store all English list content for switching back
        document.querySelectorAll('[data-content]').forEach(element => {
            const key = element.dataset.content;
            this.originalContent.set(key, element.innerHTML);
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update document lang attribute
        document.documentElement.lang = lang;

        // Translate all elements
        this.translatePage();
    }

    translatePage() {
        const t = translations[this.currentLang];

        // Translate UI elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.getNestedTranslation(t, key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Translate detailed content lists
        this.translateDetailedContent();
    }

    translateDetailedContent() {
        if (this.currentLang === 'en') {
            // Restore original English content
            document.querySelectorAll('[data-content]').forEach(element => {
                const key = element.dataset.content;
                const originalHTML = this.originalContent.get(key);
                if (originalHTML) {
                    element.innerHTML = originalHTML;
                }
            });
        } else if (this.currentLang === 'zh' && this.contentTranslations) {
            // Apply Chinese translations
            document.querySelectorAll('[data-content]').forEach(element => {
                const key = element.dataset.content;
                const translation = this.getNestedTranslation(this.contentTranslations, key);

                if (translation && Array.isArray(translation)) {
                    // It's a list of items
                    element.innerHTML = translation.map(item => `<li>${item}</li>`).join('\n                                ');
                }
            });
        }
    }

    getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
    }

    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, LanguageManager };
}
