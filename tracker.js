const RUNTIME_API_BASE = window.__BABY_TRACKER_API_BASE__;
const RUNTIME_API_TOKEN = window.__BABY_TRACKER_API_TOKEN__;
const API_BASE_DEFAULT = '/api';
const API_BASE = RUNTIME_API_BASE || localStorage.getItem('babyTrackerApiBase') || API_BASE_DEFAULT;
const API_BEARER_TOKEN = RUNTIME_API_TOKEN || localStorage.getItem('babyTrackerApiToken') || '';
const MAX_RECORDS = 500;

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
        this.loadRecords();

        // Lightweight polling since we no longer use Firestore realtime listeners.
        setInterval(() => this.loadRecords(true), 20000);
    }

    setDefaultDateTime() {
        this.startAtInput.value = this.formatForDatetimeLocal(new Date());
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
        document.getElementById('setNow').addEventListener('click', () => {
            this.startAtInput.value = this.formatForDatetimeLocal(new Date());
        });
    }

    setupRefresh() {
        document.getElementById('refreshBtn').addEventListener('click', async () => {
            await this.loadRecords();
            this.showStatus('已刷新', 'success');
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

            const startAtMs = new Date(startAtRaw).getTime();
            if (Number.isNaN(startAtMs)) {
                this.showStatus('开始时间格式不正确', 'error');
                return;
            }

            const payload = {
                type: this.selectedType,
                startAtMs,
                note
            };
            if (durationMinutes !== null) payload.durationMinutes = durationMinutes;

            try {
                this.setSubmitting(true);
                this.showStatus('正在保存到云端，请稍候...', 'info');

                if (this.editingId) {
                    await this.request(`/shared-logs/${this.editingId}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            ...payload,
                            durationMinutes: durationMinutes === null ? null : durationMinutes
                        })
                    });
                } else {
                    await this.request('/shared-logs', {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                }

                this.noteInput.value = '';
                this.durationInput.value = '';
                this.exitEditMode();
                await this.loadRecords(true);
                this.showStatus('记录已保存到云端，所有用户可见', 'success');
            } catch (error) {
                this.showStatus(`写入失败：${this.humanizeError(error)}`, 'error');
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
                    await this.request(`/shared-logs/${id}`, { method: 'DELETE' });
                    await this.loadRecords(true);
                    this.showStatus('记录已删除', 'success');
                } catch (error) {
                    this.showStatus(`删除失败：${this.humanizeError(error)}`, 'error');
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

    async loadRecords(silent = false) {
        try {
            const resp = await this.request(`/shared-logs?limit=${MAX_RECORDS}`);
            const items = this.extractItems(resp).map((item) => this.normalizeRecord(item));

            this.records = items.sort((a, b) => b.startAtMs - a.startAtMs);
            this.render();
        } catch (error) {
            if (!silent) {
                this.showStatus(`读取失败：${this.humanizeError(error)}`, 'error');
            }
            this.recordsList.innerHTML = '<p class="empty-text">暂无可读取的数据</p>';
        }
    }

    extractItems(payload) {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.items)) return payload.items;
        if (Array.isArray(payload?.data?.items)) return payload.data.items;
        if (payload?.data && Array.isArray(payload.data)) return payload.data;
        return [];
    }

    normalizeRecord(raw) {
        const startAtMs = Number(raw.startAtMs ?? raw.start_at_ms ?? 0);
        const durationRaw = raw.durationMinutes ?? raw.duration_minutes;
        const durationMinutes = durationRaw == null ? null : Number(durationRaw);

        return {
            id: String(raw.id ?? raw._id ?? ''),
            type: raw.type,
            startAtMs,
            durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : null,
            note: raw.note ?? ''
        };
    }

    async request(path, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        if (API_BEARER_TOKEN) {
            headers.Authorization = `Bearer ${API_BEARER_TOKEN}`;
        }

        const response = await fetch(`${API_BASE}${path}`, {
            headers,
            ...options
        });

        const text = await response.text();
        const payload = text ? JSON.parse(text) : null;

        if (!response.ok) {
            const err = new Error(payload?.error?.message || payload?.message || `HTTP ${response.status}`);
            err.status = response.status;
            err.payload = payload;
            throw err;
        }

        return payload;
    }

    humanizeError(error) {
        if (error?.status === 0) return '网络不可达';
        if (error?.status === 400) return '参数不合法';
        if (error?.status === 404) return '接口不存在';
        if (error?.status === 500) return '服务端错误';
        return error?.message || '未知错误';
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

        const summaryText = document.getElementById('todaySummaryText');
        const sleepMinutesText = document.getElementById('todaySleepMinutes');
        const feedingBar = document.getElementById('feedingBar');
        const poopBar = document.getElementById('poopBar');
        const sleepBar = document.getElementById('sleepBar');
        const feedingBarValue = document.getElementById('feedingBarValue');
        const poopBarValue = document.getElementById('poopBarValue');
        const sleepBarValue = document.getElementById('sleepBarValue');

        const totalSleepMinutes = todayRecords
            .filter((item) => item.type === 'sleep' && typeof item.durationMinutes === 'number')
            .reduce((acc, item) => acc + item.durationMinutes, 0);

        const maxCount = Math.max(feeding, poop, sleep, 1);
        feedingBar.style.width = `${(feeding / maxCount) * 100}%`;
        poopBar.style.width = `${(poop / maxCount) * 100}%`;
        sleepBar.style.width = `${(sleep / maxCount) * 100}%`;

        feedingBarValue.textContent = String(feeding);
        poopBarValue.textContent = String(poop);
        sleepBarValue.textContent = String(sleep);

        sleepMinutesText.textContent = `今日累计睡眠：${totalSleepMinutes} 分钟`;

        const total = feeding + poop + sleep;
        if (total === 0) {
            summaryText.textContent = '今天还没有记录，快添加第一条吧。';
        } else {
            summaryText.textContent = `今天共记录 ${total} 次：喂奶 ${feeding} 次、拉便 ${poop} 次、睡觉 ${sleep} 次。`;
        }
    }

    renderList() {
        if (!this.records.length) {
            this.recordsList.innerHTML = '<p class="empty-text">还没有记录，马上添加第一条吧。</p>';
            return;
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
                    <span class="record-time">${startText}</span>
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
        if (withYear) options.year = 'numeric';
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
