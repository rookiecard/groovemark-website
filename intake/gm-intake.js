/* Groovemark intake form enhancer. Loaded by the HTML block in GHL form comv5R3sNv06ftsXJRRf.
   Adds step headings, puts fields in reading order, autocomplete, and screen reader wiring.
   Styles live in gm-form.css (loaded below). Edit, push, then bump CSS_V here
   and ?v= on the script tag in the GHL HTML block so browsers fetch the new copy. */
(function(){
  if (window.gmIntake) return; window.gmIntake = 1;
  var CSS_V = '5';
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
      try { reorder(); a11y(); heads(); } catch (e) {}
      busy = false;
    }, 30);
  }
  function start(){
    var all = document.querySelectorAll('.fields-container'); box = null;
    for (var i = 0; i < all.length; i++) if (all[i].querySelector('[data-q="business_name"]') && all[i].closest('.form-side')) { box = all[i]; break; }
    if (!box) return setTimeout(start, 150);
    box.classList.add('gm-js');
    run();
    new MutationObserver(function(m){
      for (var i = 0; i < m.length; i++) { var t = m[i].target; if (t.nodeType === 1 && t.closest && t.closest('.gm-sec')) continue; return run(); }
    }).observe(box, {subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style']});
    box.addEventListener('change', run, true);
  }
  start();
})();
