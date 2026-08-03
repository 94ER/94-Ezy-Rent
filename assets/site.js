function setupNav() {
  const nav = document.querySelector('nav');
  const btn = document.querySelector('.nav-toggle');
  const navLinks = nav?.querySelector('.nav-links');
  if (!nav || !btn || !(navLinks instanceof HTMLElement)) return;
  const supportsTransparentNav = Boolean(
    document.body?.hasAttribute('data-home') ||
    document.body?.hasAttribute('data-transparent-nav')
  );
  const hero = document.getElementById('hero');
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  let closeTimer = null;

  let closeBtn = navLinks.querySelector('.nav-close');
  if (!(closeBtn instanceof HTMLButtonElement)) {
    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'nav-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.textContent = '×';
    navLinks.prepend(closeBtn);
  }

  const clearCloseTimer = () => {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const setOpen = (open) => {
    clearCloseTimer();
    nav.dataset.open = open ? 'true' : 'false';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    updateScrolledState();
  };

  const scheduleClose = (delay = 120) => {
    clearCloseTimer();
    closeTimer = window.setTimeout(() => {
      setOpen(false);
    }, delay);
  };

  const updateScrolledState = () => {
    if (!supportsTransparentNav || !(hero instanceof HTMLElement)) {
      nav.dataset.scrolled = 'true';
      return;
    }
    const isSubpageHero = hero.classList.contains('subpage-hero');
    const threshold = Math.max(
      isSubpageHero ? 72 : 32,
      hero.offsetHeight - nav.offsetHeight - (isSubpageHero ? 48 : 120)
    );
    nav.dataset.scrolled = window.scrollY > threshold ? 'true' : 'false';
  };

  setOpen(false);
  updateScrolledState();

  btn.addEventListener('click', () => {
    const open = nav.dataset.open !== 'true';
    setOpen(open);
  });

  closeBtn.addEventListener('click', () => setOpen(false));

  document.addEventListener('click', (e) => {
    if (!nav.dataset.open || nav.dataset.open !== 'true') return;
    const t = e.target;
    if (t instanceof Element && (t.closest('nav') || t === btn)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.dataset.open === 'true') {
      setOpen(false);
    }
  });

  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  const isHoverMode = () => hoverQuery.matches;

  btn.addEventListener('mouseenter', () => {
    if (!isHoverMode()) return;
    setOpen(true);
  });

  btn.addEventListener('mouseleave', () => {
    if (!isHoverMode() || nav.dataset.open !== 'true') return;
    scheduleClose();
  });

  navLinks.addEventListener('mouseenter', () => {
    if (!isHoverMode()) return;
    clearCloseTimer();
  });

  navLinks.addEventListener('mouseleave', () => {
    if (!isHoverMode() || nav.dataset.open !== 'true') return;
    scheduleClose();
  });

  window.addEventListener('scroll', updateScrolledState, { passive: true });
  window.addEventListener('resize', updateScrolledState);
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

function setupBranchesShowcase() {
  const section = document.getElementById('branches');
  const showcase = section?.querySelector('.branches-showcase');
  if (!(section instanceof HTMLElement) || !(showcase instanceof HTMLElement)) return;

  const trigger = () => {
    showcase.classList.remove('is-active');
    void showcase.offsetWidth;
    showcase.classList.add('is-active');
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) trigger();
    });
  }, { threshold: 0.3 });

  io.observe(section);

  document.querySelectorAll('a[href="#branches"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.setTimeout(trigger, 320);
    });
  });

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#branches') {
      window.setTimeout(trigger, 120);
    }
  });
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
    let touchStartX = 0;
    let touchStartY = 0;

    const stopAuto = () => {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
      }
    };

    const syncMedia = (items) => {
      items.forEach((item, itemIndex) => {
        const videos = Array.from(item.querySelectorAll('video'));
        videos.forEach((video) => {
          if (!(video instanceof HTMLVideoElement)) return;
          if (itemIndex === index) {
            const play = video.play();
            if (play && typeof play.catch === 'function') play.catch(() => {});
          } else {
            video.pause();
            try { video.currentTime = 0; } catch (e) {}
          }
        });
      });
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

      syncMedia(items);

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
      }, 3000);
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
      const dotLabel = root.dataset.carouselDotLabel || 'slide';
      if (dots.childElementCount !== items.length) {
        wiredDots = false;
        dots.innerHTML = items.map((_, dotIndex) => `
          <button
            class="carousel-dot${dotIndex === 0 ? ' active' : ''}"
            type="button"
            aria-label="View ${dotLabel} ${dotIndex + 1}"
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

    root.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches?.[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      stopAuto();
    }, { passive: true });

    root.addEventListener('touchend', (e) => {
      const touch = e.changedTouches?.[0];
      if (!touch) return;
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goTo(index + (deltaX < 0 ? 1 : -1));
      }
      startAuto();
    }, { passive: true });

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

  const desktopList = String(hero.dataset.heroVideos || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
  const mobileList = String(hero.dataset.heroMobileVideos || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  let list = [];
  let index = 0;
  let retryTimer = 0;
  let activeMode = '';

  const pickList = () => (mobileQuery.matches && mobileList.length ? mobileList : desktopList);
  if (!desktopList.length) return;

  const revealFrame = () => {
    hero.dataset.ready = 'true';
    video.style.opacity = '0.78';
  };

  const attemptPlay = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        window.clearTimeout(retryTimer);
        retryTimer = window.setTimeout(() => {
          if (document.visibilityState === 'visible' && video.paused) attemptPlay();
        }, 600);
      });
    }
  };

  const setSource = (src) => {
    hero.dataset.ready = 'false';
    video.style.opacity = '0.22';
    window.clearTimeout(retryTimer);
    while (video.firstChild) video.removeChild(video.firstChild);
    const source = document.createElement('source');
    source.src = src;
    const lower = src.toLowerCase();
    if (lower.endsWith('.mp4')) source.type = 'video/mp4';
    if (lower.endsWith('.webm')) source.type = 'video/webm';
    video.appendChild(source);
    video.load();
    attemptPlay();
  };

  const go = (nextIndex) => {
    index = (nextIndex + list.length) % list.length;
    setSource(list[index]);
  };

  const syncPlaylist = (force = false) => {
    const nextList = pickList();
    const nextMode = mobileQuery.matches && mobileList.length ? 'mobile' : 'desktop';
    if (!nextList.length) return;
    if (!force && activeMode === nextMode) return;
    activeMode = nextMode;
    list = nextList;
    index = 0;
    go(0);
  };

  video.addEventListener('loadeddata', revealFrame, { passive: true });
  video.addEventListener('canplay', revealFrame, { passive: true });
  video.addEventListener('playing', revealFrame, { passive: true });

  video.addEventListener('ended', () => {
    go(index + 1);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && video.paused) attemptPlay();
  });

  document.addEventListener('pointerdown', () => {
    if (video.paused) attemptPlay();
  }, { once: true, passive: true });

  document.addEventListener('keydown', () => {
    if (video.paused) attemptPlay();
  }, { once: true });

  video.muted = true;
  video.defaultMuted = true;
  video.loop = false;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('playsinline', '');
  syncPlaylist(true);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', () => syncPlaylist());
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(() => syncPlaylist());
  }
}

function setupLiveReviews() {
  const root = document.querySelector('#reviews .reviews-shell[data-live-api]');
  if (!(root instanceof HTMLElement)) return;
  const api = String(root.dataset.liveApi || '').trim();
  const subtitle = root.querySelector('.reviews-subtitle');
  const stickerStars = root.querySelector('.reviews-sticker-stars');
  const readAll = root.querySelector('.reviews-readall');

  if (!api) {
    if (subtitle instanceof HTMLElement) {
      subtitle.textContent = 'Live Google reviews are ready to connect once the review API URL is deployed.';
    }
    return;
  }

  const base = api.replace(/\/+$/, '');

  const syncGoogleReviews = (block) => {
    if (!block || typeof block !== 'object') return false;
    if (block.error || block.disabled) return false;
    const items = Array.isArray(block.reviews) ? block.reviews : [];
    if (!items.length) return false;

    reviewHighlights = items.slice(0, 7).map((r) => ({
      name: String(r.name || 'Google user').trim() || 'Google user',
      meta: String(r.meta || '').trim() || 'Google review',
      stars: Math.max(0, Math.min(5, Math.round(Number(r.rating) || 0))),
      when: String(r.meta || '').trim() || 'Recently',
      text: String(r.text || '').trim()
    })).filter((r) => r.text);

    if (!reviewHighlights.length) return false;

    renderReviewHighlights();

    if (stickerStars instanceof HTMLElement) {
      const rating = Math.max(0, Math.min(5, Math.round(Number(block.rating) || 5)));
      stickerStars.textContent = '★'.repeat(rating || 5);
    }

    if (subtitle instanceof HTMLElement) {
      const parts = [];
      if (block.total) parts.push(`${Number(block.total).toLocaleString('en-MY')} ratings on Google`);
      parts.push('Auto-updated from our live Google review API');
      subtitle.textContent = parts.join(' · ');
    }

    if (readAll instanceof HTMLAnchorElement) {
      readAll.dataset.liveConnected = 'true';
    }

    return true;
  };

  const load = async () => {
    if (subtitle instanceof HTMLElement) {
      subtitle.textContent = 'Loading live Google reviews…';
    }
    try {
      const res = await fetch(`${base}/reviews`, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const ok = syncGoogleReviews(data?.google);
      if (!ok && subtitle instanceof HTMLElement) {
        const err = data?.google?.error ? `Live Google reviews error: ${data.google.error}` : 'No live Google reviews available yet.';
        subtitle.textContent = err;
      }
    } catch (e) {
      if (subtitle instanceof HTMLElement) {
        subtitle.textContent = 'Unable to load live Google reviews right now.';
      }
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
  setupBranchesShowcase();
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
