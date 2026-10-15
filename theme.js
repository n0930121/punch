// UC 打卡系統 — 12 種莫蘭迪色系（右上角色票，點開選擇）
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
  var isQuery = /\/query\/?/.test(location.pathname);
  var KEY = isQuery ? 'uc-theme-query' : 'uc-theme-punch';
  var DEF = isQuery ? 'taro' : 'blue';

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function remember(k) { try { localStorage.setItem(KEY, k); } catch (e) {} }

  function apply(k) {
    var t = T[k] || T[DEF], s = document.documentElement.style;
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
  }
  var cur = T[saved()] ? saved() : DEF;
  apply(cur);
  window.UC_THEMES = { list: ORDER, apply: function (k) { cur = k; apply(k); remember(k); mark(); } };

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
    '.thm-o.on span{box-shadow:0 0 0 2px var(--paper),0 0 0 4px var(--ink-soft)}';

  function mark() {
    document.querySelectorAll('.thm-o').forEach(function (b) { b.classList.toggle('on', b.dataset.k === cur); });
  }
  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var host = document.querySelector('.head-r') || document.querySelector('header');
    if (!host) return;
    var w = document.createElement('div'); w.className = 'thm';
    w.innerHTML = '<button class="thm-b" type="button" aria-label="選擇色系"><i></i></button>' +
      '<div class="thm-p" role="menu"><div class="thm-h">選擇色系</div><div class="thm-g">' +
      ORDER.map(function (k) {
        var t = T[k];
        return '<button class="thm-o" type="button" data-k="' + k + '" style="--sw-a:' + t[10] + '">' +
          '<span style="background:linear-gradient(135deg,' + t[2] + ',' + t[3] + ')"></span>' + t[0] + '</button>';
      }).join('') + '</div></div>';
    host.appendChild(w);
    w.querySelector('.thm-b').addEventListener('click', function (e) { e.stopPropagation(); w.classList.toggle('open'); });
    w.querySelectorAll('.thm-o').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); window.UC_THEMES.apply(b.dataset.k); setTimeout(function () { w.classList.remove('open'); }, 160); });
    });
    document.addEventListener('click', function (e) { if (!w.contains(e.target)) w.classList.remove('open'); });
    mark();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
