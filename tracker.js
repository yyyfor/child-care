import {
    db,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
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
        this.editingId = null;

        this.form = document.getElementById('logForm');
        this.startAtInput = document.getElementById('startAt');
        this.durationInput = document.getElementById('duration');
        this.noteInput = document.getElementById('note');
        this.statusMessage = document.getElementById('statusMessage');
        this.recordsList = document.getElementById('recordsList');
        this.submitButton = this.form.querySelector('.submit-btn');
        this.cancelEditButton = document.getElementById('cancelEditBtn');
        this.exportStartInput = document.getElementById('exportStart');
        this.exportEndInput = document.getElementById('exportEnd');
        this.exportAllButton = document.getElementById('exportAllBtn');
        this.exportRangeButton = document.getElementById('exportRangeBtn');

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
        this.setupListActions();
        this.setupEditControls();
        this.setupExportControls();
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
            const durationRaw = this.durationInput.value.trim();
            const durationMinutes = durationRaw === '' ? null : parseInt(durationRaw, 10);
            const note = this.noteInput.value.trim();

            if (!startAtRaw) {
                this.showStatus('请先选择开始时间', 'error');
                return;
            }

            if (durationMinutes !== null && (Number.isNaN(durationMinutes) || durationMinutes < 1 || durationMinutes > 720)) {
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
                note,
                createdAt: serverTimestamp()
            };
            if (durationMinutes !== null) {
                payload.durationMinutes = durationMinutes;
            }

            try {
                this.setSubmitting(true);
                this.showStatus('正在保存到云端，请稍候...', 'info');
                if (this.editingId) {
                    const updatePayload = {
                        type: payload.type,
                        startAtMs: payload.startAtMs,
                        note: payload.note,
                        updatedAt: serverTimestamp()
                    };
                    if (durationMinutes !== null) {
                        updatePayload.durationMinutes = durationMinutes;
                    } else {
                        updatePayload.durationMinutes = null;
                    }

                    const targetDoc = doc(db, COLLECTION_NAME, this.editingId);
                    await updateDoc(targetDoc, updatePayload);
                } else {
                    const sharedRef = collection(db, COLLECTION_NAME);
                    await addDoc(sharedRef, payload);
                }

                this.noteInput.value = '';
                this.durationInput.value = '';
                this.exitEditMode();
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

    setupEditControls() {
        this.cancelEditButton.addEventListener('click', () => {
            this.exitEditMode();
            this.noteInput.value = '';
            this.durationInput.value = '';
            this.showStatus('已取消编辑', 'info');
        });
    }

    setupListActions() {
        this.recordsList.addEventListener('click', async (event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            const id = button.dataset.id;
            if (!id) return;

            if (action === 'edit') {
                this.enterEditMode(id);
                return;
            }

            if (action === 'delete') {
                const confirmed = window.confirm('确认删除这条共享记录吗？');
                if (!confirmed) return;
                try {
                    await deleteDoc(doc(db, COLLECTION_NAME, id));
                    this.showStatus('记录已删除', 'success');
                } catch (error) {
                    console.error('Failed to delete shared record:', error);
                    const reason = error?.code === 'permission-denied'
                        ? '权限不足（Firestore rules）'
                        : `错误：${error?.code || 'unknown'}`;
                    this.showStatus(`删除失败：${reason}`, 'error');
                }
            }
        });
    }

    setupExportControls() {
        this.exportAllButton.addEventListener('click', () => {
            if (!this.records.length) {
                this.showStatus('暂无可导出的记录', 'info');
                return;
            }
            this.exportCsv(this.records, 'shared-baby-logs-all');
            this.showStatus(`已导出 ${this.records.length} 条记录`, 'success');
        });

        this.exportRangeButton.addEventListener('click', () => {
            const startRaw = this.exportStartInput.value;
            const endRaw = this.exportEndInput.value;

            if (!startRaw || !endRaw) {
                this.showStatus('请先填写导出时间范围', 'error');
                return;
            }

            const startMs = new Date(startRaw).getTime();
            const endMs = new Date(endRaw).getTime();

            if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
                this.showStatus('导出时间格式不正确', 'error');
                return;
            }

            if (endMs < startMs) {
                this.showStatus('结束时间不能早于开始时间', 'error');
                return;
            }

            const filtered = this.records.filter((item) => item.startAtMs >= startMs && item.startAtMs <= endMs);
            if (!filtered.length) {
                this.showStatus('该时间范围内没有记录', 'info');
                return;
            }

            this.exportCsv(filtered, 'shared-baby-logs-range');
            this.showStatus(`已按范围导出 ${filtered.length} 条记录`, 'success');
        });
    }

    enterEditMode(id) {
        const target = this.records.find((item) => item.id === id);
        if (!target) return;

        this.editingId = id;
        this.selectedType = target.type || 'feeding';

        document.querySelectorAll('.type-btn').forEach((item) => {
            const active = item.dataset.type === this.selectedType;
            item.classList.toggle('active', active);
            item.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        this.startAtInput.value = this.formatForDatetimeLocal(new Date(target.startAtMs));
        this.durationInput.value = target.durationMinutes ?? '';
        this.noteInput.value = target.note || '';
        this.cancelEditButton.style.display = 'inline-flex';
        this.submitButton.textContent = '保存编辑';
        this.showStatus('正在编辑共享记录，保存后会覆盖原记录', 'info');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    exitEditMode() {
        this.editingId = null;
        this.cancelEditButton.style.display = 'none';
        this.submitButton.textContent = '保存共享记录';
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
        const hasDuration = typeof item.durationMinutes === 'number' && item.durationMinutes > 0;
        const end = hasDuration ? new Date(item.startAtMs + item.durationMinutes * 60000) : null;

        const startText = this.formatDateTime(start);
        const endText = end ? this.formatDateTime(end) : '未填写';
        const duration = hasDuration ? `${item.durationMinutes} 分钟` : '未填写';
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
                    <span>时长：${duration}</span>
                </div>
                ${safeNote ? `<p class="record-note">备注：${safeNote}</p>` : ''}
                <div class="record-actions">
                    <button type="button" class="row-btn" data-action="edit" data-id="${item.id}">编辑</button>
                    <button type="button" class="row-btn delete" data-action="delete" data-id="${item.id}">删除</button>
                </div>
            </article>
        `;
    }

    formatDateTime(date, withYear = false) {
        const options = {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        if (withYear) {
            options.year = 'numeric';
        }
        return date.toLocaleString('zh-CN', options);
    }

    escapeHTML(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    csvEscape(value) {
        const raw = value == null ? '' : String(value);
        return `"${raw.replace(/"/g, '""')}"`;
    }

    exportCsv(rows, filePrefix) {
        const headers = ['类型', '开始时间', '结束时间', '持续时间(分钟)', '备注'];
        const lines = [headers.map((h) => this.csvEscape(h)).join(',')];

        rows.forEach((item) => {
            const cfg = typeConfig[item.type] || typeConfig.feeding;
            const start = new Date(item.startAtMs);
            const hasDuration = typeof item.durationMinutes === 'number' && item.durationMinutes > 0;
            const end = hasDuration ? new Date(item.startAtMs + item.durationMinutes * 60000) : null;

            const row = [
                cfg.label,
                this.formatDateTime(start, true),
                end ? this.formatDateTime(end, true) : '',
                hasDuration ? item.durationMinutes : '',
                item.note || ''
            ];
            lines.push(row.map((value) => this.csvEscape(value)).join(','));
        });

        const bom = '\ufeff';
        const csvContent = bom + lines.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const filename = `${filePrefix}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.csv`;

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    showStatus(text, type) {
        this.statusMessage.textContent = text;
        this.statusMessage.className = `status-message ${type}`;
    }

    setSubmitting(flag) {
        this.isSubmitting = flag;
        this.submitButton.disabled = flag;
        if (flag) {
            this.submitButton.textContent = '保存中...';
        } else if (this.editingId) {
            this.submitButton.textContent = '保存编辑';
        } else {
            this.submitButton.textContent = '保存共享记录';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SharedTracker();
});
