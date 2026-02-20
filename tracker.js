import {
    db,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp
} from './firebase-config.js';

const COLLECTION_NAME = 'sharedBabyLogs';
const MAX_RECORDS = 200;

const typeConfig = {
    feeding: { label: '喝奶', icon: '🍼' },
    poop: { label: '拉便', icon: '💩' },
    sleep: { label: '睡觉', icon: '😴' }
};

class SharedTracker {
    constructor() {
        this.selectedType = 'feeding';
        this.records = [];
        this.isSubmitting = false;

        this.form = document.getElementById('logForm');
        this.startAtInput = document.getElementById('startAt');
        this.durationInput = document.getElementById('duration');
        this.noteInput = document.getElementById('note');
        this.statusMessage = document.getElementById('statusMessage');
        this.recordsList = document.getElementById('recordsList');
        this.submitButton = this.form.querySelector('.submit-btn');

        this.feedingCount = document.getElementById('feedingCount');
        this.poopCount = document.getElementById('poopCount');
        this.sleepCount = document.getElementById('sleepCount');

        this.init();
    }

    init() {
        this.setDefaultDateTime();
        this.setupTypeButtons();
        this.setupDurationPresets();
        this.setupQuickNow();
        this.setupRefresh();
        this.setupForm();
        this.subscribeRecords();
    }

    setDefaultDateTime() {
        const now = new Date();
        this.startAtInput.value = this.formatForDatetimeLocal(now);
    }

    formatForDatetimeLocal(date) {
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    setupTypeButtons() {
        document.querySelectorAll('.type-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                this.selectedType = btn.dataset.type;
                document.querySelectorAll('.type-btn').forEach((item) => {
                    const active = item === btn;
                    item.classList.toggle('active', active);
                    item.setAttribute('aria-pressed', active ? 'true' : 'false');
                });
            });
        });
    }

    setupDurationPresets() {
        document.querySelectorAll('.preset-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                this.durationInput.value = btn.dataset.minutes;
            });
        });
    }

    setupQuickNow() {
        const setNowBtn = document.getElementById('setNow');
        setNowBtn.addEventListener('click', () => {
            this.startAtInput.value = this.formatForDatetimeLocal(new Date());
        });
    }

    setupRefresh() {
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.addEventListener('click', () => {
            this.showStatus('已刷新', 'success');
            this.render();
        });
    }

    setupForm() {
        this.form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (this.isSubmitting) return;

            const startAtRaw = this.startAtInput.value;
            const durationMinutes = parseInt(this.durationInput.value, 10);
            const note = this.noteInput.value.trim();

            if (!startAtRaw) {
                this.showStatus('请先选择开始时间', 'error');
                return;
            }

            if (!durationMinutes || durationMinutes < 1 || durationMinutes > 720) {
                this.showStatus('持续时间请填写 1-720 分钟', 'error');
                return;
            }

            const startAtDate = new Date(startAtRaw);
            if (Number.isNaN(startAtDate.getTime())) {
                this.showStatus('开始时间格式不正确', 'error');
                return;
            }

            const payload = {
                type: this.selectedType,
                startAtMs: startAtDate.getTime(),
                durationMinutes,
                note,
                createdAt: serverTimestamp()
            };

            try {
                this.setSubmitting(true);
                this.showStatus('正在保存到云端，请稍候...', 'info');
                const sharedRef = collection(db, COLLECTION_NAME);
                await addDoc(sharedRef, payload);
                this.noteInput.value = '';
                this.showStatus('记录已保存到云端，所有用户可见', 'success');
            } catch (error) {
                console.error('Failed to create shared record:', error);
                const reason = error?.code === 'permission-denied'
                    ? '权限不足（Firestore rules）'
                    : `错误：${error?.code || 'unknown'}`;
                this.showStatus(`写入失败：${reason}`, 'error');
            } finally {
                this.setSubmitting(false);
            }
        });
    }

    subscribeRecords() {
        const sharedRef = collection(db, COLLECTION_NAME);
        const q = query(sharedRef, orderBy('startAtMs', 'desc'));

        onSnapshot(
            q,
            (snapshot) => {
                this.records = snapshot.docs.slice(0, MAX_RECORDS).map((docRef) => ({
                    id: docRef.id,
                    pending: docRef.metadata.hasPendingWrites,
                    ...docRef.data()
                }));
                this.render();
            },
            (error) => {
                console.error('Failed to subscribe shared records:', error);
                const reason = error?.code === 'permission-denied'
                    ? '读取被 Firestore rules 拒绝'
                    : `错误：${error?.code || 'unknown'}`;
                this.showStatus(`读取失败：${reason}`, 'error');
                this.recordsList.innerHTML = '<p class="empty-text">暂无可读取的数据</p>';
            }
        );
    }

    render() {
        this.renderSummary();
        this.renderList();
    }

    renderSummary() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const startMs = todayStart.getTime();

        const todayRecords = this.records.filter((item) => item.startAtMs >= startMs);
        const feeding = todayRecords.filter((item) => item.type === 'feeding').length;
        const poop = todayRecords.filter((item) => item.type === 'poop').length;
        const sleep = todayRecords.filter((item) => item.type === 'sleep').length;

        this.feedingCount.textContent = String(feeding);
        this.poopCount.textContent = String(poop);
        this.sleepCount.textContent = String(sleep);
    }

    renderList() {
        if (!this.records.length) {
            this.recordsList.innerHTML = '<p class="empty-text">还没有记录，马上添加第一条吧。</p>';
            return;
        }

        const pendingCount = this.records.filter((item) => item.pending).length;
        if (pendingCount > 0) {
            this.showStatus(`有 ${pendingCount} 条记录正在同步中，请勿立即刷新页面`, 'info');
        }

        this.recordsList.innerHTML = this.records.map((item) => this.recordItemHTML(item)).join('');
    }

    recordItemHTML(item) {
        const cfg = typeConfig[item.type] || typeConfig.feeding;
        const start = new Date(item.startAtMs);
        const end = new Date(item.startAtMs + (item.durationMinutes || 0) * 60000);

        const startText = this.formatDateTime(start);
        const endText = this.formatDateTime(end);
        const duration = item.durationMinutes || 0;
        const safeNote = this.escapeHTML(item.note || '');

        return `
            <article class="record-item">
                <div class="record-top">
                    <span class="record-type">${cfg.icon} ${cfg.label}</span>
                    <span class="record-time">${startText}${item.pending ? ' · 同步中' : ''}</span>
                </div>
                <div class="record-meta">
                    <span>开始：${startText}</span>
                    <span>结束：${endText}</span>
                    <span>时长：${duration} 分钟</span>
                </div>
                ${safeNote ? `<p class="record-note">备注：${safeNote}</p>` : ''}
            </article>
        `;
    }

    formatDateTime(date) {
        return date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    escapeHTML(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    showStatus(text, type) {
        this.statusMessage.textContent = text;
        this.statusMessage.className = `status-message ${type}`;
    }

    setSubmitting(flag) {
        this.isSubmitting = flag;
        this.submitButton.disabled = flag;
        this.submitButton.textContent = flag ? '保存中...' : '保存共享记录';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SharedTracker();
});
