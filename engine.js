// ============================================================
// 《飘·黛玉重归》互动文游 引擎 v3 — 仅追加语音 + BGM + 静音按钮
// 原图片逻辑、节点渲染、属性系统、结局分支全部保留不变。
// ============================================================
(function () {
  'use strict';

  // ---- 合并全部数据 ----
  const NODES = Object.assign({}, NODES1, NODES2, NODES3, NODES4);

  // ---- 人物 who → 底图映射（原版图片逻辑） ----
  // 旁白段落、非人物 choice/route、过渡文字：统一使用 旁白2233.png
  // 人物对话：who 对应到同名人物 png
  const WHO_IMG = {
    '你': '你.png',
    '紫鹃': '紫鹃.png',
    '贾宝玉': '贾宝玉.png',
    '北静王': '北静王.png',
    '甄宝玉': '甄宝玉.png'
  };
  const NARRATOR_IMG = '旁白2233.png';

  // ---- 游戏状态 ----
  let S = {};
  let curSentIdx = 0;
  let curSentences = [];
  let curCallback = null;
  let waitingFx = false;
  let panelOpen = false;
  let curLineArr = null;
  let curLineIdx = -1;
  let curLineKey = null;
  let _curWho = '';
  let curLineText = '';
  let audioMuted = false;

  // user gesture tracker：记录最近一次用户点击的时间（ms）
  let lastUserGesture = Date.now();
  function markGesture() { lastUserGesture = Date.now(); }
  document.addEventListener('click', markGesture, true);
  document.addEventListener('keydown', markGesture, true);
  document.addEventListener('touchend', markGesture, true);

  // ---- DOM 引用 ----
  const $wrap     = document.getElementById('wrap');
  const $bg       = document.getElementById('bg');
  const $panelBtn = document.getElementById('panelBtn');
  const $panel    = document.getElementById('panel');
  const $fxPopup  = document.getElementById('fxPopup');
  const $unlock   = document.getElementById('unlockChip');

  // ---- 结局解锁计数 ----
  const LS_KEY = 'dyg_unlocked_endings';
  function loadUnlocked() {
    try { var arr = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); return Array.isArray(arr) ? arr : []; }
    catch (e) { return []; }
  }
  function renderUnlock() {
    var n = Math.min(loadUnlocked().length, 7);
    $unlock.textContent = '结局已解锁 ' + n + '/7';
  }
  function unlockEnding(id) {
    var list = loadUnlocked();
    if (list.indexOf(id) < 0) {
      list.push(id);
      try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) {}
    }
    renderUnlock();
  }

  // ---- BGM ----
  const bgmAudio = new Audio('assets/bgm/bgm_main.mp3');
  bgmAudio.loop = true;
  bgmAudio.volume = 0.55;
  function tryStartBgm() {
    if (audioMuted) return;
    var p = bgmAudio.play();
    if (p && p.catch) p.catch(function () {});
  }
  document.addEventListener('click', function onceStartBgm() {
    tryStartBgm();
    document.removeEventListener('click', onceStartBgm);
  }, true);

  // ---- 语音系统 ----
  var voiceIndex = null;
  var voicePageIndex = null;
  var voiceRequestToken = 0;
  var voiceAudioContext = null;
  var voiceGain = null;
  var activeVoiceSource = null;
  var voiceBusy = false;
  var voiceTailTimer = null;
  var voiceBufferCache = {};

  function getVoiceAudioContext() {
    if (!voiceAudioContext) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      voiceAudioContext = new Ctx();
      voiceGain = voiceAudioContext.createGain();
      voiceGain.gain.value = 0.95;
      voiceGain.connect(voiceAudioContext.destination);
    }
    return voiceAudioContext;
  }

  function loadVoiceIndexes(cb) {
    if (voiceIndex && voicePageIndex) { cb(voiceIndex, voicePageIndex); return; }
    Promise.all([
      fetch('assets/voice/voice_segments.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }),
      fetch('assets/voice/voice_page_index.json', { cache: 'no-cache' }).then(function (r) { return r.json(); })
    ]).then(function (all) {
      voiceIndex = all[0] || {};
      voicePageIndex = all[1] || {};
      cb(voiceIndex, voicePageIndex);
    }).catch(function () {
      voiceIndex = voiceIndex || {};
      voicePageIndex = voicePageIndex || {};
      cb(voiceIndex, voicePageIndex);
    });
  }

  function loadVoiceBuffer(fn, isPageVoice, cb, fail) {
    var isRootVoice = isPageVoice || /^pron_/.test(fn) || /^vp_/.test(fn);
    var cacheKey = (isRootVoice ? 'root:' : 'line:') + fn;
    var cached = voiceBufferCache[cacheKey];
    if (cached && typeof cached.then !== 'function') { cb(cached); return; }
    if (!cached) {
      var ctx = getVoiceAudioContext();
      var url = isRootVoice ? (fn + '.mp3') : ('assets/voice/' + fn + '.mp3');
      cached = fetch(url)
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
        .then(function (buf) { return ctx.decodeAudioData(buf); });
      voiceBufferCache[cacheKey] = cached;
    }
    cached.then(function (buffer) { voiceBufferCache[cacheKey] = buffer; cb(buffer); }).catch(function (e) {
      delete voiceBufferCache[cacheKey]; if (fail) fail(e);
    });
  }

  function normalizedVoiceKey(who, text) {
    try {
      text = text.normalize('NFKC').replace(/[\u2EC5\u2EDB\u2EDD\u2ED3\u2E9F]/g, function (m) {
        return ({'\u2EC5':'\u89C1','\u2EDB':'\u98CE','\u2EDD':'\u98DF','\u2ED3':'\u957F','\u2E9F':'\u6BCD'})[m] || m;
      });
    } catch (e) {}
    return who + '\x01' + text;
  }

  function playLineVoice(who, text, pageIndex) {
    stopAllVoice();
    if (audioMuted) { setVoiceStatus('idle', '\uD83C\uDFA4 \u5DF2\u9759\u97F3'); return; }
    if (!who || who === '\u65C1\u767D') { setVoiceStatus('idle', '\uD83C\uDFA4 \u65C1\u767D'); return; }
    who = String(who).trim(); text = String(text || ''); pageIndex = Math.max(0, Number(pageIndex) || 0);
    voiceBusy = true;
    var token = voiceRequestToken;
    setVoiceStatus('idle', '\uD83C\uDFA4 \u67E5\u8BE2 ' + who + '...');
    loadVoiceIndexes(function (idx, pageIdx) {
      if (token !== voiceRequestToken) return;
      var pages = splitSentences(text);
      var generatedPages = text.match(/[^\u3002\uFF1F\uFF01\u2026]+[\u3002\uFF1F\uFF01\u2026]+/g) || [text];
      var pageText = pages[pageIndex] || '';
      var pageLookupText = pageText.replace(/[\uFF09\u3011\u201D\u2019\u300B\u3009\u300D\u300F\]\}]+$/, '');
      var pageFn = generatedPages.length >= 2 ? (
        pageIdx[who + '\x01' + pageText] || pageIdx[normalizedVoiceKey(who, pageText)] ||
        pageIdx[who + '\x01' + pageLookupText] || pageIdx[normalizedVoiceKey(who, pageLookupText)]
      ) : null;
      var entry = idx[who + '\x01' + text] || idx[normalizedVoiceKey(who, text)];
      if (!pageFn && !entry) { voiceBusy = false; setVoiceStatus('miss', '\uD83C\uDFA4 \u2717 ' + who); return; }
      var fn, isPageVoice, playWholeEntry = false, startAt = 0, endAt = 0;
      if (pageFn) {
        fn = pageFn; isPageVoice = true;
      } else {
        fn = typeof entry === 'string' ? entry : entry.file;
        var segments = entry.segments || [];
        var segment = segments[pageIndex] || null;
        // A one-page line owns the whole file; subtitle timestamps must not trim its tail.
        playWholeEntry = segments.length <= 1;
        startAt = segment ? Number(segment.start) || 0 : 0;
        endAt = segment ? Number(segment.end) || 0 : 0;
        isPageVoice = false;
      }
      loadVoiceBuffer(fn, isPageVoice, function (buffer) {
        if (token !== voiceRequestToken) return;
        var ctx = getVoiceAudioContext();
        var playFullBuffer = isPageVoice || playWholeEntry;
        var start = playFullBuffer ? 0 : Math.max(0, Math.min(startAt, buffer.duration));
        var end = playFullBuffer ? buffer.duration : (endAt > start ? Math.min(endAt, buffer.duration) : buffer.duration);
        var duration = Math.max(0.01, end - start);
        var source = ctx.createBufferSource();
        source.buffer = buffer; source.connect(voiceGain); activeVoiceSource = source;
        source.onended = function () {
          if (token !== voiceRequestToken) return;
          activeVoiceSource = null;
          if (voiceTailTimer) clearTimeout(voiceTailTimer);
          // Keep a short natural pause after the final phoneme before allowing page advance.
          voiceTailTimer = setTimeout(function () {
            if (token === voiceRequestToken) {
              voiceTailTimer = null;
              voiceBusy = false;
              setVoiceStatus('idle', '\uD83C\uDFA4 ' + who + ' \u2713');
            }
          }, 450);
        };
        var resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
        resume.then(function () {
          if (token !== voiceRequestToken) return;
          source.start(0, start, duration);
          setVoiceStatus('play', '\uD83C\uDFA4 ' + who + ' ' + (pageIndex + 1) + '/' + Math.max(pages.length, 1));
        }).catch(function () { voiceBusy = false; setVoiceStatus('miss', '\uD83C\uDFA4 \u26A0 ' + who); });
      }, function (e) {
        if (window.__voiceDebug) console.log('[voice decode fail]', fn, e && e.message);
        voiceBusy = false; setVoiceStatus('miss', '\uD83C\uDFA4 \u26A0 ' + who);
      });
    });
  }

  function stopAllVoice() {
    voiceRequestToken++;
    voiceBusy = false;
    if (voiceTailTimer) { clearTimeout(voiceTailTimer); voiceTailTimer = null; }
    if(activeVoiceSource){
      try{ activeVoiceSource.onended=null; activeVoiceSource.stop(0); activeVoiceSource.disconnect(); }catch(e){}
      activeVoiceSource=null;
    }
  }

  var voiceChip = null;
  function setVoiceStatus(status, label) {
    if (!voiceChip) {
      voiceChip = document.createElement('div');
      voiceChip.id = 'voiceChip';
      voiceChip.className = 'chip';
      var bar = document.getElementById('topBar');
      if (bar) bar.appendChild(voiceChip);
    }
    voiceChip.textContent = label;
    voiceChip.style.color = status === 'play' ? '#1f7a33' : (status === 'miss' ? '#b03030' : '#888');
    voiceChip.style.fontWeight = status === 'play' ? 'bold' : 'normal';
  }

  function injectMuteBtn() {
    var bar = document.getElementById('topBar');
    if (!bar || document.getElementById('muteChip')) return;
    var chip = document.createElement('div');
    chip.id = 'muteChip';
    chip.className = 'chip';
    chip.style.cursor = 'pointer';
    chip.textContent = audioMuted ? '🔇 已静音' : '🔊 声音';
    chip.addEventListener('click', function (e) {
      e.stopPropagation();
      audioMuted = !audioMuted;
      if (audioMuted) {
        stopAllVoice();
        try { bgmAudio.pause(); } catch (e) {}
      } else {
        tryStartBgm();
        if (_curWho && _curWho !== '\u65C1\u767D' && curLineText) {
          playLineVoice(_curWho, curLineText, curSentIdx);
        }
      }
      chip.textContent = audioMuted ? '🔇 已静音' : '🔊 声音';
    });
    bar.appendChild(chip);
    setVoiceStatus('idle', '🎤 待播');
  }

  // ---- 句子切分 ----
  function splitSentences(text) {
    const out = [];
    const re = /[^\u3002\uFF1F\uFF01\u2026]+[\u3002\uFF1F\uFF01\u2026]+/g;
    let m;
    let lastEnd = 0;
    while ((m = re.exec(text)) !== null) { out.push(m[0]); lastEnd = re.lastIndex; }
    if (lastEnd < text.length && text.slice(lastEnd).trim()) {
      var tail = text.slice(lastEnd);
      // Closing brackets/quotes belong to the previous page; never show them alone.
      if (out.length && /^[\s\uFF09\u3011\u201D\u2019\u300B\u3009\u300D\u300F\]\}]+$/.test(tail)) out[out.length - 1] += tail;
      else out.push(tail);
    }
    if (out.length === 0 && text.trim()) out.push(text);
    return out;
  }

  // ---- 属性面板 ----
  const PANEL_ORDER = ['zhi','shan','ti','jia','bei','zhen','dm','be'];
  function renderPanel() {
    $panel.innerHTML = PANEL_ORDER.map(function (k) {
      var name = (k === 'be') ? CFG.beName : CFG.statNames[k];
      var val = (S[k] !== undefined ? S[k] : 0);
      return '<div class="stat-row"><span>' + name + '</span><span>' + val + '</span></div>';
    }).join('');
  }

  $panelBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    panelOpen = !panelOpen;
    $panel.classList.toggle('open', panelOpen);
    renderPanel();
  });

  // ---- 属性变动 ----
  function applyFx(fx) {
    if (!fx) return;
    for (var k in fx) {
      if (k === 'be') { S.be = (S.be || 0) + fx[k]; }
      else if (k === 'zhi2') { S.zhi += fx[k]; }
      else if (S[k] !== undefined) { S[k] += fx[k]; }
    }
    if (fx.dm) { ['zhi', 'shan', 'ti'].forEach(function (k) { if (fx[k]) S.dmGain[k] += fx[k]; }); }
    renderPanel();
  }

  // ---- 属性变动弹窗 ----
  function showFxPopup(fx, cb) {
    if (!fx || Object.keys(fx).length === 0) { if (cb) cb(); return; }
    var names = CFG.statNames;
    var html = '<div class="fx-inner"><div class="fx-title">属性变动</div>';
    for (var k in fx) {
      var label = (k === 'be') ? CFG.beName : (k === 'zhi2' ? CFG.statNames.zhi : (names[k] || k));
      var v = fx[k];
      var cls = v > 0 ? 'up' : 'down';
      html += '<div class="fx-row ' + cls + '">' + label + (v > 0 ? ' +' : ' ') + v + '</div>';
    }
    html += '</div>';
    $fxPopup.innerHTML = html;
    $fxPopup.classList.add('show');
    var anchor = $wrap.querySelector('.dialog-box') || $wrap.querySelector('.choice-box');
    if (anchor) {
      var r = anchor.getBoundingClientRect();
      var wr = $wrap.getBoundingClientRect();
      var top = (r.top - wr.top) - $fxPopup.offsetHeight - 12;
      if (top < 8) top = 8;
      $fxPopup.style.top = top + 'px';
    } else { $fxPopup.style.top = '80px'; }
    waitingFx = true;
    setTimeout(function () {
      $fxPopup.classList.remove('show');
      waitingFx = false;
      if (cb) cb();
    }, 1800);
  }

  // ---- 背景底图（原版逻辑：根据 who / img 选择） ----
  function setBgForNode(node) {
    // img 节点：直接用 images/<img>.png
    if (node.img) {
      $bg.src = 'images/' + node.img + '.png';
      if (node.img === '背景四2') $wrap.classList.add('dark-bg');
      else $wrap.classList.remove('dark-bg');
      return;
    }
    // 人物对话（有 who 且为人物）：who 对应的人物 png
    if (node.who && WHO_IMG[node.who]) {
      $bg.src = 'images/' + WHO_IMG[node.who];
      $wrap.classList.remove('dark-bg');
      return;
    }
    // 其余（旁白 / choice / route / 无 who）：旁白2233
    $bg.src = 'images/' + NARRATOR_IMG;
    $wrap.classList.remove('dark-bg');
  }

  // ---- 清空浮层 ----
  function clearOverlay() {
    var old = $wrap.querySelectorAll('.dialog-box, .choice-box, .end-box, .modal-overlay, .dialog-nav');
    old.forEach(function (el) { el.remove(); });
  }

  // ---- Dialogue page navigation ----
  var mode = null;
  var imgNext = null;
  var dialogHistory = [];
  var dialogHistoryPos = -1;

  function resetDialogHistory() {
    dialogHistory = [];
    dialogHistoryPos = -1;
  }

  function openDialogHistory(pos, pageIndex) {
    var snap = dialogHistory[pos];
    if (!snap) return;
    dialogHistoryPos = pos;
    setBgForNode({ who: snap.who });
    showDialog(snap.text, snap.who, snap.cb, snap.lineArr, snap.lineIdx, pageIndex, true);
  }

  function refreshDialogPage() {
    var box = $wrap.querySelector('.dialog-box');
    if (!box) return;
    var txtDiv = box.querySelector('.dialog-text');
    if (txtDiv) txtDiv.textContent = curSentences[curSentIdx] || '';
    var prevBtn = $topBar.querySelector('.dialog-prev');
    if (prevBtn) {
      prevBtn.disabled = false;
      prevBtn.setAttribute('aria-disabled', 'false');
    }
  }

  function playCurrentDialogPage() {
    playLineVoice(_curWho, curLineText, curSentIdx);
  }

  function previousDialogPage() {
    if (mode !== 'text') return;
    stopAllVoice();
    if (curSentIdx > 0) {
      curSentIdx--;
      refreshDialogPage();
      playCurrentDialogPage();
    } else if (dialogHistoryPos > 0) {
      var prevPos = dialogHistoryPos - 1;
      var prevPages = splitSentences(dialogHistory[prevPos].text);
      openDialogHistory(prevPos, Math.max(0, prevPages.length - 1));
    } else {
      refreshDialogPage();
      playCurrentDialogPage();
    }
  }

  function nextDialogPage() {
    if (mode !== 'text') return;
    stopAllVoice();
    if (curSentIdx < curSentences.length - 1) {
      curSentIdx++;
      refreshDialogPage();
      playCurrentDialogPage();
    } else if (dialogHistoryPos < dialogHistory.length - 1) {
      openDialogHistory(dialogHistoryPos + 1, 0);
    } else {
      var cb = curCallback;
      curCallback = null;
      mode = null;
      if (cb) cb();
    }
  }

  function onStageClick(e) {
    e.stopPropagation();
    if (waitingFx) return;
    if (panelOpen) { panelOpen = false; $panel.classList.remove('open'); return; }
    if (voiceBusy) return;
    if (mode === 'text') {
      nextDialogPage();
    } else if (mode === 'img') {
      mode = null;
      go(imgNext);
    } else if (mode === 'end') {
      mode = null;
      resetState();
      go('start');
    }
  }

  // ---- 自动生成文本框 ----
  function showDialog(text, who, cb, lineArr, lineIdx, startPage, fromHistory) {
    if (!fromHistory) {
      if (dialogHistoryPos < dialogHistory.length - 1) dialogHistory = dialogHistory.slice(0, dialogHistoryPos + 1);
      dialogHistory.push({ text: text, who: who, cb: cb || null, lineArr: lineArr || null, lineIdx: lineIdx });
      dialogHistoryPos = dialogHistory.length - 1;
    }
    clearOverlay();
    _curWho = who;  // 记录当前 who 供 mute 恢复使用
    var box = document.createElement('div');
    box.className = 'dialog-box';
    if (who && who !== '旁白') {
      var tag = document.createElement('div');
      tag.className = 'speaker-tag';
      tag.textContent = who;
      box.appendChild(tag);
    }
    var txtDiv = document.createElement('div');
    txtDiv.className = 'dialog-text';
    box.appendChild(txtDiv);

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'dialog-nav dialog-prev';
    prevBtn.textContent = '上页';
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      previousDialogPage();
    });
    $topBar.appendChild(prevBtn);

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'dialog-nav dialog-next';
    nextBtn.textContent = '下页';
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      nextDialogPage();
    });
    $topBar.appendChild(nextBtn);
    $wrap.appendChild(box);

    curSentences = splitSentences(text);
    curSentIdx = Math.max(0, Math.min(Number(startPage) || 0, curSentences.length - 1));
    curCallback = cb || null;
    refreshDialogPage();

    curLineArr = lineArr || null;
    curLineIdx = (typeof lineIdx === 'number') ? lineIdx : -1;
    curLineText = text;
    curLineKey = (lineArr ? (lineIdx + '|') : '') + who + '|' + text.slice(0, 30);
    playLineVoice(who, text, curSentIdx);
    mode = 'text';
  }

  // ---- 自动生成选择条 ----
  function showChoice(node) {
    resetDialogHistory();
    clearOverlay();
    mode = null;
    var box = document.createElement('div');
    box.className = 'choice-box';
    node.opts.forEach(function (opt) {
      var bar = document.createElement('div');
      bar.className = 'choice-bar';
      bar.textContent = opt.label;
      bar.addEventListener('click', function (e) {
        e.stopPropagation();
        applyFx(opt.fx);
        showFxPopup(opt.fx, function () { go(opt.next); });
      });
      box.appendChild(bar);
    });
    $wrap.appendChild(box);
  }

  // ---- 路由节点 ----
  function showRoute(node) {
    resetDialogHistory();
    clearOverlay();
    mode = null;
    var box = document.createElement('div');
    box.className = 'choice-box';
    node.opts.forEach(function (opt) {
      var bar = document.createElement('div');
      bar.className = 'choice-bar';
      bar.textContent = opt.label;
      bar.addEventListener('click', function (e) {
        e.stopPropagation();
        onRoute(opt.route);
      });
      box.appendChild(bar);
    });
    $wrap.appendChild(box);
  }

  // ---- 弹窗 ----
  function showModal(node) {
    resetDialogHistory();
    clearOverlay();
    mode = null;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    var modal = document.createElement('div');
    modal.className = 'modal-box';
    var q = document.createElement('div');
    q.className = 'modal-question';
    q.textContent = node.question;
    modal.appendChild(q);
    node.opts.forEach(function (opt) {
      var btn = document.createElement('div');
      btn.className = 'modal-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        overlay.remove();
        onModalAct(opt.act);
      });
      modal.appendChild(btn);
    });
    overlay.appendChild(modal);
    $wrap.appendChild(overlay);
  }

  // ---- 结局页 ----
  function showEnd(node, id) {
    resetDialogHistory();
    clearOverlay();
    if (node.img) $bg.src = 'images/' + node.img + '.png';
    if (id) unlockEnding(id);
    var box = document.createElement('div');
    box.className = 'end-box';
    var title = document.createElement('div');
    title.className = 'end-title';
    title.textContent = node.title;
    box.appendChild(title);
    var text = document.createElement('div');
    text.className = 'end-text';
    text.textContent = node.text;
    box.appendChild(text);
    $wrap.appendChild(box);
    mode = 'end';
  }

  // ---- BE ----
  function enterBe() {
    if (S.be >= 2) {
      $fxPopup.innerHTML = '<div class="fx-inner"><div class="fx-row down">累计两个Be标记，自动进入Be</div></div>';
      $fxPopup.classList.add('show');
      $fxPopup.style.top = '80px';
      waitingFx = true;
      setTimeout(function () {
        $fxPopup.classList.remove('show');
        waitingFx = false;
        go('be1');
      }, 1800);
    } else { go('be1'); }
  }

  // ---- 状态栏 ----
  const $topBar = document.getElementById('topBar');
  function setStatusBar(visible) {
    $topBar.style.display = visible ? 'flex' : 'none';
    if (!visible) { panelOpen = false; $panel.classList.remove('open'); }
  }

  // ---- 分支数组 ----
  function playArray(arr, idx) {
    if (idx >= arr.length) {
      if (arr.endFx) {
        applyFx(arr.endFx);
        showFxPopup(arr.endFx, function () {
          if (S.be >= 2) enterBe(); else go(arr.next);
        });
      } else {
        if (S.be >= 2) enterBe(); else go(arr.next);
      }
      return;
    }
    var item = arr[idx];
    if (item.t === 'line') {
      // Branch arrays must switch portrait/background for every speaker.
      setBgForNode(item);
      showDialog(item.text, item.who, function () { playArray(arr, idx + 1); }, arr, idx);
    } else {
      playArray(arr, idx + 1);
    }
  }

  // ---- 属性初始化 ----
  function resetState() {
    S = Object.assign({}, CFG.init);
    S.be = 0;
    S.dmGain = { zhi: 0, shan: 0, ti: 0 };
    renderPanel();
  }

  // ---- TE 判定 ----
  function pickTe() {
    var g = S.dmGain;
    return (g.ti >= g.zhi && g.ti >= g.shan) ? 'te1a'
         : (g.zhi >= g.shan ? 'te2a' : 'te3a');
  }

  // ---- 路由处理 ----
  function onRoute(route) {
    if (S.be >= 2) { enterBe(); return; }
    if (route === 'dmfinal') { showModal(NODES.he_popup); return; }
    var heMap = { jia: 'he1a', bei: 'he2a', zhen: 'he3a' };
    var strictlyHighest = (route === 'jia') ? (S.jia > S.bei && S.jia > S.zhen)
      : (route === 'bei') ? (S.bei > S.jia && S.bei > S.zhen)
      : (S.zhen > S.jia && S.zhen > S.bei);
    if (strictlyHighest) { go(heMap[route]); return; }
    if (S.dm >= 5 && S.zhi > 0 && S.shan > 0 && S.ti > 0) { go(pickTe()); return; }
    enterBe();
  }

  // ---- 弹窗动作 ----
  function onModalAct(act) {
    if (act === 'attach') {
      if (S.jia >= S.bei && S.jia >= S.zhen) go('he1a');
      else if (S.bei >= S.zhen) go('he2a');
      else go('he3a');
    } else {
      if (S.dm >= 5 && S.zhi > 0 && S.shan > 0 && S.ti > 0) go(pickTe());
      else enterBe();
    }
  }

  // ---- 主跳转 ----
  function go(id) {
    var node = NODES[id];
    if (!node) { console.error('Missing node:', id); return; }
    if (Array.isArray(node)) { playArray(node, 0); return; }
    switch (node.t) {
      case 'img':
        resetDialogHistory();
        clearOverlay();
        setBgForNode(node);
        setStatusBar(false);
        imgNext = node.next;
        mode = 'img';
        break;
      case 'line':
        setStatusBar(true);
        setBgForNode(node);
        showDialog(node.text, node.who, function () { if (node.next) go(node.next); }, null, -1);
        break;
      case 'choice':
        setStatusBar(true);
        setBgForNode(node);
        showChoice(node);
        break;
      case 'route':
        setStatusBar(true);
        setBgForNode(node);
        showRoute(node);
        break;
      case 'modal':
        setStatusBar(true);
        setBgForNode(node);
        showModal(node);
        break;
      case 'end':
        setStatusBar(false);
        showEnd(node, id);
        break;
    }
  }

  // ---- 初始化 ----
  $wrap.addEventListener('click', onStageClick);
  resetState();
  renderUnlock();
  injectMuteBtn();
  go('start');

  window.__game = {
    go: go,
    state: function () { return S; },
    toggleMute: function () {
      audioMuted = !audioMuted;
      var chip = document.getElementById('muteChip');
      if (chip) chip.textContent = audioMuted ? '🔇 已静音' : '🔊 声音';
      if (audioMuted) { stopAllVoice(); try { bgmAudio.pause(); } catch (e) {} }
      else { tryStartBgm(); }
      return audioMuted;
    },
    // 调试：开启后所有 voice 查找命中/失败都会在控制台打印
    enableVoiceDebug: function () { window.__voiceDebug = true; console.log('[voice debug] 已开启'); },
    disableVoiceDebug: function () { window.__voiceDebug = false; console.log('[voice debug] 已关闭'); },
    // 调试：手动测试一句
    testVoice: function (who, text) {
      console.log('[testVoice] who=' + who + ' text=' + (text || '').slice(0, 30));
      playLineVoice(who, text);
    }
  };

})();
