/* Groovemark intake form enhancer. Loaded by the HTML block in GHL form comv5R3sNv06ftsXJRRf.
   Adds step headings, puts fields in reading order, autocomplete, and screen reader wiring.
   Edit here, push, then bump ?v= in the GHL HTML block. */
(function(){
  if (window.gmIntake) return; window.gmIntake = 1;
  var Q = function(q){ return '.form-field-wrapper:has([data-q="' + q + '"])'; };
  var SEC = [
    {t:'What we’re setting up', s:[Q('intake_services_wanted')]},
    {t:'Your business', s:[Q('business_name')]},
    {t:'Your web site', n:'Logo and photos first. Everything after that is optional.', s:['.form-field-wrapper:has(.file-upload)', Q('radio_50nn4')]},
    {t:'Your voice agent', n:'How you want your phone answered.', s:[Q('single_line_87lfy'), Q('single_line_832ee'), Q('single_line_86ybk'), Q('radio_53w7x')]},
    {t:'Your social media', n:'How you want your pages run.', s:[Q('radio_55t4a'), Q('which_social_media_package_tt1_copy')]},
    {t:'How I reach you', n:'Last step. Then hit Send to Jonathan.', s:[Q('first_name')]}
  ];
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
    var up = one('.form-field-wrapper:has(.file-upload)'), more = one(Q('radio_50nn4'));
    if (up && more && !(up.compareDocumentPosition(more) & 4)) box.insertBefore(up, more);
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
      if (e2 && e2.textContent.trim()) { if (!e2.id) e2.id = grp.id + '-e'; d.push(e2.id); }
      if (h2) { if (!h2.id) h2.id = grp.id + '-h'; d.push(h2.id); }
      if (d.length) grp.setAttribute('aria-describedby', d.join(' ')); else grp.removeAttribute('aria-describedby');
      if (it && it.querySelector('[data-required="true"]')) grp.setAttribute('aria-required', 'true');
    }
    var errs = box.querySelectorAll('.error');
    for (var k = 0; k < errs.length; k++) { var p = errs[k].parentNode; if (p && !p.getAttribute('aria-live')) p.setAttribute('aria-live', 'polite'); }
  }
  function heads(){
    var plan = [];
    for (var i = 0; i < SEC.length; i++) {
      var at = null;
      for (var j = 0; j < SEC[i].s.length && !at; j++) { var c = one(SEC[i].s[j]); if (vis(c)) at = c; }
      if (at) plan.push([SEC[i], at]);
    }
    var key = plan.map(function(p){ return p[0].t + '@' + p[1].id; }).join('|');
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
    requestAnimationFrame(function(){
      try { reorder(); a11y(); heads(); } catch (e) {}
      busy = false;
    });
  }
  function start(){
    box = document.querySelector('.fields-container');
    if (!box || !box.querySelector('[data-q="business_name"]')) return setTimeout(start, 150);
    box.classList.add('gm-js');
    run();
    new MutationObserver(function(m){
      for (var i = 0; i < m.length; i++) { var t = m[i].target; if (t.nodeType === 1 && t.closest && t.closest('.gm-sec')) continue; return run(); }
    }).observe(box, {subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style']});
    box.addEventListener('change', run, true);
  }
  start();
})();
