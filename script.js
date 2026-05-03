// ════════════════════════════════════════════════════════
//  SRMS — Student Result Management System
//  FAST-NUCES Karachi | Spring 2026
//  Technical Focus: Design Pattern Implementation
//  Patterns Applied: Singleton, Factory, Observer, Strategy, MVC
// ════════════════════════════════════════════════════════

// ── SINGLETON PATTERN: Central DataStore ─────────────────
const Store = (() => {
    let _instance = null;
    function createInstance() {
        return {
            students: [
                { id: 'S001', name: 'Ali Khan', dept: 'CS', batch: '2022', pass: '123', email: 'ali@nu.edu.pk' },
                { id: 'S002', name: 'Sara Ahmed', dept: 'SE', batch: '2023', pass: '123', email: 'sara@nu.edu.pk' },
                { id: 'S003', name: 'Zain Abbas', dept: 'AI', batch: '2024', pass: '123', email: 'zain@nu.edu.pk' },
                { id: 'S004', name: 'Ayesha Malik', dept: 'DS', batch: '2022', pass: '123', email: 'ayesha@nu.edu.pk' },
                { id: 'S005', name: 'Bilal Raza', dept: 'CS', batch: '2023', pass: '123', email: 'bilal@nu.edu.pk' },
                { id: 'S006', name: 'Dua Fatima', dept: 'SE', batch: '2024', pass: '123', email: 'dua@nu.edu.pk' },
            ],
            courses: [
                { id: 'CS101', name: 'Programming Fundamentals', credits: 3, dept: 'CS' },
                { id: 'SE301', name: 'Software Engineering', credits: 3, dept: 'SE' },
                { id: 'AI401', name: 'Artificial Intelligence', credits: 4, dept: 'AI' },
                { id: 'DB201', name: 'Database Systems', credits: 3, dept: 'CS' },
                { id: 'ENG11', name: 'English Composition', credits: 2, dept: 'GEN' },
                { id: 'OS501', name: 'Operating Systems', credits: 3, dept: 'CS' },
            ],
            results: [
                { studentId: 'S001', courseId: 'CS101', marks: 95, semester: 'Spring 2025' },
                { studentId: 'S001', courseId: 'AI401', marks: 92, semester: 'Spring 2025' },
                { studentId: 'S001', courseId: 'SE301', marks: 88, semester: 'Fall 2025' },
                { studentId: 'S002', courseId: 'CS101', marks: 88, semester: 'Spring 2025' },
                { studentId: 'S002', courseId: 'DB201', marks: 79, semester: 'Fall 2025' },
                { studentId: 'S003', courseId: 'AI401', marks: 75, semester: 'Fall 2025' },
                { studentId: 'S003', courseId: 'CS101', marks: 68, semester: 'Spring 2025' },
                { studentId: 'S004', courseId: 'SE301', marks: 91, semester: 'Fall 2025' },
                { studentId: 'S004', courseId: 'DB201', marks: 85, semester: 'Spring 2025' },
                { studentId: 'S005', courseId: 'CS101', marks: 45, semester: 'Spring 2025' },
                { studentId: 'S005', courseId: 'AI401', marks: 58, semester: 'Fall 2025' },
                { studentId: 'S006', courseId: 'ENG11', marks: 82, semester: 'Fall 2025' },
            ]
        };
    }
    return {
        getInstance() { if (!_instance) _instance = createInstance(); return _instance; }
    };
})();

// ── STRATEGY PATTERN: Pluggable Grading System ───────────
const GradingStrategy = {
    standard: marks => {
        if (marks >= 90) return { grade: 'A+', gpa: 4.0, cls: 'badge-a', color: '#34d399' };
        if (marks >= 80) return { grade: 'A', gpa: 3.7, cls: 'badge-a', color: '#34d399' };
        if (marks >= 70) return { grade: 'B', gpa: 3.0, cls: 'badge-b', color: '#60a5fa' };
        if (marks >= 60) return { grade: 'C', gpa: 2.0, cls: 'badge-c', color: '#fbbf24' };
        if (marks >= 50) return { grade: 'D', gpa: 1.0, cls: 'badge-c', color: '#f97316' };
        return { grade: 'F', gpa: 0.0, cls: 'badge-f', color: '#f87171' };
    }
};
let activeStrategy = GradingStrategy.standard; // swappable

// ── FACTORY PATTERN: Object creation ─────────────────────
const RecordFactory = {
    student: (id, name, dept, batch, pass, email) => ({ id, name, dept, batch, pass, email }),
    course: (id, name, credits, dept) => ({ id, name, credits: +credits, dept }),
    result: (studentId, courseId, marks, semester) => ({ studentId, courseId, marks: +marks, semester })
};

// ── OBSERVER PATTERN: Event bus ──────────────────────────
const EventBus = (() => {
    const listeners = {};
    return {
        on(event, cb) { (listeners[event] = listeners[event] || []).push(cb); },
        emit(event, data) { (listeners[event] || []).forEach(cb => cb(data)); }
    };
})();

// Subscribe: re-render active page on any data change
EventBus.on('dataChanged', () => {
    updateStats();
    const active = document.querySelector('.page.active')?.id?.replace('page-', '');
    if (active === 'dashboard') renderDashboard();
    if (active === 'students') renderStudentsTable();
    if (active === 'rankings') renderRankings();
    if (active === 'courses') renderCourses();
    if (active === 'results') renderResultsTable();
});

// ── MVC: CONTROLLER helpers ───────────────────────────────
const db = () => Store.getInstance();
const studentById = id => db().students.find(s => s.id === id) || {};
const courseById = id => db().courses.find(c => c.id === id) || {};
const resultsOf = sid => db().results.filter(r => r.studentId === sid);

function calcGPA(sid) {
    const rs = resultsOf(sid);
    if (!rs.length) return null;
    return (rs.reduce((a, r) => a + activeStrategy(r.marks).gpa, 0) / rs.length).toFixed(2);
}

function progBar(marks) {
    const color = marks >= 80 ? '#10b981' : marks >= 60 ? '#f59e0b' : '#ef4444';
    return `<div class="prog-wrap">
    <div class="prog"><div class="prog-fill" style="width:${marks}%;background:${color}"></div></div>
    <span style="font-size:.82rem;font-weight:600;min-width:28px">${marks}</span>
  </div>`;
}

// ── LOGIN ─────────────────────────────────────────────────
let currentUser = null;

document.getElementById('date-display').textContent =
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('login-overlay').style.display !== 'none') checkLogin();
});

function checkLogin() {
    const user = document.getElementById('username').value.trim().toUpperCase();
    const pass = document.getElementById('password').value.trim();
    if (user === 'ADMIN' && pass === 'admin123') { loginSuccess('admin', 'System Admin', 'Administrator'); return; }
    const s = db().students.find(x => x.id === user && x.pass === pass);
    if (s) loginSuccess(s.id, s.name, s.dept + ' · Student');
    else toast('Invalid credentials. Try admin/admin123 or S001/123', 'error');
}

function loginSuccess(id, name, role) {
    currentUser = id;
    const isAdmin = id === 'admin';
    document.body.className = isAdmin ? '' : 'student-mode';
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('app-sidebar').style.display = 'flex';
    document.getElementById('app-content').style.display = 'block';
    document.getElementById('welcome-heading').textContent = 'Welcome, ' + name.split(' ')[0] + '!';
    document.getElementById('user-display').textContent = name;
    document.getElementById('user-avatar').textContent = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('role-label').textContent = isAdmin ? 'Administrator' : 'Student Portal';
    document.querySelectorAll('.admin-only').forEach(el =>
        el.style.display = isAdmin ? (el.classList.contains('nav-item') ? 'flex' : 'inline-flex') : 'none'
    );
    navigate('dashboard');
    toast('Welcome back, ' + name.split(' ')[0] + '! 👋', 'success');
}

function logout() {
    currentUser = null;
    document.body.className = '';
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('app-sidebar').style.display = 'none';
    document.getElementById('app-content').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('welcome-heading').textContent = 'Welcome Back';
    document.getElementById('user-display').textContent = 'User';
    document.getElementById('user-avatar').textContent = '?';
    document.getElementById('role-label').textContent = 'Loading...';
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-dashboard').classList.add('active');
    document.querySelectorAll('.nav-item[data-page]').forEach(i => i.classList.remove('active'));
    document.querySelector('[data-page="dashboard"]')?.classList.add('active');
}

// ── NAVIGATION ────────────────────────────────────────────
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-page]').forEach(i => i.classList.remove('active'));
    document.getElementById('page-' + page)?.classList.add('active');
    document.querySelector('[data-page="' + page + '"]')?.classList.add('active');
    if (page === 'dashboard') renderDashboard();
    if (page === 'students') renderStudentsTable();
    if (page === 'rankings') renderRankings();
    if (page === 'courses') renderCourses();
    if (page === 'results') { populateDropdowns(); renderResultsTable(); }
    if (page === 'transcript') renderTranscriptPage();
}

// ── MVC VIEW: DASHBOARD ────────────────────────────────────
function renderDashboard() {
    const d = db(), isAdmin = currentUser === 'admin';
    const res = isAdmin ? d.results : d.results.filter(r => r.studentId === currentUser);

    document.getElementById('stat-students').textContent = isAdmin ? d.students.length : res.length;
    document.getElementById('stat-students-label').textContent = isAdmin ? 'Total Students' : 'My Results';
    document.getElementById('stat-courses').textContent = d.courses.length;
    document.getElementById('stat-results').textContent = d.results.length;
    document.getElementById('avg-label').textContent = isAdmin ? 'Class Avg GPA' : 'My GPA';
    const avgGPA = res.length ? (res.reduce((s, r) => s + activeStrategy(r.marks).gpa, 0) / res.length).toFixed(2) : '0.00';
    document.getElementById('stat-avg').textContent = avgGPA;

    const recent = [...res].reverse().slice(0, 6);
    document.getElementById('recent-results-tbody').innerHTML = recent.length
        ? recent.map(r => {
            const s = studentById(r.studentId), c = courseById(r.courseId), g = activeStrategy(r.marks);
            return `<tr>
          <td><strong>${s.name || r.studentId}</strong></td>
          <td>${c.name || r.courseId}</td>
          <td>${progBar(r.marks)}</td>
          <td><span class="badge ${g.cls}">${g.grade} · ${r.marks >= 50 ? 'Pass' : 'Fail'}</span></td>
        </tr>`;
        }).join('')
        : `<tr><td colspan="4" class="empty-state"><i class="fas fa-inbox"></i>No results yet</td></tr>`;
}

function updateStats() {
    const d = db();
    document.getElementById('stat-courses').textContent = d.courses.length;
    document.getElementById('stat-results').textContent = d.results.length;
    if (currentUser === 'admin') document.getElementById('stat-students').textContent = d.students.length;
}

// ── MVC VIEW: STUDENTS TABLE ──────────────────────────────
function renderStudentsTable() {
    const q = (document.getElementById('student-search')?.value || '').toLowerCase();
    const students = db().students.filter(s =>
        !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
    const tbody = document.getElementById('students-tbody');
    if (!students.length) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state"><i class="fas fa-search"></i>No students found</td></tr>`;
        return;
    }
    tbody.innerHTML = students.map((s, i) => {
        const gpa = calcGPA(s.id);
        const gpaColor = gpa ? (parseFloat(gpa) >= 3.5 ? '#34d399' : parseFloat(gpa) >= 2.5 ? '#60a5fa' : '#f59e0b') : '#64748b';
        const numRes = resultsOf(s.id).length;
        return `<tr>
      <td style="color:var(--dim);font-weight:600">${i + 1}</td>
      <td><span class="badge badge-b">${s.id}</span></td>
      <td>
        <strong>${s.name}</strong>
        <small style="display:block;color:var(--dim);font-size:.75rem">${s.email || ''}</small>
      </td>
      <td><span class="badge badge-b">${s.dept}</span></td>
      <td>${s.batch}</td>
      <td style="color:var(--muted)">${numRes} result${numRes !== 1 ? 's' : ''}</td>
      <td><strong style="color:${gpaColor};font-size:1.05rem">${gpa || '—'}</strong></td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn-ghost btn-sm" onclick="viewStudentTranscript('${s.id}')" title="View Transcript">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-primary btn-sm" onclick="quickAddResult('${s.id}')" title="Add Marks">
            <i class="fas fa-plus"></i> Marks
          </button>
          <button class="btn-danger btn-sm" onclick="askDelete('student','${s.id}','${s.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`;
    }).join('');
}

// ── MVC VIEW: RANKINGS ────────────────────────────────────
function renderRankings() {
    const dept = document.getElementById('rank-dept-filter')?.value || '';
    const d = db();
    const students = d.students.filter(s => !dept || s.dept === dept);
    const ranked = students
        .map(s => ({ ...s, gpa: parseFloat(calcGPA(s.id)) || 0, numCourses: resultsOf(s.id).length }))
        .sort((a, b) => b.gpa - a.gpa);

    const tbody = document.getElementById('rankings-tbody');
    if (!ranked.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fas fa-trophy"></i>No students found</td></tr>`;
        return;
    }
    tbody.innerHTML = ranked.map((s, i) => {
        const rc = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
        const medal = i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : '';
        const gpaColor = s.gpa >= 3.5 ? '#34d399' : s.gpa >= 2.5 ? '#60a5fa' : s.gpa > 0 ? '#f59e0b' : '#94a3b8';
        return `<tr>
      <td><span class="rank-circle ${rc}">${i + 1}</span></td>
      <td>
        <strong>${medal}${s.name}</strong>
        <small style="display:block;color:var(--dim);font-size:.75rem">${s.id}</small>
      </td>
      <td>${s.dept}</td>
      <td>${s.batch}</td>
      <td style="color:var(--muted)">${s.numCourses}</td>
      <td><strong style="color:${gpaColor};font-size:1.1rem">${s.gpa > 0 ? s.gpa.toFixed(2) : '—'}</strong></td>
    </tr>`;
    }).join('');
}

// ── MVC VIEW: COURSES ─────────────────────────────────────
function renderCourses() {
    const d = db();
    document.getElementById('courses-tbody').innerHTML = d.courses.map(c => {
        const rs = d.results.filter(r => r.courseId === c.id);
        const avg = rs.length ? Math.round(rs.reduce((a, r) => a + r.marks, 0) / rs.length) : 0;
        return `<tr>
      <td><span class="badge badge-b">${c.id}</span></td>
      <td><strong>${c.name}</strong></td>
      <td><span style="color:var(--muted)">${c.credits} CH</span></td>
      <td style="color:var(--muted)">${rs.length} students</td>
      <td>${rs.length ? progBar(avg) : '<span style="color:var(--dim)">—</span>'}</td>
    </tr>`;
    }).join('');
}

// ── MVC VIEW: RESULTS TABLE ───────────────────────────────
function renderResultsTable() {
    const q = (document.getElementById('result-search')?.value || '').toLowerCase();
    const d = db();
    const results = d.results.filter(r => {
        const s = studentById(r.studentId), c = courseById(r.courseId);
        return !q || (s.name || '').toLowerCase().includes(q)
            || (c.name || '').toLowerCase().includes(q)
            || (r.semester || '').toLowerCase().includes(q);
    });
    const tbody = document.getElementById('results-tbody');
    if (!results.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fas fa-clipboard"></i>No results found</td></tr>`;
        return;
    }
    tbody.innerHTML = results.map(r => {
        const realIdx = d.results.indexOf(r);
        const s = studentById(r.studentId), c = courseById(r.courseId), g = activeStrategy(r.marks);
        return `<tr>
      <td>
        <strong>${s.name || r.studentId}</strong>
        <small style="display:block;color:var(--dim)">${s.id}</small>
      </td>
      <td>
        ${c.name || r.courseId}
        <small style="display:block;color:var(--dim)">${r.semester || ''}</small>
      </td>
      <td>${progBar(r.marks)}</td>
      <td><span class="badge ${g.cls}">${g.grade}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn-ghost btn-sm" onclick="openEditResult(${realIdx})"><i class="fas fa-edit"></i></button>
          <button class="btn-danger btn-sm" onclick="askDelete('result',${realIdx},'this result')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
    }).join('');
}

// ── MVC VIEW: TRANSCRIPT ──────────────────────────────────
function renderTranscriptPage() {
    const isAdmin = currentUser === 'admin';
    if (!isAdmin) { renderTranscript(currentUser); return; }
    // Admin: show student selector
    const d = db();
    document.getElementById('transcript-view').innerHTML = `
    <div class="content-card">
      <div class="card-header"><h3><i class="fas fa-file-invoice"></i> View Student Transcript</h3></div>
      <div style="max-width:360px">
        <div style="margin-bottom:14px;font-size:.82rem;color:var(--dim)">Select a student to view their academic transcript</div>
        <select id="ts-select" class="filter-select" style="width:100%;padding:11px 14px;margin-bottom:14px;font-size:.88rem">
          <option value="">-- Choose Student --</option>
          ${d.students.map(s => `<option value="${s.id}">${s.name} (${s.id}) · ${s.dept}</option>`).join('')}
        </select><br>
        <button class="btn-primary" onclick="renderTranscript(document.getElementById('ts-select').value)">
          <i class="fas fa-eye"></i> View Transcript
        </button>
      </div>
    </div>`;
}

function renderTranscript(sid) {
    if (!sid) { toast('Please select a student', 'warn'); return; }
    const student = studentById(sid);
    if (!student.id) { toast('Student not found', 'error'); return; }
    const d = db();
    const res = resultsOf(sid);
    const gpa = res.length
        ? (res.reduce((s, r) => s + activeStrategy(r.marks).gpa, 0) / res.length).toFixed(2)
        : '0.00';
    const avg = res.length ? Math.round(res.reduce((a, r) => a + r.marks, 0) / res.length) : 0;
    const isAdmin = currentUser === 'admin';

    document.getElementById('transcript-view').innerHTML = `
    <div class="content-card">
      <div class="card-header">
        <h3><i class="fas fa-file-invoice"></i> Academic Transcript</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn-ghost" onclick="downloadCSV('${sid}')"><i class="fas fa-download"></i> Export CSV</button>
          ${isAdmin ? `<button class="btn-primary btn-sm" onclick="quickAddResult('${sid}')"><i class="fas fa-plus"></i> Add Marks</button>` : ''}
          ${isAdmin ? `<button class="btn-ghost btn-sm" onclick="renderTranscriptPage()"><i class="fas fa-arrow-left"></i> Back</button>` : ''}
        </div>
      </div>
      <div class="transcript-header">
        <div><p>Student Name</p><h4>${student.name}</h4></div>
        <div><p>Student ID</p><h4>${student.id}</h4></div>
        <div><p>Department</p><h4>${student.dept}</h4></div>
        <div><p>Batch</p><h4>${student.batch}</h4></div>
      </div>
      <table>
        <thead><tr><th>Course</th><th>Code</th><th>Semester</th><th>Marks</th><th>Grade</th><th>GPA Pts</th></tr></thead>
        <tbody>
          ${res.length ? res.map(r => {
        const c = courseById(r.courseId), g = activeStrategy(r.marks);
        return `<tr>
              <td>${c.name || r.courseId}</td>
              <td><span class="badge badge-b">${r.courseId}</span></td>
              <td style="color:var(--dim);font-size:.8rem">${r.semester || '—'}</td>
              <td>${progBar(r.marks)}</td>
              <td><span class="badge ${g.cls}">${g.grade}</span></td>
              <td><strong>${g.gpa.toFixed(1)}</strong></td>
            </tr>`;
    }).join('')
            : `<tr><td colspan="6" class="empty-state"><i class="fas fa-inbox"></i>No results recorded yet</td></tr>`}
        </tbody>
      </table>
      <div class="gpa-summary">
        <div>
          <h3>Cumulative GPA</h3>
          <p style="color:var(--dim);font-size:.8rem;margin-top:4px">${res.length} course${res.length !== 1 ? 's' : ''} · Average ${avg}%</p>
        </div>
        <span class="gpa-num">${gpa}</span>
      </div>
    </div>`;
}

function viewStudentTranscript(sid) {
    navigate('transcript');
    renderTranscript(sid);
}

// ── DROPDOWNS ─────────────────────────────────────────────
function populateDropdowns() {
    const d = db();
    document.getElementById('r-student').innerHTML = d.students.map(s =>
        `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
    document.getElementById('r-course').innerHTML = d.courses.map(c =>
        `<option value="${c.id}">${c.name}</option>`).join('');
}

function openModalResult() { populateDropdowns(); openModal('modal-add-result'); }

// ── CRUD — ADD STUDENT ────────────────────────────────────
function doAddStudent() {
    const id = document.getElementById('s-id').value.trim().toUpperCase();
    const name = document.getElementById('s-name').value.trim();
    const pass = document.getElementById('s-pass').value.trim();
    const dept = document.getElementById('s-dept').value;
    const batch = document.getElementById('s-batch').value.trim() || '2026';
    const email = document.getElementById('s-email').value.trim();

    if (!id || !name || !pass) {
        toast('ID, Name and Password are required', 'error');
        return;
    }

    // Validation: Prevent duplicate IDs so login remains unique
    if (db().students.find(s => s.id === id)) {
        toast('Student ID already exists!', 'error');
        return;
    }

    // Push to the Singleton Store
    db().students.push(RecordFactory.student(id, name, dept, batch, pass, email));

    closeModal('modal-add-student');

    // Reset form fields
    ['s-id', 's-name', 's-pass', 's-batch', 's-email'].forEach(x => document.getElementById(x).value = '');

    toast(`✅ Student "${name}" added! Login: ${id} / ${pass}`, 'success');

    // CRITICAL: Refresh all views and dropdowns
    renderStudentsTable();
    renderRankings();
    populateDropdowns(); // Updates the Result section dropdown
    EventBus.emit('dataChanged'); // Triggers the Observer pattern to update dashboard
}

// ── CRUD — ADD COURSE ─────────────────────────────────────
function doAddCourse() {
    const id = document.getElementById('c-id').value.trim().toUpperCase();
    const name = document.getElementById('c-name').value.trim();
    const credits = document.getElementById('c-credits').value;
    const dept = document.getElementById('c-dept').value;
    if (!id || !name) { toast('Course ID and Name are required', 'error'); return; }
    if (db().courses.find(c => c.id === id)) { toast('Course ID already exists!', 'error'); return; }
    db().courses.push(RecordFactory.course(id, name, credits, dept));
    closeModal('modal-add-course');
    ['c-id', 'c-name'].forEach(x => document.getElementById(x).value = '');
    toast(`Course "${name}" added!`, 'success');
    EventBus.emit('dataChanged');
}

// ── CRUD — ADD RESULT ─────────────────────────────────────
function doAddResult() {
    const studentId = document.getElementById('r-student').value;
    const courseId = document.getElementById('r-course').value;
    const marks = parseInt(document.getElementById('r-marks').value);
    const semester = document.getElementById('r-semester').value.trim() || 'Spring 2026';
    if (!studentId || !courseId || isNaN(marks) || marks < 0 || marks > 100) {
        toast('All fields required. Marks must be 0–100', 'error'); return;
    }
    const d = db();
    const existing = d.results.find(r => r.studentId === studentId && r.courseId === courseId && r.semester === semester);
    if (existing) {
        existing.marks = marks;
        toast('Result updated! Grade: ' + activeStrategy(marks).grade, 'warn');
    } else {
        d.results.push(RecordFactory.result(studentId, courseId, marks, semester));
        toast('Result saved! Grade: ' + activeStrategy(marks).grade, 'success');
    }
    closeModal('modal-add-result');
    document.getElementById('r-marks').value = '';
    document.getElementById('grade-preview').className = 'grade-preview';
    // Refresh rankings immediately since GPA changed
    renderRankings();
    renderStudentsTable();
    EventBus.emit('dataChanged');
}

function quickAddResult(sid) {
    populateDropdowns();
    document.getElementById('r-student').value = sid;
    openModal('modal-add-result');
}

function previewGrade() {
    const m = parseInt(document.getElementById('r-marks').value);
    const el = document.getElementById('grade-preview');
    if (!isNaN(m) && m >= 0 && m <= 100) {
        const g = activeStrategy(m);
        el.innerHTML = `Grade: <strong style="color:${g.color}">${g.grade}</strong> &nbsp;|&nbsp; GPA: <strong>${g.gpa}</strong> &nbsp;|&nbsp; <strong>${m >= 50 ? '✓ Pass' : '✗ Fail'}</strong>`;
        el.className = 'grade-preview show';
    } else { el.className = 'grade-preview'; }
}

// ── CRUD — EDIT RESULT ────────────────────────────────────
function openEditResult(idx) {
    document.getElementById('edit-r-idx').value = idx;
    document.getElementById('edit-r-marks').value = db().results[idx].marks;
    openModal('modal-edit-result');
}

function doEditResult() {
    const idx = parseInt(document.getElementById('edit-r-idx').value);
    const marks = parseInt(document.getElementById('edit-r-marks').value);
    if (isNaN(marks) || marks < 0 || marks > 100) { toast('Marks must be 0–100', 'error'); return; }
    db().results[idx].marks = marks;
    closeModal('modal-edit-result');
    toast('Result updated! New grade: ' + activeStrategy(marks).grade, 'success');
    renderRankings();
    renderStudentsTable();
    EventBus.emit('dataChanged');
}

// ── CRUD — DELETE ─────────────────────────────────────────
let _deleteTarget = null;
function askDelete(type, id, label) {
    _deleteTarget = { type, id };
    document.getElementById('confirm-msg').innerHTML = `Delete <strong>${label}</strong>? This cannot be undone.`;
    openModal('modal-confirm');
}
function doConfirmDelete() {
    if (!_deleteTarget) return;
    const { type, id } = _deleteTarget;
    const d = db();
    if (type === 'student') {
        d.students = d.students.filter(s => s.id !== id);
        d.results = d.results.filter(r => r.studentId !== id);
        toast('Student deleted.', 'warn');
        renderStudentsTable();
        renderRankings();
    } else if (type === 'result') {
        d.results.splice(id, 1);
        toast('Result deleted.', 'warn');
        renderResultsTable();
        renderRankings();
    }
    closeModal('modal-confirm');
    _deleteTarget = null;
    EventBus.emit('dataChanged');
}

// ── CSV EXPORT ────────────────────────────────────────────
function downloadCSV(id) {
    const s = studentById(id);
    const res = resultsOf(id);
    const gpa = res.length
        ? (res.reduce((a, r) => a + activeStrategy(r.marks).gpa, 0) / res.length).toFixed(2)
        : '0.00';
    let csv = `Student Name,${s.name}\nID,${s.id}\nDept,${s.dept}\nBatch,${s.batch}\n\n`;
    csv += 'Course,Code,Semester,Marks,Grade,GPA Points\n';
    res.forEach(r => {
        const c = courseById(r.courseId), g = activeStrategy(r.marks);
        csv += `"${c.name || r.courseId}",${r.courseId},${r.semester || ''},${r.marks},${g.grade},${g.gpa}\n`;
    });
    csv += `\nCGPA,${gpa}`;
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    a.download = `Transcript_${id}.csv`;
    a.click();
}

// ── MODALS ────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
document.querySelectorAll('.modal-overlay').forEach(o =>
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('show'); })
);

// ── TOAST ─────────────────────────────────────────────────
function toast(msg, type = 'success') {
    const icons = { success: '✅', error: '❌', warn: '⚠️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${msg}`;
    document.getElementById('toast-wrap').appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; }, 2800);
    setTimeout(() => el.remove(), 3100);
}