(function () {
  const PRODUCT_API = 'https://ezyrent-live-reviews.94renteasy.workers.dev';
  const products = [];

  window.GEAR_PRODUCTS = products;
  window.GEAR_PRODUCT_API = PRODUCT_API;
  window.loadGearProducts = async function () {
    try {
      const response = await fetch(`${PRODUCT_API}/products`, { headers: { accept: 'application/json' }, cache: 'no-store' });
      if (!response.ok) throw new Error(`Product API ${response.status}`);
      const payload = await response.json();
      window.GEAR_PRODUCTS = Array.isArray(payload.products) ? payload.products : [];
    } catch (_) {
      window.GEAR_PRODUCTS = products;
    }
    window.dispatchEvent(new CustomEvent('gear-products-loaded', { detail: window.GEAR_PRODUCTS }));
    return window.GEAR_PRODUCTS;
  };
  window.getGearProduct = function (slug) {
    return window.GEAR_PRODUCTS.find((product) => product.slug === slug) || null;
  };
  window.getGearProductAsync = async function (slug) {
    await window.loadGearProducts();
    return window.getGearProduct(slug);
  };
})();
