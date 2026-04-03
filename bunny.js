(function () {
  'use strict';

  // Override bunnyBounce to be pure vertical (no scaleX baked in)
  var s = document.createElement('style');
  s.textContent = '@keyframes bunnyBounce{from{transform:translateY(0)}to{transform:translateY(-18px)}}';
  document.head.appendChild(s);

  function init() {
    var w1 = document.querySelector('.bunny-wrap');
    if (!w1) return;

    // Stop CSS jump animation, park off-screen
    w1.style.animation  = 'none';
    w1.style.transition = 'none';
    w1.style.position   = 'fixed';
    w1.style.bottom     = '-10px';
    w1.style.left       = '-120px';
    w1.style.right      = 'auto';
    w1.style.zIndex     = '2';
    w1.style.transform  = 'scaleX(1)';

    var s1 = w1.querySelector('.bunny');
    if (s1) { s1.style.animation = 'bunnyBounce 0.4s ease-in-out infinite alternate'; }

    // Mirror clone → bunny2
    var w2 = w1.cloneNode(true);
    w2.style.left          = 'calc(100vw + 120px)';
    w2.style.right         = 'auto';
    w2.style.opacity       = '0';
    w2.style.transform     = 'scaleX(-1)';
    w2.style.pointerEvents = 'none';
    var s2 = w2.querySelector('.bunny');
    if (s2) { s2.style.animation = 'bunnyBounce 0.4s ease-in-out infinite alternate'; }
    document.body.appendChild(w2);

    var SOLO  = 3500;
    var LEG   = 2000;
    var PAUSE = 600;
    var busy  = false;

    function rf() { return w1.offsetWidth; }

    function runSolo() {
      if (busy) return;
      busy = true;
      var vw = window.innerWidth;
      w1.style.transition = 'none';
      w1.style.opacity    = '1';
      w1.style.transform  = 'scaleX(1)';
      w1.style.left       = '-120px';
      rf();
      w1.style.transition = 'left ' + SOLO + 'ms linear';
      w1.style.left = (vw + 120) + 'px';
      setTimeout(function () {
        w1.style.transition = 'none';
        w1.style.left = '-120px';
        busy = false;
        scheduleNext();
      }, SOLO + 200);
    }

    function runEncounter() {
      if (busy) return;
      busy = true;
      var vw  = window.innerWidth;
      var mid = Math.round(vw / 2);

      w1.style.transition = 'none'; w1.style.opacity = '1';
      w1.style.transform  = 'scaleX(1)'; w1.style.left = '-120px';
      w2.style.transition = 'none'; w2.style.opacity = '1';
      w2.style.transform  = 'scaleX(-1)'; w2.style.left = (vw + 120) + 'px';
      rf();

      // Rush toward centre
      w1.style.transition = 'left ' + LEG + 'ms linear'; w1.style.left = (mid - 110) + 'px';
      w2.style.transition = 'left ' + LEG + 'ms linear'; w2.style.left = (mid + 10)  + 'px';

      setTimeout(function () {
        // Flip to face origins
        w1.style.transition = 'none'; w1.style.transform = 'scaleX(-1)';
        w2.style.transition = 'none'; w2.style.transform = 'scaleX(1)';
        rf();
        setTimeout(function () {
          // Run back
          w1.style.transition = 'left ' + LEG + 'ms linear'; w1.style.left = '-120px';
          w2.style.transition = 'left ' + LEG + 'ms linear'; w2.style.left = (vw + 120) + 'px';
          setTimeout(function () {
            w1.style.transition = 'none';
            w2.style.transition = 'none';
            w2.style.opacity = '0';
            busy = false;
            scheduleNext();
          }, LEG + 200);
        }, PAUSE);
      }, LEG);
    }

    function scheduleNext() {
      // 8–18 s between appearances; 25 % chance of encounter
      var delay = 8000 + Math.random() * 10000;
      setTimeout(function () {
        if (Math.random() < 0.25) { runEncounter(); } else { runSolo(); }
      }, delay);
    }

    // First run shortly after page load
    setTimeout(runSolo, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
