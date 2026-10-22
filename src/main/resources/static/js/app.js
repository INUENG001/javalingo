(() => {
  'use strict';

  const CONFIG = window.JAVAWAVE_CONFIG || {};
  const hasSupabaseConfig = Boolean(
    window.supabase && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_PUBLISHABLE_KEY &&
    CONFIG.SUPABASE_URL.startsWith('https://') && !CONFIG.SUPABASE_URL.includes('YOUR_PROJECT') &&
    !CONFIG.SUPABASE_PUBLISHABLE_KEY.includes('YOUR_')
  );
  const supabase = hasSupabaseConfig
    ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_PUBLISHABLE_KEY)
    : null;

  const FALLBACK_LESSONS = [
    { id: 'java-basics', title: 'เริ่มต้นกับ Java', subtitle: 'Hello, Java!', description: 'รู้จักโครงสร้างโปรแกรมและคำสั่งแสดงผล', icon: '☕', level: 'เริ่มต้น', order: 1, totalQuestions: 5, xpReward: 25 },
    { id: 'variables', title: 'ตัวแปรและชนิดข้อมูล', subtitle: 'เก็บข้อมูลให้เป็น', description: 'ฝึกใช้ int, double, String และ boolean', icon: '🧩', level: 'เริ่มต้น', order: 2, totalQuestions: 5, xpReward: 30 },
    { id: 'conditions', title: 'เงื่อนไข if / else', subtitle: 'ให้โปรแกรมตัดสินใจ', description: 'ใช้เงื่อนไขเพื่อเลือกเส้นทางการทำงาน', icon: '🔀', level: 'พื้นฐาน', order: 3, totalQuestions: 5, xpReward: 35 },
    { id: 'loops', title: 'ลูป for และ while', subtitle: 'ทำซ้ำอย่างฉลาด', description: 'เรียนรู้การทำซ้ำและควบคุมรอบลูป', icon: '🔁', level: 'พื้นฐาน', order: 4, totalQuestions: 5, xpReward: 40 },
    { id: 'oop-classes', title: 'คลาสและออบเจ็กต์', subtitle: 'หัวใจของ OOP', description: 'สร้าง class, object, field และ method', icon: '🏗️', level: 'OOP', order: 5, totalQuestions: 5, xpReward: 50 },
    { id: 'oop-inheritance', title: 'การสืบทอดและ Polymorphism', subtitle: 'ต่อยอดคลาสให้ทรงพลัง', description: 'ฝึก extends, override และ polymorphism', icon: '🧬', level: 'OOP', order: 6, totalQuestions: 5, xpReward: 60 }
  ];

  const QUIZZES = {
    'java-basics': [
      { q: 'Java ใช้คำสั่งใดเพื่อแสดงข้อความบนหน้าจอ?', code: 'System.out.____("Hello Java");', options: ['printLine', 'println', 'echo', 'display'], answer: 1, explain: 'System.out.println() ใช้แสดงข้อความและขึ้นบรรทัดใหม่' },
      { q: 'เมธอดเริ่มต้นที่ Java เรียกใช้ในโปรแกรมทั่วไปคือเมธอดใด?', code: '', options: ['start()', 'run()', 'main()', 'init()'], answer: 2, explain: 'โปรแกรม Java แบบทั่วไปเริ่มทำงานจาก public static void main(String[] args)' },
      { q: 'ไฟล์ซอร์สโค้ด Java ใช้นามสกุลใด?', code: '', options: ['.js', '.java', '.class', '.html'], answer: 1, explain: 'ไฟล์ซอร์สโค้ดใช้ .java ส่วนไฟล์ bytecode ที่คอมไพล์แล้วใช้ .class' },
      { q: 'คำสั่งใดเป็นคอมเมนต์หนึ่งบรรทัดใน Java?', code: '', options: ['<!-- note -->', '# note', '// note', '** note **'], answer: 2, explain: 'เครื่องหมาย // ทำให้ข้อความที่เหลือในบรรทัดนั้นเป็นคอมเมนต์' },
      { q: 'คีย์เวิร์ดใดใช้ประกาศคลาส?', code: '', options: ['object', 'define', 'struct', 'class'], answer: 3, explain: 'ใช้ class ตามด้วยชื่อคลาส เช่น class HelloWorld { ... }' }
    ],
    'variables': [
      { q: 'หากต้องเก็บจำนวนเต็ม เช่น อายุ ควรใช้ชนิดข้อมูลใด?', code: '', options: ['String', 'int', 'boolean', 'char[]'], answer: 1, explain: 'int ใช้เก็บจำนวนเต็ม เช่น 18, 42 หรือ -3' },
      { q: 'ตัวแปรใดประกาศ String ได้ถูกต้อง?', code: '', options: ['String name = "Mali";', 'string name = "Mali";', 'text name = "Mali";', 'String = name("Mali");'], answer: 0, explain: 'ชื่อชนิดข้อมูล String ต้องขึ้นต้นด้วย S ตัวพิมพ์ใหญ่ และข้อความอยู่ใน double quotes' },
      { q: 'ค่าของ boolean มีค่าใดได้บ้าง?', code: '', options: ['0 หรือ 1 เท่านั้น', 'ตัวเลขใดก็ได้', 'true หรือ false', 'ข้อความเท่านั้น'], answer: 2, explain: 'boolean มีได้เพียง true และ false' },
      { q: 'ข้อใดเป็นการประกาศค่าทศนิยมแบบ double?', code: '', options: ['double price = 19.99;', 'int price = 19.99;', 'decimal price = 19.99;', 'Double price := 19.99;'], answer: 0, explain: 'double เป็นชนิดข้อมูลตัวเลขทศนิยมแบบ primitive ใน Java' },
      { q: 'เมื่อประกาศตัวแปรด้วย final หมายถึงอะไร?', code: '', options: ['ตัวแปรเป็นข้อความ', 'เปลี่ยนค่าได้ตลอด', 'ตัวแปรจะถูกลบ', 'กำหนดค่าใหม่ไม่ได้หลัง assign แล้ว'], answer: 3, explain: 'final ใช้ระบุว่าตัวแปรอ้างอิงนั้นไม่สามารถ assign ค่าใหม่ได้หลังจากกำหนดค่าแล้ว' }
    ],
    'conditions': [
      { q: 'โครงสร้างใดใช้ตรวจสอบเงื่อนไขใน Java?', code: '', options: ['when / otherwise', 'if / else', 'check / then', 'case / do เท่านั้น'], answer: 1, explain: 'if / else ใช้เลือกทำงานตามผลของเงื่อนไขแบบ boolean' },
      { q: 'ผลลัพธ์ของนิพจน์ 5 > 3 คืออะไร?', code: '', options: ['false', '5', 'true', 'เกิด error'], answer: 2, explain: '5 มีค่ามากกว่า 3 ดังนั้นนิพจน์นี้ให้ค่า true' },
      { q: 'ตัวดำเนินการ == ใช้ทำอะไรโดยทั่วไปกับค่าตัวเลข?', code: '', options: ['เปรียบเทียบว่ามีค่าเท่ากันหรือไม่', 'กำหนดค่าใหม่', 'บวกค่า', 'หารเอาเศษ'], answer: 0, explain: '== ใช้เปรียบเทียบความเท่ากัน ส่วน = ใช้กำหนดค่า' },
      { q: 'ถ้าต้องตรวจหลายเงื่อนไขต่อเนื่อง คำสั่งใดใช้เพิ่มเงื่อนไขได้?', code: '', options: ['next if', 'repeat', 'another', 'else if'], answer: 3, explain: 'else if ใช้ตรวจเงื่อนไขเพิ่มเติมเมื่อเงื่อนไขก่อนหน้าเป็น false' },
      { q: 'ผลลัพธ์ของ 7 != 7 คืออะไร?', code: '', options: ['true', 'false', '7', 'null'], answer: 1, explain: '!= หมายถึงไม่เท่ากับ และ 7 ก็เท่ากับ 7 จึงได้ false' }
    ],
    'loops': [
      { q: 'ลูปใดเหมาะเมื่อทราบจำนวนรอบที่ต้องการทำซ้ำ?', code: '', options: ['if', 'for', 'switch', 'try'], answer: 1, explain: 'for เหมาะกับการวนซ้ำที่มีตัวนับหรือจำนวนรอบชัดเจน' },
      { q: 'ลูป while จะทำงานต่อเมื่อใด?', code: '', options: ['เงื่อนไขเป็น true', 'เงื่อนไขเป็น false', 'ทำงานเพียงครั้งเดียวเสมอ', 'เมื่อโปรแกรมปิด'], answer: 0, explain: 'while ตรวจเงื่อนไขก่อนแต่ละรอบ และทำซ้ำเมื่อเงื่อนไขเป็น true' },
      { q: 'คำสั่งใดใช้หยุดลูปทันที?', code: '', options: ['skip', 'stop()', 'break', 'exit-loop'], answer: 2, explain: 'break ออกจากลูปที่กำลังทำงานอยู่ทันที' },
      { q: 'คำสั่ง continue ทำอะไร?', code: '', options: ['จบโปรแกรม', 'เริ่มลูปใหม่จากศูนย์', 'ออกจากเมธอด', 'ข้ามส่วนที่เหลือของรอบปัจจุบัน'], answer: 3, explain: 'continue ข้ามคำสั่งที่เหลือในรอบนี้และไปยังรอบถัดไป' },
      { q: 'ลูป for ต่อไปนี้พิมพ์ตัวเลขกี่ครั้ง?', code: 'for (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}', options: ['2 ครั้ง', '3 ครั้ง', '4 ครั้ง', 'ไม่ทำงาน'], answer: 1, explain: 'ค่า i คือ 0, 1 และ 2 จึงพิมพ์ทั้งหมด 3 ครั้ง' }
    ],
    'oop-classes': [
      { q: 'ใน OOP, class เปรียบเสมือนอะไร?', code: '', options: ['พิมพ์เขียวสำหรับสร้าง object', 'ตัวแปรชนิดตัวเลข', 'คำสั่งวนซ้ำ', 'ฐานข้อมูล'], answer: 0, explain: 'class กำหนดข้อมูลและพฤติกรรมที่ object ซึ่งสร้างจากคลาสนั้นจะมี' },
      { q: 'object คืออะไร?', code: '', options: ['ชื่อไฟล์ .java', 'instance ที่สร้างจาก class', 'คอมเมนต์ในโปรแกรม', 'ชนิดข้อมูล boolean'], answer: 1, explain: 'object คือ instance ของคลาสที่มี state และ behavior ตามที่คลาสกำหนด' },
      { q: 'เมธอดใช้สำหรับอะไร?', code: '', options: ['เก็บชื่อไฟล์', 'สร้าง package เท่านั้น', 'กำหนดพฤติกรรมหรือการทำงาน', 'หยุด JVM'], answer: 2, explain: 'method รวบรวมชุดคำสั่งเพื่อทำงานบางอย่าง และอาจรับพารามิเตอร์หรือคืนค่า' },
      { q: 'constructor มีหน้าที่หลักอะไร?', code: '', options: ['ลบคลาส', 'วนลูป', 'แปลง Java เป็น HTML', 'เริ่มต้นสถานะของ object'], answer: 3, explain: 'constructor ถูกเรียกตอนสร้าง object เพื่อกำหนดค่าเริ่มต้น' },
      { q: 'หลักการ encapsulation มักเกี่ยวข้องกับสิ่งใด?', code: '', options: ['การซ่อนรายละเอียดข้อมูลและควบคุมการเข้าถึง', 'การทำซ้ำ', 'การเรียงลำดับ', 'การส่งข้อความบนจอ'], answer: 0, explain: 'encapsulation รวมข้อมูลกับพฤติกรรมและควบคุมการเข้าถึงผ่าน access modifiers และเมธอด' }
    ],
    'oop-inheritance': [
      { q: 'คีย์เวิร์ดใดใช้สืบทอดคลาสใน Java?', code: '', options: ['inherits', 'extends', 'implements-class', 'superclass'], answer: 1, explain: 'class Child extends Parent คือการประกาศคลาสลูกที่สืบทอดจากคลาสแม่' },
      { q: 'การ override หมายถึงอะไร?', code: '', options: ['ลบ object', 'ประกาศตัวแปรใหม่', 'คลาสลูกเขียนเมธอดที่สืบทอดมาใหม่', 'เรียก constructor เสมอ'], answer: 2, explain: 'การ override คือคลาสลูกกำหนด implementation ใหม่ให้เมธอดของคลาสแม่' },
      { q: 'Polymorphism สื่อถึงแนวคิดใด?', code: '', options: ['ทุกคลาสต้องเหมือนกัน', 'มีตัวแปรได้แค่หนึ่งตัว', 'ไม่ต้องใช้ object', 'การเรียกแบบเดียวแต่มีพฤติกรรมได้หลายรูปแบบ'], answer: 3, explain: 'Polymorphism ทำให้ reference ชนิดแม่เรียก implementation ของ object ชนิดลูกได้' },
      { q: 'คำว่า super ในคลาสลูกใช้ทำอะไรได้?', code: '', options: ['อ้างถึงสมาชิกหรือ constructor ของคลาสแม่', 'สร้าง package', 'สร้างลูป', 'ปิดโปรแกรม'], answer: 0, explain: 'super ใช้เข้าถึงสมาชิกของ superclass หรือเรียก constructor ของ superclass' },
      { q: 'Java อนุญาตให้ class สืบทอดจาก class โดยตรงกี่คลาส?', code: '', options: ['ไม่จำกัด', 'หนึ่งคลาส', 'สองคลาสพอดี', 'ขึ้นกับจำนวน method'], answer: 1, explain: 'Java ไม่รองรับ multiple inheritance ของคลาสโดยตรง แต่ class สามารถ implement หลาย interface ได้' }
    ]
  };

  const SAMPLE_LEADERBOARD = [
    { id: 'sample-nara', username: 'nara.codes', total_xp: 860 },
    { id: 'sample-palm', username: 'palm_dev', total_xp: 720 },
    { id: 'sample-mint', username: 'mintbyte', total_xp: 590 },
    { id: 'sample-ken', username: 'kenji.java', total_xp: 410 },
    { id: 'sample-fah', username: 'fah.codes', total_xp: 280 }
  ];
  const STORAGE = { progress: 'javawave_demo_progress_v1', user: 'javawave_demo_user_v1', today: 'javawave_did_today_v1', streak: 'javawave_streak_v1' };
  const state = {
    demo: false, session: null, user: null, lessons: FALLBACK_LESSONS.slice(), progress: [],
    leaderboard: SAMPLE_LEADERBOARD.slice(), leaderboardIsSample: true, currentView: 'home', authMode: 'login',
    quiz: null, todayDone: false, streak: 0
  };

  const $ = (id) => document.getElementById(id);
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const prettyName = (name) => String(name || 'นักพัฒนา').slice(0, 24);
  const progressRows = () => Array.isArray(state.progress) ? state.progress : [];
  const lessonIdFromProgress = (row) => row.lesson_id ?? row.lessonId;
  const isCompleted = (lessonId) => progressRows().some((row) => lessonIdFromProgress(row) === lessonId && row.completed === true);
  const completedCount = () => state.lessons.filter((lesson) => isCompleted(lesson.id)).length;
  const getXp = () => {
    if (state.demo) return Number(state.user?.total_xp || 0);
    return Number(state.user?.total_xp ?? state.user?.totalXp ?? 0);
  };
  const getDisplayName = () => prettyName(state.user?.username || state.user?.user_metadata?.username || state.user?.email?.split('@')[0] || 'นักพัฒนา');
  const getDemoProgress = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE.progress) || '[]'); } catch { return []; }
  };
  const getDemoUser = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE.user) || 'null'); } catch { return null; }
  };
  const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const getStreakRecord = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE.streak) || '{"lastDate":"","count":0}'); }
    catch { return { lastDate: '', count: 0 }; }
  };
  const currentStreak = () => {
    const record = getStreakRecord();
    const today = dayKey();
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    return record.lastDate === today || record.lastDate === yesterday ? Number(record.count || 0) : 0;
  };
  const recordLearningDay = () => {
    const record = getStreakRecord();
    const today = dayKey();
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    if (record.lastDate === today) return Number(record.count || 1);
    const count = record.lastDate === yesterday ? Number(record.count || 0) + 1 : 1;
    localStorage.setItem(STORAGE.streak, JSON.stringify({ lastDate: today, count }));
    return count;
  };
  const showToast = (message, type = '') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`.trim();
    toast.textContent = message;
    $('toast-region').appendChild(toast);
    window.setTimeout(() => toast.remove(), 3600);
  };
  const showAuthMessage = (message, isError = false) => {
    const el = $('auth-message');
    el.textContent = message;
    el.classList.remove('hidden');
    el.style.background = isError ? '#fff0ef' : '#edf9f2';
    el.style.color = isError ? '#a84f48' : '#347956';
  };
  const hideAuthMessage = () => $('auth-message').classList.add('hidden');

  async function requestApi(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (state.session?.access_token) headers.Authorization = `Bearer ${state.session.access_token}`;
    if (options.body) headers['Content-Type'] = 'application/json';
    const response = await fetch(path, { ...options, headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
    return body;
  }

  async function loadLessons() {
    try {
      const lessons = await requestApi('/api/lessons');
      if (Array.isArray(lessons) && lessons.length) state.lessons = lessons.sort((a, b) => a.order - b.order);
    } catch { /* Frontend fallback lets the app preview its lesson path without the backend. */ }
  }

  async function loadLeaderboard() {
    if (state.demo) {
      const me = { id: 'demo-user', username: getDisplayName(), total_xp: getXp(), isCurrent: true };
      state.leaderboard = [...SAMPLE_LEADERBOARD, me].sort((a, b) => Number(b.total_xp) - Number(a.total_xp)).slice(0, 20);
      state.leaderboardIsSample = true;
      return;
    }
    try {
      const rows = await requestApi('/api/leaderboard');
      if (Array.isArray(rows) && rows.length) {
        state.leaderboard = rows;
        state.leaderboardIsSample = false;
      } else {
        state.leaderboard = SAMPLE_LEADERBOARD.slice();
        state.leaderboardIsSample = true;
      }
    } catch {
      state.leaderboard = SAMPLE_LEADERBOARD.slice();
      state.leaderboardIsSample = true;
    }
  }

  async function loadUserData() {
    if (state.demo) {
      state.user = getDemoUser() || { id: 'demo-user', username: 'WaveCoder', email: 'ตัวอย่างในเครื่อง', total_xp: 0 };
      state.progress = getDemoProgress();
      state.user.total_xp = state.progress.reduce((sum, row) => sum + Number(row.xp_earned || 0), 0);
      localStorage.setItem(STORAGE.user, JSON.stringify(state.user));
      state.todayDone = localStorage.getItem(STORAGE.today) === new Date().toDateString();
      state.streak = currentStreak();
      await loadLeaderboard();
      renderAll();
      return;
    }
    state.streak = currentStreak();
    if (!state.session?.access_token) {
      state.user = null;
      state.progress = [];
      await loadLeaderboard();
      renderAll();
      return;
    }
    try {
      const [me, progress] = await Promise.all([requestApi('/api/me'), requestApi('/api/progress')]);
      state.user = me;
      state.progress = Array.isArray(progress) ? progress : [];
      await loadLeaderboard();
      renderAll();
    } catch (error) {
      showToast(error.message || 'โหลดข้อมูลบัญชีไม่สำเร็จ', 'error');
    }
  }

  function unlocked(lesson) {
    if (lesson.order === 1) return true;
    const previous = state.lessons.find((item) => item.order === lesson.order - 1);
    return Boolean(previous && isCompleted(previous.id));
  }

  function renderPathItem(lesson, compact = false) {
    const complete = isCompleted(lesson.id);
    const open = unlocked(lesson);
    const iconClass = complete ? 'done' : open ? '' : 'locked';
    const statusClass = complete ? '' : open ? 'next' : 'lock';
    const status = complete ? '✓ ผ่านแล้ว' : open ? (compact ? 'เริ่ม' : 'เริ่มเรียน') : '🔒 ล็อกอยู่';
    return `<div class="path-lesson">
      <div class="path-icon ${iconClass}">${complete ? '✓' : escapeHTML(lesson.icon)}</div>
      <div><h4>${escapeHTML(lesson.title)}</h4><p>${escapeHTML(lesson.subtitle || lesson.description || '')}</p></div>
      <span class="path-status ${statusClass}">${status}</span>
    </div>`;
  }

  function renderHomeLessons() {
    const available = state.lessons.slice(0, 4);
    $('home-lesson-path').innerHTML = available.map((lesson) => renderPathItem(lesson, true)).join('');
    const done = completedCount();
    const percentage = Math.round(done / Math.max(state.lessons.length, 1) * 100);
    $('overall-progress-bar').style.width = `${percentage}%`;
    $('overall-progress-label').textContent = `${percentage}% complete`;
    $('chapter-count').textContent = `${done} / ${state.lessons.length}`;
  }

  function renderFullLessons() {
    $('full-lesson-grid').innerHTML = state.lessons.map((lesson) => {
      const complete = isCompleted(lesson.id);
      const open = unlocked(lesson);
      const disabled = !open;
      return `<article class="lesson-card ${disabled ? 'is-locked' : ''}">
        <div class="lesson-card-top"><span class="lesson-card-icon">${escapeHTML(lesson.icon)}</span><span class="lesson-level">${escapeHTML(lesson.level)}</span></div>
        ${complete ? '<span class="card-complete">✓ PASSED</span>' : ''}
        <h3>${escapeHTML(lesson.title)}</h3><p>${escapeHTML(lesson.description || lesson.subtitle || '')}</p>
        <div class="lesson-card-footer"><span class="lesson-xp">✦ ${Number(lesson.xpReward || 25)} XP · 5 ข้อ</span><button class="lesson-action" data-start-lesson="${escapeHTML(lesson.id)}" ${disabled ? 'disabled' : ''}>${complete ? 'ฝึกซ้ำ ↗' : disabled ? '🔒 ยังไม่ปลดล็อก' : 'เริ่มบทเรียน ↗'}</button></div>
      </article>`;
    }).join('');
    const done = completedCount();
    const percentage = Math.round(done / Math.max(state.lessons.length, 1) * 100);
    $('learn-summary-xp').textContent = `${getXp()} XP`;
    $('learn-summary-completed').textContent = `${done} / ${state.lessons.length}`;
    $('learn-summary-bar').style.width = `${percentage}%`;
    $('learn-summary-percent').textContent = `${percentage}% complete`;
  }

  function leaderboardRows(rows, full = false) {
    const shown = full ? rows : rows.slice(0, 3);
    if (!shown.length) return '<p class="muted">ยังไม่มีคะแนน ลองผ่านบทเรียนแรกกันเลย!</p>';
    return shown.map((row, index) => {
      const current = (state.demo && row.id === 'demo-user') || (!state.demo && state.user?.id && row.id === state.user.id);
      const name = row.username || 'Java learner';
      const xp = Number(row.total_xp || 0);
      const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
      const avatarClass = `alt-${index % 4}`;
      if (!full) return `<div class="rank-row"><span class="rank-no ${rankClass}">${index + 1 < 4 ? ['①','②','③'][index] : index + 1}</span><span class="rank-avatar ${avatarClass}">${escapeHTML(name.charAt(0).toUpperCase())}</span><span class="rank-name">${escapeHTML(name)}${current ? ' (คุณ)' : ''}</span><span class="rank-xp">✦ ${xp} XP</span></div>`;
      return `<div class="leader-row ${current ? 'current-user' : ''}"><span class="leader-rank ${index < 3 ? `top-${['one','two','three'][index]}` : ''}">${String(index + 1).padStart(2, '0')}</span><span class="leader-avatar">${escapeHTML(name.charAt(0).toUpperCase())}</span><span class="leader-name">${escapeHTML(name)}${current ? '<span class="leader-subtitle">คุณ · Keep going!</span>' : '<span class="leader-subtitle">Java learner</span>'}</span><span class="leader-score">${xp.toLocaleString()} <small>XP</small></span></div>`;
    }).join('');
  }

  function renderLeaderboard() {
    const rows = [...state.leaderboard].sort((a, b) => Number(b.total_xp || 0) - Number(a.total_xp || 0));
    $('home-leaderboard').innerHTML = leaderboardRows(rows, false);
    $('full-leaderboard').innerHTML = leaderboardRows(rows, true);
    const pill = document.querySelector('.live-pill');
    if (pill) pill.innerHTML = state.leaderboardIsSample ? '<span></span> SAMPLE DATA' : '<span></span> LIVE DATA';
  }

  function renderProfile() {
    const name = state.user ? getDisplayName() : 'นักพัฒนา';
    const email = state.demo ? 'โหมดตัวอย่าง · บันทึกในเบราว์เซอร์' : state.user?.email || (hasSupabaseConfig ? 'ยังไม่ได้เข้าสู่ระบบ' : 'ยังไม่ได้เชื่อมบัญชี');
    const rankRows = [...state.leaderboard].sort((a, b) => Number(b.total_xp || 0) - Number(a.total_xp || 0));
    const rank = state.user ? rankRows.findIndex((row) => row.id === state.user.id) + 1 : 0;
    $('profile-avatar').textContent = name.slice(0, 1).toUpperCase();
    $('profile-name').textContent = name;
    $('profile-email').textContent = email;
    $('profile-xp').textContent = getXp().toLocaleString();
    $('profile-completed').textContent = `${completedCount()} / ${state.lessons.length}`;
    $('profile-rank').textContent = rank > 0 ? `#${rank}` : '—';
    $('auth-action').textContent = state.user ? (state.demo ? 'เปลี่ยนไปใช้บัญชีจริง' : 'จัดการบัญชี') : 'เข้าสู่ระบบ / สมัครสมาชิก';
    $('logout-button').classList.toggle('hidden', !state.user || state.demo);
    const achievements = [
      { icon: '🌱', title: 'First Commit', description: 'ผ่านบทเรียนแรก', condition: completedCount() >= 1 },
      { icon: '⚡', title: 'XP Starter', description: 'สะสมครบ 50 XP', condition: getXp() >= 50 },
      { icon: '🧠', title: 'OOP Explorer', description: 'ปลดล็อกโลก OOP', condition: isCompleted('oop-classes') },
      { icon: '🏅', title: 'Halfway Hero', description: 'ผ่านอย่างน้อย 3 บท', condition: completedCount() >= 3 },
      { icon: '🚀', title: 'Java Pro', description: 'ผ่านครบ 6 บท', condition: completedCount() >= 6 },
      { icon: '💎', title: 'XP Collector', description: 'สะสมครบ 200 XP', condition: getXp() >= 200 }
    ];
    $('achievement-grid').innerHTML = achievements.map((item) => `<div class="achievement ${item.condition ? '' : 'locked'}"><span class="achievement-icon">${item.icon}</span><div><strong>${item.title}</strong><small>${item.description}</small></div></div>`).join('');
  }

  function renderAll() {
    const name = getDisplayName();
    const xp = getXp();
    const done = completedCount();
    $('welcome-name').textContent = name;
    $('top-avatar').textContent = name.slice(0, 1).toUpperCase();
    $('top-xp').textContent = xp.toLocaleString();
    $('stat-xp').textContent = xp.toLocaleString();
    $('stat-completed').textContent = done;
    $('stat-progress-text').textContent = done === 0 ? 'เริ่มบทแรกได้เลย' : done === state.lessons.length ? 'ผ่านครบทุกบทแล้ว!' : 'ดีมาก ไปต่อกันเลย';
    $('stat-streak').textContent = String(state.streak || 0);
    $('streak-value').textContent = String(state.streak || 0);
    $('goal-count').textContent = state.todayDone ? '1/1' : '0/1';
    $('goal-status').textContent = state.todayDone ? 'สำเร็จแล้ว!' : 'เริ่มกันเลย!';
    $('goal-subtext').textContent = state.todayDone ? 'ภารกิจวันนี้ครบแล้ว ยอดเยี่ยม!' : 'อีกเพียง 1 บทก็สำเร็จแล้ว';
    $('goal-ring').style.background = state.todayDone ? 'conic-gradient(#36bba4 360deg, #ebf4f0 0deg)' : 'conic-gradient(#36bba4 0deg, #ebf4f0 0deg)';
    $('demo-banner').classList.toggle('hidden', !state.demo);
    renderHomeLessons();
    renderFullLessons();
    renderLeaderboard();
    renderProfile();
    setView(state.currentView, false);
  }

  function setView(view, scroll = true) {
    if (!['home', 'learn', 'leaderboard', 'profile'].includes(view)) view = 'home';
    state.currentView = view;
    document.querySelectorAll('.page-view').forEach((section) => section.classList.toggle('active', section.id === `view-${view}`));
    document.querySelectorAll('.nav-link').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
    const labels = { home: 'ภาพรวม', learn: 'เส้นทางเรียน', leaderboard: 'ตารางคะแนน', profile: 'โปรไฟล์ของฉัน' };
    $('breadcrumb-current').textContent = labels[view];
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setAuthMode(mode) {
    state.authMode = mode;
    document.querySelectorAll('[data-auth-mode]').forEach((button) => button.classList.toggle('active', button.dataset.authMode === mode));
    $('username-field').classList.toggle('hidden', mode !== 'signup');
    $('auth-username').required = mode === 'signup';
    $('auth-password').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
    $('auth-submit').innerHTML = mode === 'signup' ? 'สร้างบัญชี <span>→</span>' : 'เข้าสู่ระบบ <span>→</span>';
    $('auth-title').textContent = mode === 'signup' ? 'สร้างบัญชี JavaWave' : 'เริ่มต้นการเดินทางของคุณ';
    hideAuthMessage();
  }

  async function showAuthGate() {
    $('auth-gate').classList.remove('hidden');
    setAuthMode('login');
    if (!hasSupabaseConfig) {
      $('auth-footnote').textContent = 'ตั้งค่า Supabase ในไฟล์ js/config.js เพื่อเปิดใช้บัญชีจริง หรือทดลองโหมดตัวอย่างก่อนได้';
    } else {
      $('auth-footnote').textContent = 'บัญชีจริงใช้ Supabase Auth และเก็บความคืบหน้าไว้บนฐานข้อมูล';
    }
  }

  async function startDemo() {
    state.demo = true;
    state.session = null;
    state.user = getDemoUser() || { id: 'demo-user', username: 'WaveCoder', email: 'ตัวอย่างในเครื่อง', total_xp: 0 };
    state.progress = getDemoProgress();
    const storedToday = localStorage.getItem(STORAGE.today);
    state.todayDone = storedToday === new Date().toDateString();
    state.streak = currentStreak();
    localStorage.setItem(STORAGE.user, JSON.stringify(state.user));
    $('auth-gate').classList.add('hidden');
    await loadUserData();
    showToast('เข้าสู่โหมดตัวอย่างแล้ว ลองทำบทเรียนแรกได้เลย ✦');
  }

  async function enterRealSession(session) {
    state.demo = false;
    state.session = session;
    $('auth-gate').classList.add('hidden');
    await loadUserData();
    showToast('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับสู่ JavaWave!');
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    hideAuthMessage();
    if (!hasSupabaseConfig || !supabase) {
      showAuthMessage('ยังไม่ได้ตั้งค่า Supabase กรุณาใส่ Project URL และ Publishable Key ในไฟล์ src/main/resources/static/js/config.js หรือใช้โหมดตัวอย่างก่อน', true);
      return;
    }
    const email = $('auth-email').value.trim();
    const password = $('auth-password').value;
    const username = $('auth-username').value.trim();
    const submit = $('auth-submit');
    submit.disabled = true;
    submit.textContent = state.authMode === 'signup' ? 'กำลังสร้างบัญชี...' : 'กำลังเข้าสู่ระบบ...';
    try {
      if (state.authMode === 'signup') {
        if (username.length < 3) throw new Error('ชื่อที่ใช้ในชุมชนต้องมีอย่างน้อย 3 ตัวอักษร');
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
        if (error) throw error;
        if (!data.session) {
          showAuthMessage('สร้างบัญชีแล้ว! กรุณาตรวจอีเมลเพื่อยืนยันบัญชีก่อนเข้าสู่ระบบ');
          return;
        }
        await enterRealSession(data.session);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await enterRealSession(data.session);
      }
    } catch (error) {
      showAuthMessage(error.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่', true);
    } finally {
      submit.disabled = false;
      submit.innerHTML = state.authMode === 'signup' ? 'สร้างบัญชี <span>→</span>' : 'เข้าสู่ระบบ <span>→</span>';
    }
  }

  async function logOut() {
    if (state.demo) {
      state.demo = false;
      state.user = null;
      state.progress = [];
      renderAll();
      await showAuthGate();
      return;
    }
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) showToast(error.message, 'error');
    }
    state.session = null;
    state.user = null;
    state.progress = [];
    renderAll();
    showAuthGate();
  }

  function openQuiz(lessonId) {
    const lesson = state.lessons.find((item) => item.id === lessonId);
    if (!lesson) return;
    if (!state.user) {
      showAuthGate();
      showToast('เข้าสู่ระบบหรือเริ่มโหมดตัวอย่างก่อนเรียน');
      return;
    }
    if (!unlocked(lesson)) {
      showToast('ผ่านบทก่อนหน้าเพื่อปลดล็อกบทนี้ก่อนนะ', 'error');
      return;
    }
    state.quiz = { lesson, questions: QUIZZES[lessonId] || QUIZZES['java-basics'], index: 0, answers: [], selected: null, checked: false };
    $('quiz-modal').classList.remove('hidden');
    $('quiz-question-area').classList.remove('hidden');
    $('quiz-result-area').classList.add('hidden');
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const quiz = state.quiz;
    if (!quiz) return;
    const question = quiz.questions[quiz.index];
    quiz.selected = null;
    quiz.checked = false;
    $('quiz-title').textContent = quiz.lesson.title;
    $('quiz-question').textContent = question.q;
    $('quiz-counter').textContent = `${quiz.index + 1} / ${quiz.questions.length}`;
    $('quiz-progress-bar').style.width = `${(quiz.index / quiz.questions.length) * 100}%`;
    if (question.code) {
      $('quiz-code').textContent = question.code;
      $('quiz-code').classList.remove('hidden');
    } else {
      $('quiz-code').classList.add('hidden');
    }
    $('quiz-options').innerHTML = question.options.map((option, index) => `<button type="button" class="quiz-option" data-option-index="${index}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span></button>`).join('');
    $('quiz-feedback').classList.add('hidden');
    $('quiz-feedback').className = 'quiz-feedback hidden';
    $('quiz-hint').textContent = 'เลือกคำตอบที่ถูกต้องที่สุด';
    $('quiz-next').disabled = true;
    $('quiz-next').innerHTML = 'ตรวจคำตอบ <span>→</span>';
  }

  function selectQuizOption(index) {
    const quiz = state.quiz;
    if (!quiz || quiz.checked) return;
    quiz.selected = index;
    document.querySelectorAll('.quiz-option').forEach((button) => button.classList.toggle('selected', Number(button.dataset.optionIndex) === index));
    $('quiz-next').disabled = false;
  }

  function checkQuizAnswer() {
    const quiz = state.quiz;
    if (!quiz || quiz.selected === null) return;
    const question = quiz.questions[quiz.index];
    const correct = quiz.selected === question.answer;
    quiz.checked = true;
    quiz.answers[quiz.index] = correct;
    document.querySelectorAll('.quiz-option').forEach((button) => {
      const index = Number(button.dataset.optionIndex);
      button.disabled = true;
      if (index === question.answer) button.classList.add('correct');
      if (index === quiz.selected && !correct) button.classList.add('wrong');
    });
    const feedback = $('quiz-feedback');
    feedback.classList.remove('hidden');
    feedback.classList.add(correct ? 'good' : 'bad');
    feedback.textContent = `${correct ? 'ถูกต้อง เยี่ยมมาก! ' : 'ยังไม่ใช่นะ ลองจำข้อนี้ไว้ '}${question.explain}`;
    $('quiz-hint').textContent = correct ? '+1 คะแนนความรู้!' : 'ไม่เป็นไร ความผิดพลาดช่วยให้เราเก่งขึ้น';
    $('quiz-next').innerHTML = quiz.index === quiz.questions.length - 1 ? 'ดูผลคะแนน <span>→</span>' : 'ข้อต่อไป <span>→</span>';
  }

  async function advanceQuiz() {
    const quiz = state.quiz;
    if (!quiz) return;
    if (!quiz.checked) {
      checkQuizAnswer();
      return;
    }
    if (quiz.index < quiz.questions.length - 1) {
      quiz.index += 1;
      renderQuizQuestion();
      return;
    }
    await finishQuiz();
  }

  async function finishQuiz() {
    const quiz = state.quiz;
    if (!quiz) return;
    const score = quiz.answers.filter(Boolean).length;
    const passed = score >= 3;
    let xpEarned = 0;
    let saved = false;
    let errorMessage = '';
    $('quiz-next').disabled = true;
    $('quiz-next').textContent = 'กำลังบันทึกผล...';
    try {
      if (state.demo) {
        const rows = getDemoProgress();
        const existing = rows.find((row) => row.lesson_id === quiz.lesson.id);
        const wasCompleted = Boolean(existing?.completed);
        xpEarned = passed && !wasCompleted ? Number(quiz.lesson.xpReward || 25) : 0;
        const nextRow = {
          lesson_id: quiz.lesson.id,
          score: Math.max(Number(existing?.score || 0), score),
          max_score: quiz.questions.length,
          completed: wasCompleted || passed,
          attempts: Number(existing?.attempts || 0) + 1,
          xp_earned: Number(existing?.xp_earned || 0) + xpEarned,
          updated_at: new Date().toISOString()
        };
        const nextRows = existing ? rows.map((row) => row.lesson_id === quiz.lesson.id ? nextRow : row) : [...rows, nextRow];
        localStorage.setItem(STORAGE.progress, JSON.stringify(nextRows));
        state.progress = nextRows;
        state.user.total_xp = nextRows.reduce((sum, row) => sum + Number(row.xp_earned || 0), 0);
        localStorage.setItem(STORAGE.user, JSON.stringify(state.user));
        saved = true;
      } else {
        const result = await requestApi('/api/progress/complete', {
          method: 'POST', body: JSON.stringify({ lessonId: quiz.lesson.id, score, maxScore: quiz.questions.length })
        });
        xpEarned = Number(result.xp_earned || 0);
        saved = true;
        const [me, progress] = await Promise.all([requestApi('/api/me'), requestApi('/api/progress')]);
        state.user = me;
        state.progress = progress;
      }
      if (passed && saved) {
        state.todayDone = true;
        state.streak = recordLearningDay();
        localStorage.setItem(STORAGE.today, new Date().toDateString());
      }
      await loadLeaderboard();
    } catch (error) {
      errorMessage = error.message || 'บันทึกความคืบหน้าไม่สำเร็จ';
    }
    showQuizResult(score, quiz.questions.length, passed, xpEarned, saved, errorMessage);
    renderAll();
  }

  function showQuizResult(score, total, passed, xpEarned, saved, errorMessage) {
    $('quiz-question-area').classList.add('hidden');
    $('quiz-result-area').classList.remove('hidden');
    const title = passed ? (score === total ? 'สมบูรณ์แบบ! เก่งมาก ✦' : 'ผ่านบทเรียนแล้ว!') : 'อีกนิดเดียวเอง';
    const subtitle = passed ? 'คุณปลดล็อกก้าวต่อไปในเส้นทาง Java แล้ว' : 'ต้องได้อย่างน้อย 3 จาก 5 ข้อเพื่อผ่านบทเรียน ลองอีกครั้งได้นะ';
    $('quiz-progress-bar').style.width = '100%';
    $('quiz-counter').textContent = `${score}/${total}`;
    $('quiz-result-area').innerHTML = `<div class="quiz-result-mark ${passed ? 'pass' : 'retry'}">${passed ? '✓' : '↻'}</div>
      <p class="eyebrow centered">YOUR RESULTS</p><h2 class="quiz-result-title">${title}</h2><p class="quiz-result-subtitle">${subtitle}</p>
      <div class="quiz-score-card"><div><strong>${score}<small>/${total}</small></strong><span>คะแนนของคุณ</span></div><div><strong>✦ ${xpEarned}</strong><span>XP ที่ได้รับ</span></div><div><strong>${passed ? 'ผ่าน' : 'ฝึกต่อ'}</strong><span>สถานะบทเรียน</span></div></div>
      ${!saved ? `<p class="quiz-save-error">ผลยังไม่ได้บันทึก: ${escapeHTML(errorMessage || 'เกิดข้อผิดพลาด')} กรุณาตรวจการเชื่อมต่อแล้วลองทำแบบทดสอบอีกครั้ง</p>` : ''}
      <button class="button button-primary full-button" id="quiz-result-close">${passed ? 'ไปต่อกันเลย' : 'ลองทำอีกครั้ง'} <span>→</span></button>
      <button class="button button-outline full-button" id="quiz-result-path">กลับไปเส้นทางเรียน</button>`;
    $('quiz-result-close').addEventListener('click', () => {
      const lessonId = state.quiz?.lesson.id;
      $('quiz-modal').classList.add('hidden');
      state.quiz = null;
      if (!passed || !saved) {
        if (lessonId) openQuiz(lessonId);
      } else {
        setView('learn');
      }
    });
    $('quiz-result-path').addEventListener('click', () => { $('quiz-modal').classList.add('hidden'); state.quiz = null; setView('learn'); });
  }

  function closeQuiz() { $('quiz-modal').classList.add('hidden'); state.quiz = null; }

  function initEvents() {
    document.querySelectorAll('.nav-link').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
    document.querySelectorAll('[data-go-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.goView)));
    $('continue-button').addEventListener('click', () => {
      const next = state.lessons.find((lesson) => !isCompleted(lesson.id) && unlocked(lesson)) || state.lessons[0];
      if (next) openQuiz(next.id);
    });
    $('full-lesson-grid').addEventListener('click', (event) => {
      const button = event.target.closest('[data-start-lesson]');
      if (button && !button.disabled) openQuiz(button.dataset.startLesson);
    });
    $('home-lesson-path').addEventListener('click', () => setView('learn'));
    $('top-avatar').addEventListener('click', () => setView('profile'));
    $('help-button').addEventListener('click', () => showToast('เริ่มจากบทที่ 1 ทำแบบทดสอบ 5 ข้อ ได้ตั้งแต่ 3 ข้อขึ้นไปเพื่อผ่านบท และรับ XP ครั้งแรกที่ผ่านบทนั้น'));
    document.querySelectorAll('[data-auth-mode]').forEach((button) => button.addEventListener('click', () => setAuthMode(button.dataset.authMode)));
    $('auth-form').addEventListener('submit', handleAuthSubmit);
    $('demo-button').addEventListener('click', startDemo);
    $('close-auth').addEventListener('click', () => {
      if (state.user) $('auth-gate').classList.add('hidden');
      else showToast('เข้าสู่ระบบหรือเลือกโหมดตัวอย่างเพื่อเริ่มเรียน');
    });
    $('connect-account').addEventListener('click', async () => { await showAuthGate(); });
    $('auth-action').addEventListener('click', async () => {
      if (state.demo) { state.demo = false; state.user = null; state.progress = []; renderAll(); }
      await showAuthGate();
    });
    $('logout-button').addEventListener('click', logOut);
    $('quiz-close').addEventListener('click', closeQuiz);
    $('quiz-next').addEventListener('click', advanceQuiz);
    $('quiz-options').addEventListener('click', (event) => {
      const option = event.target.closest('[data-option-index]');
      if (option) selectQuizOption(Number(option.dataset.optionIndex));
    });
    $('quiz-modal').addEventListener('click', (event) => { if (event.target === $('quiz-modal')) closeQuiz(); });
    $('auth-gate').addEventListener('click', (event) => { if (event.target === $('auth-gate') && state.user) $('auth-gate').classList.add('hidden'); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { if (!$('quiz-modal').classList.contains('hidden')) closeQuiz(); else if (state.user) $('auth-gate').classList.add('hidden'); } });
  }

  async function init() {
    const date = new Date();
    $('today-label').textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() + ' · LET’S LEARN';
    initEvents();
    await loadLessons();
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        state.session = session;
        await loadUserData();
        $('auth-gate').classList.add('hidden');
      } else {
        await loadLeaderboard();
        renderAll();
        await showAuthGate();
      }
      supabase.auth.onAuthStateChange((_event, session) => {
        queueMicrotask(async () => {
          if (session && session.access_token && state.session?.access_token !== session.access_token) {
            state.session = session;
            await loadUserData();
            $('auth-gate').classList.add('hidden');
          } else if (!session && state.session) {
            state.session = null;
            state.user = null;
            state.progress = [];
            renderAll();
          }
        });
      });
    } else {
      await loadLeaderboard();
      renderAll();
      await showAuthGate();
    }
  }

  init().catch((error) => {
    console.error('JavaWave initialization failed:', error);
    showToast('หน้าเว็บเริ่มต้นไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง', 'error');
  });
})();
