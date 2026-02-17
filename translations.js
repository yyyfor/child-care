// Bilingual translations for Maternal & Infant Care Guide
const translations = {
    en: {
        hero: {
            title: "Maternal & Infant Care Guide",
            subtitle: "A comprehensive handbook for parents from pre-pregnancy planning through baby's first 6 months",
            badge1: "Professional Care Planning",
            badge2: "Evidence-Based Guidance",
            badge3: "First-Time Parents"
        },
        nav: {
            phase0: "Pre-pregnancy",
            phase1: "Before Labor",
            phase2: "During Labor",
            phase3: "0-1 Month",
            phase4: "1-3 Months",
            phase5: "3-6 Months",
            notes: "Notes"
        },
        intro: {
            text: "This guide provides structured, actionable guidance for both mother and father through six critical stages from pre-pregnancy through baby's first 6 months. Each phase includes specific responsibilities, safety protocols, required preparations, and professional recommendations often overlooked by first-time parents.",
            printBtn: "Print Guide"
        },
        expert: {
            title: "Care Essentials Snapshot",
            subtitle: "A quick expert reference for urgent red flags, daily care priorities, and parent wellbeing check-ins.",
            reference: "Aligned to CDC urgent maternal warning signs and CDC/AAP infant warning-sign guidance (reviewed February 17, 2026).",
            urgent: {
                title: "Urgent Warning Signs (Seek Care Now)",
                note: "If symptoms are severe, sudden, or worsening, seek emergency care immediately.",
                motherTitle: "Postpartum Mother",
                babyTitle: "Baby (0-6 Months)",
                m1: "Heavy vaginal bleeding that soaks through one or more pads in an hour, or very large clots.",
                m2: "Severe headache, vision changes, chest pain, trouble breathing, or sudden severe swelling.",
                m3: "Fever of 100.4F/38C or higher, especially with chills, foul discharge, or worsening pain.",
                m4: "Thoughts of harming yourself or baby, or severe confusion/panic that feels unsafe.",
                b1: "Breathing difficulty, pauses in breathing, blue/gray color, or unusual limpness.",
                b2: "Fever 100.4F/38C or higher in babies under 3 months.",
                b3: "Poor feeding plus fewer wet diapers, repeated vomiting, or difficult-to-wake behavior.",
                b4: "Seizure-like movement, persistent inconsolable crying, or reduced responsiveness."
            },
            rhythm: {
                title: "Daily Care Rhythm by Stage",
                colStage: "Stage",
                colFocus: "Primary Focus",
                colAction: "Daily Anchor Action",
                r0s: "Before Birth",
                r0f: "Safety prep and realistic support plan",
                r0a: "10-minute evening check-in between parents",
                r1s: "0-1 Month",
                r1f: "Feeding, recovery, and sleep protection",
                r1a: "Track feeds, diapers, and one parent rest block",
                r2s: "1-3 Months",
                r2f: "Pattern building and bonding",
                r2a: "Use one repeatable bedtime routine (bath-book-song)",
                r3s: "3-6 Months",
                r3f: "Developmental play and caregiver consistency",
                r3a: "Schedule floor play, tummy time, and face-to-face talk daily"
            },
            wellbeing: {
                title: "Parent Wellbeing Check-In",
                q1: "Did each parent get at least one uninterrupted rest window today?",
                q2: "Did we ask for help early instead of waiting until burnout?",
                q3: "Did we spend 10 minutes talking about logistics and emotions?",
                q4: "Are feeding expectations matched to baby age, growth, and pediatric advice?",
                q5: "Are any symptoms present that need same-day pediatric or postpartum follow-up?",
                note: "Small daily adjustments prevent bigger stress cycles. Progress matters more than perfection."
            }
        },
        phases: {
            phase0: {
                title: "Pre-pregnancy Preparation",
                description: "Planning and preparing before conception (Months 1-6 before pregnancy)"
            },
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
        notes: {
            title: "My Notes",
            description: "Keep track of important information, milestones, and reminders",
            addNew: "Add New Note",
            titleLabel: "Title",
            titlePlaceholder: "Enter note title...",
            categoryLabel: "Category",
            catGeneral: "General",
            catHealth: "Health",
            catFeeding: "Feeding",
            catSleep: "Sleep",
            catDevelopment: "Development",
            catMilestone: "Milestone",
            contentLabel: "Note",
            contentPlaceholder: "Write your note here...",
            btnSave: "Save Note",
            btnCancel: "Cancel",
            btnEdit: "Edit",
            btnDelete: "Delete",
            searchPlaceholder: "Search notes...",
            emptyTitle: "No notes yet",
            emptyMessage: "Start by adding your first note above",
            deleteConfirm: "Are you sure you want to delete this note?"
        },
        auth: {
            signInTitle: "Sign In to Your Account",
            signInDesc: "Access your notes from any device",
            email: "Email",
            emailPlaceholder: "your@email.com",
            password: "Password",
            passwordPlaceholder: "Your password",
            confirmPassword: "Confirm Password",
            confirmPasswordPlaceholder: "Re-enter password",
            signInBtn: "Sign In",
            signUpBtn: "Create Account",
            signOut: "Sign Out",
            noAccount: "Don't have an account?",
            haveAccount: "Already have an account?",
            signUpLink: "Sign Up",
            signInLink: "Sign In",
            signedInAs: "Signed in as:",
            errorPasswordMismatch: "Passwords do not match",
            errorWeakPassword: "Password should be at least 6 characters",
            errorEmailInUse: "This email is already in use",
            errorInvalidEmail: "Invalid email address",
            errorWrongPassword: "Incorrect password",
            errorUserNotFound: "No account found with this email",
            errorGeneric: "An error occurred. Please try again."
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
            subtitle: "从备孕准备到宝宝6个月的全面育儿手册",
            badge1: "专业护理规划",
            badge2: "循证医学指导",
            badge3: "新手父母必读"
        },
        nav: {
            phase0: "备孕准备",
            phase1: "产前准备",
            phase2: "分娩期间",
            phase3: "出生-1个月",
            phase4: "1-3个月",
            phase5: "3-6个月",
            notes: "笔记"
        },
        intro: {
            text: "本指南为父母双方提供从备孕准备到宝宝出生后六个月期间六个关键阶段的结构化、可操作性指导。每个阶段都包含具体职责、安全须知、必要准备事项，以及新手父母容易忽视的专业建议。",
            printBtn: "打印指南"
        },
        expert: {
            title: "核心照护速览",
            subtitle: "提供紧急风险识别、每日照护重点和父母身心状态自检的专家速查内容。",
            reference: "依据 CDC 产妇紧急警示信号与 CDC/AAP 婴儿警示症状建议整理（审阅日期：2026年2月17日）。",
            urgent: {
                title: "紧急警示信号（需立即就医）",
                note: "若症状严重、突然出现或持续加重，请立即前往急诊或联系急救服务。",
                motherTitle: "产后妈妈",
                babyTitle: "宝宝（0-6个月）",
                m1: "阴道出血量大（1小时内浸透1片或以上卫生巾）或出现较大血块。",
                m2: "严重头痛、视力变化、胸痛、呼吸困难或突发明显水肿。",
                m3: "体温达到或超过38C（100.4F），并伴寒战、异常分泌物或疼痛加重。",
                m4: "出现伤害自己或宝宝的想法，或严重混乱/惊恐并感到不安全。",
                b1: "呼吸困难、呼吸暂停、皮肤发青/发灰，或明显发软无力。",
                b2: "3个月以下婴儿体温达到或超过38C（100.4F）。",
                b3: "进食明显减少且尿布变少，伴反复呕吐或难以唤醒。",
                b4: "疑似抽搐、持续无法安抚的哭闹，或反应明显下降。"
            },
            rhythm: {
                title: "分阶段每日照护节奏",
                colStage: "阶段",
                colFocus: "核心重点",
                colAction: "每日锚点行动",
                r0s: "出生前",
                r0f: "安全准备与可执行的支持计划",
                r0a: "父母每晚进行10分钟沟通",
                r1s: "0-1个月",
                r1f: "喂养、产后恢复与睡眠保护",
                r1a: "记录喂养与尿布，并确保一位照护者有完整休息时段",
                r2s: "1-3个月",
                r2f: "建立规律与亲子联结",
                r2a: "坚持一个可重复的睡前流程（洗澡-读书-唱歌）",
                r3s: "3-6个月",
                r3f: "发育性互动与照护一致性",
                r3a: "每天安排地面游戏、趴卧时间和面对面交流"
            },
            wellbeing: {
                title: "父母状态每日自检",
                q1: "今天父母双方是否都获得至少一次不被打断的休息？",
                q2: "我们是否在精疲力竭前就主动寻求帮助？",
                q3: "我们是否有10分钟讨论了安排与情绪？",
                q4: "当前喂养预期是否与宝宝月龄、生长情况和儿科建议一致？",
                q5: "是否出现需要当天联系儿科或产后随访的症状？",
                note: "每天做一点调整，能避免更大的压力循环。进步比完美更重要。"
            }
        },
        phases: {
            phase0: {
                title: "备孕准备",
                description: "怀孕前的规划和准备（怀孕前1-6个月）"
            },
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
        notes: {
            title: "我的笔记",
            description: "记录重要信息、里程碑和提醒事项",
            addNew: "添加新笔记",
            titleLabel: "标题",
            titlePlaceholder: "输入笔记标题...",
            categoryLabel: "分类",
            catGeneral: "一般",
            catHealth: "健康",
            catFeeding: "喂养",
            catSleep: "睡眠",
            catDevelopment: "发育",
            catMilestone: "里程碑",
            contentLabel: "内容",
            contentPlaceholder: "在这里写下你的笔记...",
            btnSave: "保存笔记",
            btnCancel: "取消",
            btnEdit: "编辑",
            btnDelete: "删除",
            searchPlaceholder: "搜索笔记...",
            emptyTitle: "还没有笔记",
            emptyMessage: "从上面添加你的第一条笔记开始",
            deleteConfirm: "确定要删除这条笔记吗？"
        },
        auth: {
            signInTitle: "登录您的账户",
            signInDesc: "从任何设备访问您的笔记",
            email: "邮箱",
            emailPlaceholder: "your@email.com",
            password: "密码",
            passwordPlaceholder: "您的密码",
            confirmPassword: "确认密码",
            confirmPasswordPlaceholder: "重新输入密码",
            signInBtn: "登录",
            signUpBtn: "创建账户",
            signOut: "退出登录",
            noAccount: "还没有账户？",
            haveAccount: "已有账户？",
            signUpLink: "注册",
            signInLink: "登录",
            signedInAs: "已登录：",
            errorPasswordMismatch: "密码不匹配",
            errorWeakPassword: "密码至少需要6个字符",
            errorEmailInUse: "该邮箱已被使用",
            errorInvalidEmail: "无效的邮箱地址",
            errorWrongPassword: "密码错误",
            errorUserNotFound: "未找到该邮箱对应的账户",
            errorGeneric: "发生错误，请重试。"
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

        // Translate placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            const translation = this.getNestedTranslation(t, key);
            if (translation) {
                element.placeholder = translation;
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
