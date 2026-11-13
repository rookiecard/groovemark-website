/* Groovemark intake form enhancer. Loaded by the HTML block in GHL form comv5R3sNv06ftsXJRRf.
   Adds step headings, puts fields in reading order, autocomplete, and screen reader wiring.
   Styles live in gm-form.css (loaded below). Edit, push, then bump CSS_V here
   and ?v= on the script tag in the GHL HTML block so browsers fetch the new copy. */
(function(){
  if (window.gmIntake) return; window.gmIntake = 1;
  var CSS_V = '9';
  if (!document.getElementById('gm-form-css')) {
    var ln = document.createElement('link');
    ln.id = 'gm-form-css'; ln.rel = 'stylesheet';
    ln.href = 'https://groovemarkhq.com/intake/gm-form.css?v=' + CSS_V;
    (document.head || document.documentElement).appendChild(ln);
  }
  var Q = function(q){ return '.form-field-wrapper:has([data-q="' + q + '"])'; };
  var SEC = [
    {t:'What we’re setting up', s:[Q('intake_services_wanted')]},
    {t:'Your business', s:[Q('business_name')]},
    {t:'Your web site', n:'Your logo and photos of your work. Optional, but they make the biggest difference.', web:1, s:['.form-field-wrapper:has(.file-upload)']},
    {t:'Your voice agent', n:'How you want your phone answered.', s:[Q('single_line_87lfy'), Q('single_line_832ee'), Q('single_line_86ybk'), Q('radio_53w7x')]},
    {t:'Your social media', n:'How you want your pages run.', s:[Q('radio_55t4a'), Q('which_social_media_package_tt1_copy')],
      noWeb:{n:'Your logo and job photos first, then how you want your pages run.', s:['.form-field-wrapper:has(.file-upload)', Q('radio_55t4a')]}},
    {t:'How I reach you', n:'Last step. Then hit Send to Jonathan.', s:[Q('first_name')]}
  ];
  var MORE = ['radio_50nn4', 'intake:_emergency_or_after-hours_calls', 'intake:_services_missing_from_the_list', 'intake:_3_jobs_you_want_more_of', 'intake:_free_estimates', 'intake:_how_you_get_paid', 'intake:_guarantee_or_warranty', 'intake:_your_story', 'intake:_credentials', 'intake:_most_commonly_asked_questions', 'intake:_reviews_to_feature', 'intake:_anything_else'];
  var AC = {business_name:'organization', email:'email', address:'address-line1', city:'address-level2', state:'address-level1', postal_code:'postal-code', first_name:'name', phone:'tel'};
  var box, busy = false, sig = '';
  function vis(el){ return !!el && el.getBoundingClientRect().height > 4; }
  function one(sel){ return box.querySelector(':scope > ' + sel); }
  function reorder(){
    var first = one(Q('business_name'));
    var want = one(Q('intake_services_wanted'));
    var help = box.querySelector(':scope > .form-field-wrapper:has(#gm-help)');
    if (first && want && want.compareDocumentPosition(first) & 4) { /* already first */ }
    else if (first && want) { box.insertBefore(want, first); if (help) box.insertBefore(help, first); }
    var trade = one('.form-field-wrapper:has([data-q="intake:_other_or_second_trade"])') || one('.form-field-wrapper:has(#ZeBQHddaECX9To4YXoZT)');
    var lists = box.querySelectorAll(':scope > ' + Q('intake:_services:_').replace('="intake:_services:_"', '^="intake:_services:_"'));
    if (trade && lists.length && trade.nextElementSibling !== lists[0]) {
      var after = trade.nextElementSibling;
      for (var i = 0; i < lists.length; i++) box.insertBefore(lists[i], after);
    }
    /* "Add more details now?" sits right under Hours, and every field its Yes opens follows it directly */
    var prev = one(Q('intake:_hours'));
    for (var m = 0; prev && m < MORE.length; m++) {
      var f = one(Q(MORE[m]));
      if (!f) continue;
      if (prev.nextElementSibling !== f) box.insertBefore(f, prev.nextElementSibling);
      prev = f;
    }
    /* Photos open the web site step (after the business details), or the social step when there is no web site */
    var up = one('.form-field-wrapper:has(.file-upload)');
    var web = !!box.querySelector('[data-q="intake_services_wanted"][value="Web Site"]:checked');
    if (up) {
      if (web && prev) {
        var nx = prev.nextElementSibling; /* the step heading may sit between them: that is the right place */
        while (nx && nx.classList.contains('gm-sec')) nx = nx.nextElementSibling;
        if (nx !== up) box.insertBefore(up, prev.nextElementSibling);
      }
      else { var to = one(Q('radio_55t4a')); if (to && up.nextElementSibling !== to) box.insertBefore(up, to); }
    }
    var nae = box.querySelector('.non-address-elements');
    if (nae) {
      var city = nae.querySelector(':scope > div:has([data-q="city"])'), st = nae.querySelector(':scope > div:has([data-q="state"])');
      if (city && st && (st.compareDocumentPosition(city) & 4)) nae.insertBefore(city, st);
    }
  }
  /* Switching trades hides the old trade's service list. Untick what was ticked there so it is not sent with the new trade. */
  function clearHidden(){
    var lists = box.querySelectorAll(':scope > .form-field-wrapper:has([data-q^="intake:_services:_"])');
    for (var i = 0; i < lists.length; i++) {
      if (vis(lists[i])) continue;
      var on = lists[i].querySelectorAll('input[type=checkbox]:checked');
      for (var j = 0; j < on.length; j++) on[j].click();
    }
  }
  function a11y(){
    var f = box.querySelectorAll('input[data-q], textarea[data-q]');
    for (var i = 0; i < f.length; i++) {
      var el = f[i], q = el.getAttribute('data-q');
      if (AC[q] && !el.getAttribute('data-gm')) { el.setAttribute('autocomplete', AC[q]); el.setAttribute('data-gm', 1); }
      if (q === 'phone') el.setAttribute('inputmode', 'tel');
      if (q === 'postal_code') el.setAttribute('inputmode', 'numeric');
      if (el.getAttribute('data-required') === 'true' && el.type !== 'checkbox' && el.type !== 'radio') el.setAttribute('aria-required', 'true');
      if (el.type === 'radio' && !el.name) el.name = 'gm_' + q;
      var item = el.closest('.form-builder--item');
      if (!item) continue;
      var ids = [];
      var hint = item.querySelector('.short-label');
      if (hint && getComputedStyle(hint).display === 'none') hint = null;
      if (hint) { if (!hint.id) hint.id = 'gmh_' + (el.id || q).replace(/\W/g, '_'); ids.push(hint.id); }
      var err = item.querySelector('.error');
      if (err && err.textContent.trim()) { if (!err.id) err.id = 'gme_' + (el.id || q).replace(/\W/g, '_'); ids.unshift(err.id); el.setAttribute('aria-invalid', 'true'); }
      else el.removeAttribute('aria-invalid');
      if (el.type !== 'checkbox' && el.type !== 'radio') { if (ids.length) el.setAttribute('aria-describedby', ids.join(' ')); else el.removeAttribute('aria-describedby'); }
    }
    var groups = box.querySelectorAll('[id$="-checkbox-container"], [id$="-bubble-option-container"]');
    for (var g = 0; g < groups.length; g++) {
      var grp = groups[g], lab = box.querySelector('label[for="' + grp.id + '"]');
      grp.setAttribute('role', /bubble-option/.test(grp.id) ? 'radiogroup' : 'group');
      if (lab) { if (!lab.id) lab.id = grp.id + '-l'; grp.setAttribute('aria-labelledby', lab.id); }
      var it = grp.closest('.form-builder--item'), d = [];
      var h2 = it && it.querySelector('.short-label'), e2 = it && it.querySelector('.error');
      if (h2 && getComputedStyle(h2).display === 'none') h2 = null;
      if (e2 && e2.textContent.trim()) { if (!e2.id) e2.id = grp.id + '-e'; d.push(e2.id); }
      if (h2) { if (!h2.id) h2.id = grp.id + '-h'; d.push(h2.id); }
      if (d.length) grp.setAttribute('aria-describedby', d.join(' ')); else grp.removeAttribute('aria-describedby');
      if (it && it.querySelector('[data-required="true"]')) grp.setAttribute('aria-required', 'true');
    }
    var combos = box.querySelectorAll('[role="combobox"], .multiselect');
    for (var c = 0; c < combos.length; c++) {
      var cb = combos[c], wrap = cb.closest('.form-builder--item'), cl = wrap && wrap.querySelector('label');
      if (!cl) continue;
      if (!cl.id) cl.id = 'gml_' + c;
      cb.setAttribute('aria-labelledby', cl.id);
      var ci = cb.querySelector('input'); if (ci) ci.setAttribute('aria-labelledby', cl.id);
      if (/\*/.test(cl.textContent)) cb.setAttribute('aria-required', 'true');
    }
    var errs = box.querySelectorAll('.error');
    for (var k = 0; k < errs.length; k++) { var p = errs[k].parentNode; if (p && !p.getAttribute('aria-live')) p.setAttribute('aria-live', 'polite'); }
  }
  function heads(){
    var plan = [];
    var web = !!box.querySelector('[data-q="intake_services_wanted"][value="Web Site"]:checked');
    for (var i = 0; i < SEC.length; i++) {
      var sec = SEC[i];
      if (sec.web && !web) continue;
      if (sec.noWeb && !web) sec = {t: sec.t, n: sec.noWeb.n, s: sec.noWeb.s};
      var at = null;
      for (var j = 0; j < sec.s.length && !at; j++) { var c = one(sec.s[j]); if (vis(c)) at = c; }
      if (at) plan.push([sec, at]);
    }
    var key = plan.map(function(p){ return p[0].t + p[0].n + '@' + p[1].id; }).join('|');
    if (key === sig) return; sig = key;
    var old = box.querySelectorAll(':scope > .gm-sec');
    for (var o = 0; o < old.length; o++) old[o].remove();
    for (var n = 0; n < plan.length; n++) {
      var d = document.createElement('div');
      d.className = 'gm-sec' + (n === 0 ? ' gm-first' : '');
      d.innerHTML = '<p class="gm-step">Step ' + (n + 1) + ' of ' + plan.length + '</p><h2>' + plan[n][0].t + '</h2>' + (plan[n][0].n ? '<p class="gm-note">' + plan[n][0].n + '</p>' : '');
      box.insertBefore(d, plan[n][1]);
    }
  }
  function run(){
    if (busy) return; busy = true;
    setTimeout(function(){
      try { reorder(); clearHidden(); a11y(); heads(); } catch (e) {}
      busy = false;
    }, 30);
  }
  /* ---- Send guard v2 (11/12/2026): pressing Send must never look like "nothing happened".
     After a press the form says what is going on, in plain words, at the button AND at the first
     thing that needs fixing: every missing or wrong answer by name (tap one to jump to it), the
     "Verify you are human" check GHL's spam filter sometimes shows, sending, or sent.
     If it will not go through, it offers to text (phone) or email (computer) the answers, already
     typed in, or to copy them. ---- */
  var PHONE = '+14062098235', PHONE_TXT = '406-209-8235', MAIL = 'jonathan@groovemarkhq.com';
  var stat, topBox, altBox, pressed = 0, sentDone = false, timer = 0, jumped = false, hadBad = false, items = [], anchor = null;
  var ONPHONE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || (window.matchMedia && matchMedia('(pointer: coarse)').matches && (navigator.maxTouchPoints || 0) > 0);
  function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function up(msg){ try { if (window.parent && window.parent !== window) window.parent.postMessage(msg, '*'); } catch (e) {} }
  function docTop(el){ return Math.round(el.getBoundingClientRect().top + (window.pageYOffset || 0)); }
  function goTo(el){
    if (!el) return;
    try { el.scrollIntoView({block: 'center'}); } catch (e) { try { el.scrollIntoView(); } catch (e2) {} }
    up({gmIntake: 'scroll', top: docTop(el)});
  }
  function btn(){ return document.querySelector('.form-builder--btn-submit button, button[type="submit"]'); }
  function formUp(){ var f = document.querySelector('[data-q="business_name"]'); return !!f && vis(f); }
  function labelOf(it){ var l = it.querySelector('label'); return l ? l.textContent.replace(/\*/g, '').replace(/\s+/g, ' ').trim() : ''; }
  /* Everything the form is still asking for: [{el, name, why}] */
  function problems(){
    var out = [], seen = [], e = box ? box.querySelectorAll('.error') : [];
    for (var i = 0; i < e.length; i++) {
      var txt = e[i].textContent.replace(/\s+/g, ' ').trim();
      if (!txt || !vis(e[i])) continue;
      var it = e[i].closest('.form-builder--item') || e[i].closest('.form-field-wrapper');
      if (!it || seen.indexOf(it) >= 0) continue;
      seen.push(it);
      var name = labelOf(it) || 'This question';
      var why = /required/i.test(txt) ? 'needs an answer' : txt.replace(name, '').replace(/^\s*(is|:)\s*/i, '').trim() || 'needs a look';
      if (/invalid|valid/i.test(txt) && !/required/i.test(txt)) why = 'doesn’t look right. Check for a typo';
      out.push({el: it, name: name, why: why});
    }
    return out;
  }
  function human(){ /* GHL's spam check (Cloudflare) when it steps in: 0 none, 1 checking, 2 needs a tick */
    var c = document.querySelector('.recaptcha-container');
    if (!c || !vis(c)) return 0;
    return /challenge|verification failed|captcha|try again/i.test(c.textContent) ? 2 : 1;
  }
  function hiccup(){ /* GHL's own "something went wrong" note, wherever it prints it near the button */
    var w = box && box.querySelector(':scope > .form-field-wrapper:has(.form-builder--btn-submit)');
    if (!w) return false;
    var c = w.cloneNode(true), r = c.querySelector('.recaptcha-container'); if (r) r.remove();
    return /went wrong|verification failed|unable to|try again/i.test(c.textContent);
  }
  function answers(){
    var out = [], seen = {}, f = box ? box.querySelectorAll('input, textarea') : [];
    for (var i = 0; i < f.length; i++) {
      var el = f[i], t = el.type;
      if (t === 'file' || t === 'hidden' || t === 'submit' || el.name === 'Search') continue;
      var it = el.closest('.form-builder--item'); if (!it || !vis(it)) continue;
      if (el.name === 'terms_and_conditions' || /consent to receive/i.test(it.textContent)) continue;
      var lab = labelOf(it), val = '';
      if (t === 'checkbox' || t === 'radio') { if (!el.checked) continue; val = el.value; }
      else if (el.classList.contains('multiselect__input')) { var s = it.querySelector('.multiselect__single'); val = s ? s.textContent.trim() : ''; }
      else val = (el.value || '').trim();
      if (!val || !lab) continue;
      if (seen[lab] != null) out[seen[lab]] += ', ' + val; else { seen[lab] = out.length; out.push(lab + ': ' + val); }
    }
    return 'Groovemark setup answers\n' + out.join('\n');
  }
  function fit(body, max){ /* keep the link short enough that every mail program opens it */
    var cut = body;
    while (encodeURIComponent(cut).length > max && cut.length > 50) cut = cut.slice(0, cut.length - 40);
    return cut === body ? body : cut + '\n(More on the form. Call me for the rest.)';
  }
  function say(el, kind, html){
    if (!el) return;
    var key = kind + '|' + html;
    if (el.getAttribute('data-k') === key) return;
    el.setAttribute('data-k', key);
    el.className = 'gm-status' + (kind ? ' gm-' + kind : '');
    el.innerHTML = html;
    el.hidden = !html;
  }
  function fallback(lead){
    var all = answers();
    var sms = 'sms:' + PHONE + '?&body=' + encodeURIComponent(all.slice(0, 6000));
    var mail = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Groovemark setup answers') + '&body=' + encodeURIComponent(fit(all, 1700));
    var text = '<a class="gm-alt-b" target="_top" href="' + esc(sms) + '">Text my answers to Jonathan</a>' +
      '<span class="gm-alt-n">For a phone. Opens your text messages with every answer above already typed in, addressed to ' + PHONE_TXT + '. Just press send.</span>';
    var email = '<a class="gm-alt-b" target="_top" href="' + esc(mail) + '">Email my answers to Jonathan</a>' +
      '<span class="gm-alt-n">' + (ONPHONE ? 'Rather email? Works from this phone too.' : 'For a computer.') + ' Opens your email with every answer above already typed in, addressed to ' + MAIL + '. Just press send.</span>';
    var copy = '<button type="button" class="gm-alt-b gm-alt-c" data-gm-copy="1">Copy my answers</button>' +
      '<span class="gm-alt-n" data-gm-copied="1">Works on anything. Copies every answer above so you can paste it into a text or email to me.</span>';
    return '<span class="gm-alt gm-alt-own"><b>' + lead + '</b> Your answers are still on this page. Nothing is lost. ' +
      (ONPHONE ? 'You’re on a phone, so the first button is the one to use.' : 'You’re on a computer, so the first button is the one to use.') +
      (ONPHONE ? text + email : email + '<span class="gm-alt-n gm-alt-p">On a phone instead? Open this page there and you’ll get a button that texts them.</span>') + copy +
      '<span class="gm-alt-n gm-alt-p">Photos and your logo don’t ride along. Text those to ' + PHONE_TXT + '. Or just call me: <a target="_top" href="tel:' + PHONE + '">' + PHONE_TXT + '</a>.</span></span>';
  }
  function onStatClick(e){
    var t = e.target.closest ? e.target : null; if (!t) return;
    var go = t.closest('[data-gm-i]');
    if (go) {
      e.preventDefault();
      var p = items[+go.getAttribute('data-gm-i')] || items[0]; if (!p) return;
      goTo(p.el);
      var i = p.el.querySelector('input:not([type=hidden]):not([type=file]), textarea');
      if (i) try { i.focus({preventScroll: true}); } catch (x) {}
      return;
    }
    if (t.closest('[data-gm-send]')) { e.preventDefault(); goTo(btn()); return; }
    var cp = t.closest('[data-gm-copy]');
    if (cp) {
      e.preventDefault();
      var all = answers(), note = cp.parentNode.querySelector('[data-gm-copied]');
      var shown = function(){ /* last resort: put the answers on the page, selected, ready to copy by hand */
        var ta = cp.parentNode.querySelector('textarea.gm-alt-t');
        if (!ta) { ta = document.createElement('textarea'); ta.className = 'gm-alt-t'; ta.readOnly = true; ta.rows = 8; ta.setAttribute('aria-label', 'Your answers'); cp.parentNode.insertBefore(ta, note ? note.nextSibling : null); }
        ta.value = all; try { ta.focus(); ta.select(); } catch (x) {}
        var ok = false; try { ok = document.execCommand('copy'); } catch (x) {}
        if (note) note.textContent = ok ? 'Copied. Now paste it into a text to ' + PHONE_TXT + ' or an email to ' + MAIL + '.' : 'Your answers are in the box below. Press and hold to copy them, then paste into a text to ' + PHONE_TXT + ' or an email to ' + MAIL + '.';
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(all).then(function(){ if (note) note.textContent = 'Copied. Now paste it into a text to ' + PHONE_TXT + ' or an email to ' + MAIL + '.'; }, shown);
      } else shown();
    }
  }
  function mk(id){
    var d = document.createElement('div');
    d.id = id; d.className = 'gm-status'; d.hidden = true;
    d.setAttribute('role', 'alert'); d.setAttribute('aria-live', 'assertive');
    d.addEventListener('click', onStatClick);
    return d;
  }
  function place(){
    if (!box) return;
    var w = box.querySelector(':scope > .form-field-wrapper:has(.form-builder--btn-submit)');
    if (!w) return;
    if (!stat) stat = mk('gm-status');
    if (stat.nextElementSibling !== w) box.insertBefore(stat, w);
    if (!altBox) altBox = mk('gm-status-alt');
    if (w.nextElementSibling !== altBox) box.insertBefore(altBox, w.nextElementSibling);
  }
  /* The main message sits right above the spam check and the button; the other ways to send sit below the button, so they never push the button off the screen */
  function tell(kind, msg, fb){ say(stat, kind, msg); say(altBox, fb ? 'bad' : '', fb || ''); }
  function placeTop(first){ /* the same list, right on top of the first thing that needs fixing */
    if (!first) { if (topBox && topBox.parentNode) topBox.parentNode.removeChild(topBox); return; }
    var wrap = first.closest('.form-field-wrapper') || first;
    if (!topBox) topBox = mk('gm-status-top');
    if (topBox.parentNode !== wrap || wrap.firstChild !== topBox) wrap.insertBefore(topBox, wrap.firstChild);
  }
  function listHtml(bad){
    var n1 = bad.length === 1;
    var h = '<b>Not sent yet.</b> ' + (n1 ? '1 thing still needs fixing. Tap it to go to it:' : bad.length + ' things still need fixing. Tap one to go to it:') + '<ol class="gm-list">';
    for (var i = 0; i < bad.length; i++) h += '<li><a href="#" data-gm-i="' + i + '">' + esc(bad[i].name) + '</a> <span>' + esc(bad[i].why) + '</span></li>';
    return h + '</ol>' + (n1 ? 'It’s marked in red. Fix it, then press Send to Jonathan again.' : 'Each one is marked in red. Fix them, then press Send to Jonathan again.');
  }
  function check(){
    if (sentDone) return;
    var since = Date.now() - pressed;
    if (pressed && !formUp()) {
      if (/Got it\. I.m on it/i.test(document.body.textContent || '')) { /* the thank-you note replaced the form: it went through */
        sentDone = true; clearInterval(timer);
        var ok = document.createElement('div'); ok.className = 'gm-sent'; ok.setAttribute('role', 'status');
        ok.innerHTML = '<b>Sent.</b> I’ve got your answers. You can close this page.';
        var host = document.querySelector('#_builder-form') || document.body; host.insertBefore(ok, host.firstChild);
        up({gmIntake: 'sent'});
      }
      return;
    }
    if (!pressed) return;
    place();
    var bad = problems(), h = human(), b = btn();
    items = bad;
    if (bad.length) {
      hadBad = true;
      var html = listHtml(bad);
      if (!anchor || !anchor.isConnected || !vis(anchor)) anchor = bad[0].el;
      placeTop(anchor); say(topBox, 'bad', html); tell('bad', html, '');
      if (!jumped && since > 350) { jumped = true; goTo(topBox || bad[0].el); }
      return;
    }
    if (hadBad && !h && !(b && b.disabled)) {
      hadBad = false; pressed = 0; clearInterval(timer);
      tell('ok', '<b>All fixed.</b> Now press Send to Jonathan.', '');
      if (topBox && topBox.isConnected) say(topBox, 'ok', '<b>All fixed.</b> Now press Send to Jonathan. <a href="#" data-gm-send="1">Take me to the button</a>');
      return;
    }
    placeTop(null); anchor = null;
    if (h === 2) { tell('bad', '<b>Not sent yet. One more step.</b> Tap the <b>Verify you are human</b> box just below this. It’s a spam check. If it doesn’t send by itself a few seconds after that, press Send to Jonathan again.', fallback('Box won’t take the tap?')); return; }
    if (h === 1) { tell('wait', '<b>Checking you’re a real person.</b> This takes a few seconds. If a box shows up just below, tap it.', since > 30000 ? fallback('Taking too long?') : ''); return; }
    if (hiccup()) { tell('bad', '<b>That didn’t send.</b> The form hit a snag on its end. Press Send to Jonathan once more.', fallback('Same thing again?')); return; }
    if (b && b.disabled) { tell('wait', '<b>Sending…</b> Keep this page open. With photos on cell service this can take a few minutes.', since > 45000 ? fallback('Still not done?') : ''); return; }
    if (since > 6000 && since < 600000) { tell('bad', '<b>That didn’t send.</b> Press Send to Jonathan once more.', fallback('Tried twice?')); return; }
    if (since >= 600000) { pressed = 0; clearInterval(timer); }
  }
  function safe(){ try { check(); } catch (e) {} }
  function guard(){
    document.addEventListener('click', function(e){
      var b = e.target.closest ? e.target.closest('button') : null;
      if (!b || b !== btn()) return;
      pressed = Date.now(); jumped = false; hadBad = false; anchor = null; try { place(); placeTop(null); } catch (x) {}
      clearInterval(timer); timer = setInterval(safe, 400);
    }, true);
  }
  function start(){
    var all = document.querySelectorAll('.fields-container'); box = null;
    for (var i = 0; i < all.length; i++) if (all[i].querySelector('[data-q="business_name"]') && all[i].closest('.form-side')) { box = all[i]; break; }
    if (!box) return setTimeout(start, 150);
    box.classList.add('gm-js');
    run(); try { place(); guard(); } catch (e) {}
    new MutationObserver(function(m){
      for (var i = 0; i < m.length; i++) { var t = m[i].target; if (t.nodeType === 1 && t.closest && t.closest('.gm-sec, .gm-status')) continue; return run(); }
    }).observe(box, {subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style']});
    box.addEventListener('change', run, true);
  }
  start();
})();
