// UC 打卡系統 — 12 種莫蘭迪色系＋深色模式（右上角色票，點開選擇）
// 打卡頁與查詢頁各自記住自己的色系；預設：打卡＝灰藍、查詢＝芋泥紫。
(function () {
  // [名稱, bg, bg-hi, bg-deep, paper, ink, ink-soft, ink-faint, hair, accent, accent-deep, accent-tint]
  var T = {
    blue:   ['灰藍',   '#D9DFE4', '#E5EAEE', '#D0D7DD', '#F5F7F8', '#3F474D', '#6E7A84', '#909CA5', '#E3E8EC', '#8D9AAA', '#64718A', '#E1E5EA'],
    taro:   ['芋泥紫', '#DCD3E0', '#E8E1EB', '#D1C6D7', '#FAF8FB', '#463F4B', '#776E7E', '#9990A0', '#ECE6EF', '#9A88A6', '#7C6A89', '#EEE7F2'],
    sage:   ['鼠尾草', '#D8DED5', '#E5EAE2', '#CCD4C8', '#F7F8F5', '#3E463C', '#6A7666', '#909A8B', '#E4E9E1', '#8E9C8A', '#66755F', '#E3E9DF'],
    milk:   ['奶茶',   '#E3DAD0', '#EDE6DE', '#D8CDC1', '#FAF7F3', '#4A4039', '#7A6D62', '#9F9286', '#EEE7DF', '#B09A84', '#86705A', '#F0E7DC'],
    rose:   ['乾燥玫瑰', '#E5D6D3', '#EEE3E0', '#DBC8C4', '#FBF7F6', '#4C3D3B', '#7E6A67', '#A48F8C', '#F0E5E2', '#B8908A', '#8F665D', '#F3E4E0'],
    blush:  ['霧粉',   '#EBDCDF', '#F3E8EA', '#E1CFD3', '#FCF8F9', '#4D3E43', '#806C73', '#A69198', '#F2E6E9', '#C29AA6', '#956B7A', '#F6E7EB'],
    celadon:['青瓷',   '#D3E0DE', '#E1EBE9', '#C6D6D3', '#F5F9F8', '#37484A', '#607777', '#889D9C', '#E0EAE8', '#7FA09C', '#56786F', '#DDEBE8'],
    smoke:  ['煙灰',   '#DCDCDA', '#E8E8E6', '#D0D0CD', '#F8F8F6', '#3F3F3D', '#6E6D6A', '#94938F', '#E8E8E5', '#9A9893', '#6F6D67', '#EAE9E5'],
    apricot:['杏桃',   '#EDDCCC', '#F4E8DC', '#E4CEBB', '#FDF8F3', '#4E3F33', '#836C5A', '#A89180', '#F3E7DB', '#CC9C7A', '#9C6E50', '#F7E6D8'],
    olive:  ['橄欖',   '#DCDBC9', '#E8E7D9', '#D0CEB9', '#F9F8F2', '#45442F', '#727057', '#97957C', '#E9E8DB', '#A3A07A', '#76734F', '#ECEAD8'],
    denim:  ['丹寧',   '#CBD3DE', '#DAE0E8', '#BDC7D4', '#F4F6F9', '#2F3A48', '#5B697B', '#818E9F', '#DEE3EA', '#7487A0', '#53668A', '#DDE3EC'],
    clay:   ['陶土',   '#DFCFC6', '#EADDD6', '#D4C0B5', '#FBF6F3', '#4B3832', '#7D635A', '#A38B81', '#F0E4DE', '#B07F6B', '#8A5A47', '#F3E1D9']
  };
  // 暖色系的「下班」改用暖灰調，避免冷藍按鈕突兀
  var MIST = {
    milk:    ['#9E8F86', '#7F7067', '#ECE5DF'],
    apricot: ['#A68D84', '#866D64', '#F1E5DF'],
    clay:    ['#9A888B', '#7A686B', '#EDE3E3'],
    rose:    ['#9A8B97', '#79697A', '#ECE5EB'],
    blush:   ['#9B8CA2', '#776783', '#EEE7F1'],
    olive:   ['#9A9590', '#78736E', '#EBE8E4']
  };
  var ORDER = ['blue', 'taro', 'sage', 'celadon', 'denim', 'smoke', 'milk', 'apricot', 'clay', 'rose', 'blush', 'olive'];
  // 語意色（上班綠、下班藍、提醒、異常、警示）的淺色基準值
  var SEM = { sage: '#8E9C8A', mist: '#8D9AAA', rose: '#B8968F', bad: '#A3706A', amber: '#B9895A' };
  var isQuery = /\/query\/?/.test(location.pathname);
  var KEY = isQuery ? 'uc-theme-query' : 'uc-theme-punch';
  var DEF = isQuery ? 'taro' : 'blue';

  var MKEY = 'uc-mode';   // auto（晚上 7 點到早上 7 點自動深色）／light／dark，兩頁共用
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function remember(k) { try { localStorage.setItem(KEY, k); } catch (e) {} }
  function savedMode() { try { return localStorage.getItem(MKEY) || 'auto'; } catch (e) { return 'auto'; } }
  function rememberMode(m) { try { localStorage.setItem(MKEY, m); } catch (e) {} }
  function isDark(mode) {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    var h = new Date().getHours();
    var sys = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;   // 手機本身設成深色模式
    return sys || h >= 19 || h < 7;
  }

  /* ── 顏色換算（深色版用） ── */
  function hex2hsl(hex) {
    var r = parseInt(hex.substr(1, 2), 16) / 255, g = parseInt(hex.substr(3, 2), 16) / 255, b = parseInt(hex.substr(5, 2), 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0;
    if (mx !== mn) {
      var d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
    }
    return [h, s, l];
  }
  function hsl(h, s, l) {
    s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r, g, b;
    if (h < 60) { r = c; g = x; b = 0; } else if (h < 120) { r = x; g = c; b = 0; } else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; } else if (h < 300) { r = x; g = 0; b = c; } else { r = c; g = 0; b = x; }
    var t = function (v) { return ('0' + Math.round((v + m) * 255).toString(16)).slice(-2); };
    return '#' + t(r) + t(g) + t(b);
  }
  // solid：按鈕／色塊；text：深色底上的彩色字；tint：淡色底（深色版改成暗色底）
  function tone(hex, role) {
    var c = hex2hsl(hex), h = c[0], s = c[1];
    if (role === 'solid') return hsl(h, s * 1.05, .56);
    if (role === 'text') return hsl(h, s * 1.1, .76);
    return hsl(h, s * .55, .25);
  }
  function darkVars(t, mi) {
    var b = hex2hsl(t[1]), h = b[0], sat = Math.min(b[1], .35);
    var v = {
      '--bg': hsl(h, sat * .55, .115), '--bg-hi': hsl(h, sat * .6, .15), '--bg-2': hsl(h, sat * .55, .2), '--bg-deep': hsl(h, sat * .5, .085), '--bg-3': hsl(h, sat * .5, .26),
      '--paper': hsl(h, sat * .5, .165), '--ink': hsl(h, .12, .9), '--ink-soft': hsl(h, .1, .72), '--ink-faint': hsl(h, .08, .56), '--hair': hsl(h, sat * .45, .235),
      '--acc': tone(t[9], 'solid'), '--acc-deep': tone(t[9], 'text'), '--acc-tint': tone(t[9], 'tint'),
      '--sage': tone(SEM.sage, 'solid'), '--sage-deep': tone(SEM.sage, 'text'), '--sage-tint': tone(SEM.sage, 'tint'),
      '--mist': tone(mi ? mi[0] : SEM.mist, 'solid'), '--mist-deep': tone(mi ? mi[0] : SEM.mist, 'text'), '--mist-tint': tone(mi ? mi[0] : SEM.mist, 'tint'),
      '--bad': hsl(hex2hsl(SEM.bad)[0], .45, .68), '--bad-tint': tone(SEM.bad, 'tint'),
      '--amber': hsl(hex2hsl(SEM.amber)[0], .42, .7), '--amber-tint': hsl(hex2hsl(SEM.amber)[0], .18, .2),
      '--shadow': '0 1px 1px rgba(0,0,0,.25), 0 10px 26px -12px rgba(0,0,0,.6)',
      '--shadow-lg': '0 2px 4px rgba(0,0,0,.3), 0 18px 40px -18px rgba(0,0,0,.7)'
    };
    if (isQuery) { v['--rose'] = tone(t[9], 'solid'); v['--rose-deep'] = tone(t[9], 'text'); v['--rose-tint'] = tone(t[9], 'tint'); }
    else { v['--clay'] = tone(t[9], 'solid'); v['--rose'] = hsl(hex2hsl(SEM.rose)[0], .4, .72); v['--rose-tint'] = tone(SEM.rose, 'tint'); }
    return v;
  }
  var DARK_KEYS = ['--sage', '--sage-deep', '--sage-tint', '--bad', '--bad-tint', '--amber', '--amber-tint', '--shadow', '--shadow-lg', '--rose', '--rose-tint'];

  var mode = savedMode();
  function apply(k) {
    var t = T[k] || T[DEF], s = document.documentElement.style, dark = isDark(mode);
    DARK_KEYS.forEach(function (n) { s.removeProperty(n); });
    document.documentElement.setAttribute('data-mode', dark ? 'dark' : 'light');
    if (dark) {
      var dv = darkVars(t, MIST[k]);
      for (var dn in dv) s.setProperty(dn, dv[dn]);
      document.documentElement.setAttribute('data-theme', k);
      var dm = document.querySelector('meta[name=theme-color]'); if (dm) dm.setAttribute('content', dv['--bg']);
      document.dispatchEvent(new CustomEvent('uc-theme'));
      return;
    }
    var v = { '--bg': t[1], '--bg-hi': t[2], '--bg-2': t[2], '--bg-deep': t[3], '--bg-3': t[3], '--paper': t[4],
              '--ink': t[5], '--ink-soft': t[6], '--ink-faint': t[7], '--hair': t[8],
              '--acc': t[9], '--acc-deep': t[10], '--acc-tint': t[11] };
    if (isQuery) { v['--rose'] = t[9]; v['--rose-deep'] = t[10]; v['--rose-tint'] = t[11]; }
    else { v['--clay'] = t[9]; }
    for (var n in v) s.setProperty(n, v[n]);
    var mi = MIST[k];
    ['--mist', '--mist-deep', '--mist-tint'].forEach(function (n, i) { if (mi) s.setProperty(n, mi[i]); else s.removeProperty(n); });
    document.documentElement.setAttribute('data-theme', k);
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', t[1]);
    document.dispatchEvent(new CustomEvent('uc-theme'));
  }
  var cur = T[saved()] ? saved() : DEF;
  apply(cur);
  window.UC_THEMES = { list: ORDER, apply: function (k) { cur = k; apply(k); remember(k); mark(); },
                       setMode: function (m) { mode = m; rememberMode(m); apply(cur); mark(); },
                       isDark: function () { return document.documentElement.getAttribute('data-mode') === 'dark'; } };
  // 自動模式：每分鐘檢查一次是否該切換
  var lastDark = isDark(mode);
  setInterval(function () { var d = isDark(mode); if (d !== lastDark) { lastDark = d; apply(cur); } }, 60000);
  if (window.matchMedia) try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { lastDark = isDark(mode); apply(cur); }); } catch (e) {}

  var css =
    '.thm{position:relative;flex:none}' +
    '.thm-b{width:34px;height:34px;padding:0;border:0;border-radius:50%;background:var(--paper);box-shadow:var(--shadow);display:grid;place-items:center;cursor:pointer}' +
    '.thm-b i{width:18px;height:18px;border-radius:50%;background:conic-gradient(var(--acc) 0 33%,var(--bg-deep) 0 66%,var(--ink-soft) 0);box-shadow:0 0 0 2px var(--paper),0 0 0 3px var(--hair)}' +
    '.thm-p{position:absolute;right:0;top:44px;z-index:40;width:264px;padding:14px 12px 10px;border-radius:20px;background:var(--paper);' +
      'box-shadow:0 18px 40px -16px rgba(0,0,0,.28),0 2px 6px rgba(0,0,0,.06);display:none;transform-origin:top right;animation:thmIn .18s ease}' +
    '.thm.open .thm-p{display:block}' +
    '@keyframes thmIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}' +
    '.thm-h{font-size:14px;color:var(--ink-soft);letter-spacing:.12em;margin:0 4px 10px}' +
    '.thm-g{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 4px}' +
    '.thm-o{border:0;background:none;padding:0;display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;font:inherit;color:var(--ink-soft);font-size:13px;letter-spacing:0;white-space:nowrap;box-shadow:none}' +
    '.thm-o span{width:36px;height:36px;border-radius:50%;position:relative;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}' +
    '.thm-o span::after{content:"";position:absolute;right:-1px;bottom:-1px;width:14px;height:14px;border-radius:50%;background:var(--sw-a);box-shadow:0 0 0 2px var(--paper)}' +
    '.thm-o.on{color:var(--ink);font-weight:600}' +
    '.thm-o.on span{box-shadow:0 0 0 2px var(--paper),0 0 0 4px var(--ink-soft)}' +
    '.thm-m{display:flex;background:var(--bg-2,var(--hair));border-radius:12px;padding:3px;margin:0 2px 14px}' +
    '.thm-m button{flex:1;border:0;background:none;font:inherit;font-size:14px;padding:7px 0;border-radius:9px;color:var(--ink-soft);cursor:pointer;white-space:nowrap;box-shadow:none;display:inline-flex;align-items:center;justify-content:center;gap:4px;flex-direction:row;letter-spacing:.04em}' +
    '.thm-m button svg{width:14px;height:14px}' +
    '.thm-m button.on{background:var(--paper);color:var(--ink);font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,.12)}' +
    '.thm-tip{font-size:12px;color:var(--ink-faint);margin:-8px 4px 12px;white-space:nowrap}' +
    // ── 深色模式：實心按鈕改用較深的同色，白字才看得清楚；固定的咖啡色字改用提醒色 ──
    'html[data-mode=dark] button.in:not(.secondary){background:linear-gradient(160deg,var(--sage),color-mix(in srgb,var(--sage) 70%,#000))}' +
    'html[data-mode=dark] button.out:not(.secondary),html[data-mode=dark] .ask-ok{background:linear-gradient(160deg,var(--mist),color-mix(in srgb,var(--mist) 70%,#000))!important}' +
    'html[data-mode=dark] #workBox .bar span{background:linear-gradient(90deg,color-mix(in srgb,var(--sage) 60%,#000),var(--sage))}' +
    'html[data-mode=dark] .sbtn.go,html[data-mode=dark] .cf-ok,html[data-mode=dark] .bar .fixbtn{background:color-mix(in srgb,var(--rose) 78%,#000)}' +
    'html[data-mode=dark] .cf-ok.danger,html[data-mode=dark] .nbadge{background:color-mix(in srgb,var(--bad) 70%,#000)}' +
    'html[data-mode=dark] .chip.on{background:color-mix(in srgb,var(--rose) 80%,#000)}' +
    'html[data-mode=dark] .store.pick.empty,html[data-mode=dark] .store-hint.warn,html[data-mode=dark] .msg.warn,html[data-mode=dark] .tag.bad,' +
      'html[data-mode=dark] .done-note,html[data-mode=dark] .ask-ico{color:var(--rose)}' +
    'html[data-mode=dark] .msg.err{color:#E8ABA2}' +
    'html[data-mode=dark] .stat.abn.has{background:var(--paper);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--amber) 45%,transparent),var(--shadow)}' +
    'html[data-mode=dark] .person .ab{border:1px solid color-mix(in srgb,var(--amber) 22%,transparent)}' +
    'html[data-mode=dark] .photo.has{background:var(--bg-2,var(--hair))}' +
    'html[data-mode=dark] .toast{background:var(--ink);color:var(--bg)}' +
    'html[data-mode=dark] .sw{background:var(--hair)}' +
    'html[data-mode=dark] img.sp-logo,html[data-mode=dark] .hd img{filter:brightness(.92)}' +
    'html[data-mode=dark] .demo{border-color:var(--hair)}' +
    'html[data-mode=dark] body{color-scheme:dark}' +
    'html[data-mode=dark] input,html[data-mode=dark] select{color-scheme:dark}';

  function hz() { try { if (navigator.vibrate) navigator.vibrate(6); } catch (e) {} }
  function mark() {
    document.querySelectorAll('.thm-o').forEach(function (b) { b.classList.toggle('on', b.dataset.k === cur); });
    document.querySelectorAll('.thm-m button').forEach(function (b) { b.classList.toggle('on', b.dataset.m === mode); });
  }
  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var host = document.querySelector('.head-r') || document.querySelector('header');
    if (!host) return;
    var w = document.createElement('div'); w.className = 'thm';
    w.innerHTML = '<button class="thm-b" type="button" aria-label="選擇色系"><i></i></button>' +
      '<div class="thm-p" role="menu"><div class="thm-h">顯示模式</div>' +
      '<div class="thm-m">' +
        '<button type="button" data-m="auto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>自動</button>' +
        '<button type="button" data-m="light"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>淺色</button>' +
        '<button type="button" data-m="dark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/></svg>深色</button>' +
      '</div><div class="thm-tip">自動：晚上 7 點後，或手機設成深色時</div>' +
      '<div class="thm-h">選擇色系</div><div class="thm-g">' +
      ORDER.map(function (k) {
        var t = T[k];
        return '<button class="thm-o" type="button" data-k="' + k + '" style="--sw-a:' + t[10] + '">' +
          '<span style="background:linear-gradient(135deg,' + t[2] + ',' + t[3] + ')"></span>' + t[0] + '</button>';
      }).join('') + '</div></div>';
    host.appendChild(w);
    w.querySelector('.thm-b').addEventListener('click', function (e) { e.stopPropagation(); hz(); w.classList.toggle('open'); });
    w.querySelectorAll('.thm-m button').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); hz(); window.UC_THEMES.setMode(b.dataset.m); });
    });
    w.querySelectorAll('.thm-o').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); hz(); window.UC_THEMES.apply(b.dataset.k); setTimeout(function () { w.classList.remove('open'); }, 160); });
    });
    document.addEventListener('click', function (e) { if (!w.contains(e.target)) w.classList.remove('open'); });
    mark();
  }
  /* ── 鬧鐘寶寶小插圖：sleep 睡覺／happy 開心／oops 疑惑／calm 平常／in 上班（太陽髮夾）／out 下班（抱著月亮）
        節日自動換配件：春節紅包、中秋月餅、聖誕帽 ── */
  var CNY = ['2026-02-17', '2027-02-06', '2028-01-26', '2029-02-13', '2030-02-03'];
  var MID = ['2026-09-25', '2027-09-15', '2028-10-03', '2029-09-22', '2030-09-12'];
  function holiday(d) {
    d = d || new Date();
    var t = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), DAY = 86400000;
    var near = function (list, before, after) {
      return list.some(function (x) { var p = x.split('-'), c = Date.UTC(+p[0], +p[1] - 1, +p[2]); return t >= c - before * DAY && t <= c + after * DAY; });
    };
    if (near(CNY, 1, 5)) return 'cny';
    if (near(MID, 3, 1)) return 'mid';
    if (d.getMonth() === 11 && d.getDate() >= 18 && d.getDate() <= 25) return 'xmas';
    return '';
  }
  window.UC_HOLIDAY = holiday;
  window.UC_MASCOT = function (kind, opts) {
    var eye = '#5E574F', face, extra = '';
    var smile = '<path d="M50 68q10 10 20 0" fill="#E99A8C" stroke="' + eye + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
    var happyEyes = '<path d="M44 58q4-5 8 0M68 58q4-5 8 0" fill="none" stroke="' + eye + '" stroke-width="2.6" stroke-linecap="round"/>';
    if (kind === 'happy' || kind === 'in') {
      face = happyEyes + smile;
      if (kind === 'happy') face += '<path d="M100 18l2.2 5 5 2.2-5 2.2-2.2 5-2.2-5-5-2.2 5-2.2z" fill="#F6D98E"/><path d="M16 40l1.6 3.6 3.6 1.6-3.6 1.6-1.6 3.6-1.6-3.6-3.6-1.6 3.6-1.6z" fill="#F6D98E"/>';
      if (kind === 'in') extra = '<g transform="translate(88 30)"><g stroke="#F3C969" stroke-width="2.6" stroke-linecap="round"><path d="M0-15v4M0 11v4M-15 0h4M11 0h4M-10.6-10.6l2.8 2.8M7.8 7.8l2.8 2.8M-10.6 10.6l2.8-2.8M7.8-7.8l2.8-2.8"/></g><circle r="7.5" fill="#F8D978"/><circle cx="-2.4" cy="-1" r="1" fill="' + eye + '"/><circle cx="2.4" cy="-1" r="1" fill="' + eye + '"/><path d="M-2 2q2 2 4 0" fill="none" stroke="' + eye + '" stroke-width="1" stroke-linecap="round"/></g>';
    } else if (kind === 'out') {
      face = '<path d="M43 58q5 4 10 0M67 58q5 4 10 0" fill="none" stroke="' + eye + '" stroke-width="2.6" stroke-linecap="round"/>' +
        '<path d="M54 68q6 5 12 0" fill="none" stroke="' + eye + '" stroke-width="2.4" stroke-linecap="round"/>';
      extra = '<g transform="translate(92 74) rotate(-15)"><path d="M8-12a13 13 0 1 0 6 23a10 10 0 0 1-6-23z" fill="#D9D3F0"/><circle cx="1" cy="1" r="1.2" fill="' + eye + '" opacity=".6"/></g>' +
        '<path d="M86 86q4 4 10 2" fill="none" stroke="#F4D4C8" stroke-width="5" stroke-linecap="round"/>' +
        '<g fill="#C9C3E6"><circle cx="102" cy="22" r="1.6"/><circle cx="110" cy="34" r="1.1"/><circle cx="18" cy="30" r="1.3"/></g>';
    } else if (kind === 'oops') face =
      '<circle cx="48" cy="58" r="3" fill="' + eye + '"/><circle cx="72" cy="58" r="3" fill="' + eye + '"/>' +
      '<path d="M53 71q7-4 14 0" fill="none" stroke="' + eye + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M86 40q4 6 0 9q-4-3 0-9z" fill="#AFC8DE"/>';
    else if (kind === 'calm') face =
      '<circle cx="48" cy="58" r="3" fill="' + eye + '"/><circle cx="72" cy="58" r="3" fill="' + eye + '"/>' +
      '<path d="M54 68q6 5 12 0" fill="none" stroke="' + eye + '" stroke-width="2.4" stroke-linecap="round"/>';
    else face =
      '<path d="M43 58q5 4 10 0M67 58q5 4 10 0" fill="none" stroke="' + eye + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<ellipse cx="60" cy="70" rx="3.2" ry="2.6" fill="' + eye + '" opacity=".75"/>' +
      '<g fill="none" stroke="var(--ink-faint,#A3AEB7)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M96 12h8l-8 9h8"/><path d="M108 26h5l-5 6h5"/></g>';
    // 節日配件
    var hol = opts && opts.holiday !== undefined ? opts.holiday : holiday(), acc = '';
    if (hol === 'xmas' && kind === 'in') extra = extra.replace('translate(88 30)', 'translate(30 30)');
    if (hol === 'xmas') acc = '<g><path d="M40 30q20-26 44-6l6 4q-4 2-8 1z" fill="#C8584C"/><path d="M38 30q22-6 46-2" fill="none" stroke="#FFF8F2" stroke-width="7" stroke-linecap="round"/><circle cx="90" cy="30" r="5" fill="#FFF8F2"/></g>';
    if (hol === 'cny') acc = '<g transform="translate(14 64) rotate(-12)"><rect x="-8" y="-11" width="16" height="22" rx="2.5" fill="#D6493D"/><path d="M-8-5q8 6 16 0" fill="none" stroke="#B7362C" stroke-width="1.4"/><circle cy="1" r="3.4" fill="#F2C35B"/></g>' +
      '<path d="M22 70q4 4 8 2" fill="none" stroke="#F4D4C8" stroke-width="5" stroke-linecap="round"/>' +
      '<g transform="translate(44 18)"><circle r="5" fill="#E05A4C"/><circle r="2" fill="#F6C760"/></g>';
    if (hol === 'mid') acc = '<g transform="translate(15 68)"><circle r="11" fill="#D9A15F"/><circle r="8" fill="none" stroke="#B9813F" stroke-width="1.4" stroke-dasharray="2.5 2"/><path d="M-3-3h6v6h-6z" fill="none" stroke="#B9813F" stroke-width="1.3" transform="rotate(45)"/></g>' +
      '<path d="M24 74q4 4 8 2" fill="none" stroke="#F4D4C8" stroke-width="5" stroke-linecap="round"/>';
    return '<svg class="mascot" viewBox="0 0 120 112" aria-hidden="true">' +
      '<ellipse cx="60" cy="106" rx="30" ry="4" fill="var(--hair,#E3E8EC)"/>' +
      '<path d="M40 96l-6 8M80 96l6 8" stroke="#D9A595" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M48 20q12-8 24 0" fill="none" stroke="#D9A595" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="31" cy="26" r="13" fill="#EBB9AA"/><circle cx="89" cy="26" r="13" fill="#EBB9AA"/>' +
      '<circle cx="60" cy="61" r="40" fill="#F4D4C8"/><circle cx="60" cy="61" r="32" fill="#FFF8F2"/>' +
      '<ellipse cx="41" cy="67" rx="5" ry="3.2" fill="#F2B8AE" opacity=".8"/><ellipse cx="79" cy="67" rx="5" ry="3.2" fill="#F2B8AE" opacity=".8"/>' +
      face + extra + acc + '</svg>';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
