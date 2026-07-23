function setupNav() {
  const nav = document.querySelector('nav');
  const btn = document.querySelector('.nav-toggle');
  if (!nav || !btn) return;

  const setOpen = (open) => {
    nav.dataset.open = open ? 'true' : 'false';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  setOpen(false);

  btn.addEventListener('click', () => {
    const open = nav.dataset.open !== 'true';
    setOpen(open);
  });

  document.addEventListener('click', (e) => {
    if (!nav.dataset.open || nav.dataset.open !== 'true') return;
    const t = e.target;
    if (t instanceof Element && (t.closest('nav') || t === btn)) return;
    setOpen(false);
  });

  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
}

function setupSplash() {
  const splash = document.getElementById('splash');
  if (!(splash instanceof HTMLElement)) return;
  const ms = Math.max(0, Number(splash.dataset.duration || 1200));
  document.body.classList.add('splash-on');

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    splash.classList.add('hide');
    window.setTimeout(() => {
      splash.remove();
      document.body.classList.remove('splash-on');
    }, 580);
  };

  const img = splash.querySelector('.splash-logo');
  if (img instanceof HTMLImageElement) {
    img.addEventListener('error', () => finish(), { once: true });
  }

  window.setTimeout(finish, ms);
  splash.addEventListener('click', finish);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') finish();
  }, { once: true });
}

function setupReveal() {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;
  els.forEach((el, i) => {
    const d = (i % 6) * 70;
    el.style.setProperty('--reveal-delay', `${d}ms`);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

function setupCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    if (root instanceof HTMLElement && root.dataset.carouselInit === 'true') return;
    const track = root.querySelector('.carousel-track');
    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');
    const dots = root.querySelector('[data-carousel-dots]');
    if (!(track instanceof HTMLElement)) return;

    const slides = () => Array.from(track.children).filter((el) => el instanceof HTMLElement);

    let index = 0;
    let autoTimer = null;
    let wiredDots = false;

    const stopAuto = () => {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    };

    const update = () => {
      const items = slides();
      if (!items.length) return;

      const disable = items.length <= 1;
      if (prev instanceof HTMLButtonElement) prev.disabled = disable;
      if (next instanceof HTMLButtonElement) next.disabled = disable;

      items.forEach((item, itemIndex) => {
        item.classList.toggle('active', itemIndex === index);
      });

      if (dots instanceof HTMLElement) {
        Array.from(dots.children).forEach((dot, dotIndex) => {
          if (!(dot instanceof HTMLButtonElement)) return;
          const active = dotIndex === index;
          dot.classList.toggle('active', active);
          dot.setAttribute('aria-current', active ? 'true' : 'false');
        });
      }
    };

    const startAuto = () => {
      stopAuto();
      if (slides().length <= 1) return;
      autoTimer = window.setInterval(() => {
        goTo(index + 1);
      }, 4800);
    };

    const goTo = (nextIndex) => {
      const items = slides();
      if (!items.length) return;
      index = (nextIndex + items.length) % items.length;
      update();
    };

    const ensureDots = () => {
      if (!(dots instanceof HTMLElement)) return;
      const items = slides();
      if (!items.length) return;
      if (dots.childElementCount !== items.length) {
        wiredDots = false;
        dots.innerHTML = items.map((_, dotIndex) => `
          <button
            class="carousel-dot${dotIndex === 0 ? ' active' : ''}"
            type="button"
            aria-label="View review ${dotIndex + 1}"
            aria-current="${dotIndex === 0 ? 'true' : 'false'}"
          ></button>
        `).join('');
      }
      if (!wiredDots) {
        Array.from(dots.children).forEach((dot, dotIndex) => {
          if (!(dot instanceof HTMLButtonElement)) return;
          dot.addEventListener('click', () => {
            goTo(dotIndex);
            startAuto();
          });
        });
        wiredDots = true;
      }
    };

    if (prev instanceof HTMLButtonElement) {
      prev.addEventListener('click', () => {
        goTo(index - 1);
        startAuto();
      });
    }

    if (next instanceof HTMLButtonElement) {
      next.addEventListener('click', () => {
        goTo(index + 1);
        startAuto();
      });
    }

    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);
    root.addEventListener('focusin', stopAuto);
    root.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!root.contains(document.activeElement)) startAuto();
      }, 0);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    const ensure = () => {
      const items = slides();
      if (!items.length) return;
      if (index >= items.length) index = 0;
      ensureDots();
      update();
      startAuto();
    };

    const mo = new MutationObserver(() => ensure());
    mo.observe(track, { childList: true });

    ensure();
    if (root instanceof HTMLElement) root.dataset.carouselInit = 'true';
  });
}

function setupBookingAutofill() {
  const equipSel = document.getElementById('b-equip');
  if (!(equipSel instanceof HTMLSelectElement)) return;

  const deviceRaw = new URLSearchParams(window.location.search).get('device');
  if (!deviceRaw) return;

  let device = deviceRaw;
  try { device = decodeURIComponent(deviceRaw); } catch (e) {}
  device = device.trim();
  if (!device) return;

  const options = Array.from(equipSel.options || []);
  const exists = options.some((o) => (o.value || '').trim() === device || (o.textContent || '').trim() === device);
  if (!exists) {
    const opt = document.createElement('option');
    opt.textContent = device;
    opt.value = device;
    const insertAfter = equipSel.querySelector('option[value=""]');
    if (insertAfter && insertAfter.parentNode) {
      insertAfter.parentNode.insertBefore(opt, insertAfter.nextSibling);
    } else {
      equipSel.appendChild(opt);
    }
  }
  equipSel.value = device;
  if (typeof window.handleBEquipChange === 'function') window.handleBEquipChange(equipSel);
}

function setupHeroVideo() {
  const hero = document.querySelector('#hero .hero-media');
  const video = document.getElementById('hero-video');
  if (!(hero instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) return;

  const list = String(hero.dataset.heroVideos || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!list.length) return;

  const setSource = (src) => {
    while (video.firstChild) video.removeChild(video.firstChild);
    const source = document.createElement('source');
    source.src = src;
    const lower = src.toLowerCase();
    if (lower.endsWith('.mp4')) source.type = 'video/mp4';
    if (lower.endsWith('.webm')) source.type = 'video/webm';
    video.appendChild(source);
    video.load();
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  video.addEventListener('playing', () => {
    hero.dataset.ready = 'true';
  }, { passive: true });
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  setSource(list[0]);
}

function setupLiveReviews() {
  const root = document.querySelector('.live-widgets');
  if (!(root instanceof HTMLElement)) return;
  const api = String(root.dataset.liveApi || '').trim();
  const google = document.getElementById('google-live-widget');
  const fb = document.getElementById('facebook-live-widget');
  if (!(google instanceof HTMLElement) || !(fb instanceof HTMLElement)) return;

  if (!api) {
    google.textContent = 'Connect live API to enable auto-updating reviews.';
    fb.textContent = 'Connect live API to enable auto-updating reviews.';
    return;
  }

  const base = api.replace(/\/+$/, '');
  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stars = (n) => '★'.repeat(Math.max(0, Math.min(5, Number(n) || 0)));

  const renderList = (el, block, platform) => {
    if (block && typeof block === 'object') {
      if (block.disabled) {
        el.textContent = `${platform} live reviews are not connected yet.`;
        return;
      }
      if (block.error) {
        el.textContent = `${platform} live reviews error: ${block.error}`;
        return;
      }
    }
    const items = block?.reviews;
    if (!Array.isArray(items) || !items.length) {
      el.textContent = `No ${platform} reviews available yet.`;
      return;
    }
    el.innerHTML = items.slice(0, 6).map((r) => `
      <div class="live-review">
        <div class="live-review-top">
          <div class="live-review-name">${esc(r.name)}</div>
          <div class="live-review-stars">${stars(r.rating)}</div>
        </div>
        <div class="live-review-meta">${esc(r.meta || '')}</div>
        <div class="live-review-text">${esc(r.text || '')}</div>
      </div>
    `).join('');
  };

  const load = async () => {
    google.textContent = 'Loading…';
    fb.textContent = 'Loading…';
    try {
      const res = await fetch(`${base}/reviews`, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      renderList(google, data?.google, 'Google');
      renderList(fb, data?.facebook, 'Facebook');
    } catch (e) {
      google.textContent = 'Unable to load live Google reviews.';
      fb.textContent = 'Unable to load live Facebook recommendations.';
    }
  };

  load();
}

function setupMediaPreviews() {
  const cards = Array.from(document.querySelectorAll('[data-preview-card]'));
  if (!cards.length) return;

  cards.forEach((card) => {
    if (!(card instanceof HTMLElement)) return;
    const video = card.querySelector('video');
    if (!(video instanceof HTMLVideoElement)) return;

    const start = () => {
      card.classList.add('is-active');
      const play = video.play();
      if (play && typeof play.catch === 'function') play.catch(() => {});
    };

    const stop = () => {
      card.classList.remove('is-active');
      video.pause();
      try { video.currentTime = 0; } catch (e) {}
    };

    card.addEventListener('mouseenter', start);
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focusin', start);
    card.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!card.contains(document.activeElement)) stop();
      }, 0);
    });

    if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
      card.classList.add('is-active');
      const play = video.play();
      if (play && typeof play.catch === 'function') play.catch(() => {});
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSplash();
  document.body.dataset.anim = 'on';
  setupHeroVideo();
  setupMediaPreviews();
  setupNav();
  setupReveal();
  setupCarousels();
  setupBookingAutofill();
  setupTutorialFilters();
  setupLiveReviews();
});

function setupTutorialFilters() {
  const root = document.querySelector('body[data-tutorials]') || document.querySelector('[data-tutorials]');
  if (!root) return;
  const buttons = Array.from(root.querySelectorAll('[data-tut-filter]'));
  const cards = Array.from(root.querySelectorAll('.tut-card'));
  if (!buttons.length || !cards.length) return;

  const setActive = (key) => {
    buttons.forEach((b) => {
      if (!(b instanceof HTMLButtonElement)) return;
      b.classList.toggle('active', b.dataset.tutFilter === key);
    });
    cards.forEach((c) => {
      if (!(c instanceof HTMLElement)) return;
      const tags = String(c.dataset.tutTags || '').split(/\s+/).filter(Boolean);
      const show = key === 'all' || tags.includes(key);
      c.style.display = show ? '' : 'none';
    });
  };

  buttons.forEach((b) => {
    if (!(b instanceof HTMLButtonElement)) return;
    b.addEventListener('click', () => setActive(String(b.dataset.tutFilter || 'all')));
  });

  setActive('all');
}
