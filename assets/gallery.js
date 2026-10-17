(() => {
  const API = 'https://ezyrent-live-reviews.94renteasy.workers.dev';
  const grid = document.getElementById('client-gallery-grid');
  if (!grid) return;

  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImage = document.getElementById('gallery-lightbox-image');
  const lightboxTitle = document.getElementById('gallery-lightbox-title');
  const lightboxMeta = document.getElementById('gallery-lightbox-meta');

  const itemMeta = (item) => [item.client, item.location, item.gear].filter(Boolean).join(' · ');

  const render = (items) => {
    if (!items.length) return;
    grid.innerHTML = items.map((item) => `
      <article class="client-gallery-item">
        <button class="client-gallery-photo" type="button" data-gallery-id="${escapeHtml(item.id)}" aria-label="View ${escapeHtml(item.title)}">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
        </button>
        <div class="client-gallery-copy">
          <h2>${escapeHtml(item.title)}</h2>
          ${item.caption ? `<p>${escapeHtml(item.caption)}</p>` : ''}
          ${itemMeta(item) ? `<div>${escapeHtml(itemMeta(item))}</div>` : ''}
        </div>
      </article>`).join('');

    grid.addEventListener('click', (event) => {
      const button = event.target.closest('[data-gallery-id]');
      if (!button) return;
      const item = items.find((entry) => entry.id === button.dataset.galleryId);
      if (!item || !lightbox) return;
      lightboxImage.src = item.image;
      lightboxImage.alt = item.title;
      lightboxTitle.textContent = item.title;
      lightboxMeta.textContent = itemMeta(item);
      lightbox.showModal();
    });
  };

  fetch(`${API}/gallery`, { headers: { accept: 'application/json' }, cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`Gallery API ${response.status}`);
      return response.json();
    })
    .then((payload) => render(Array.isArray(payload.items) ? payload.items : []))
    .catch(() => {
      grid.querySelector('.client-gallery-empty span').textContent = 'Please check back soon for new client photos.';
    });

  document.querySelector('.gallery-lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
})();
