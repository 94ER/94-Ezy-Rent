(() => {
  const BASE = 'https://94er.github.io/94-Ezy-Rent/';
  const ORG_ID = `${BASE}#organization`;
  const WEBSITE_ID = `${BASE}#website`;
  const pageFile = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const isHome = pageFile === 'index.html' || pageFile === '94-Ezy-Rent';
  const pagePath = isHome ? '' : pageFile;

  const absoluteUrl = (path = '') => new URL(path, BASE).href;
  const descriptionMeta = document.querySelector('meta[name="description"]');

  function setMeta(selector, attribute, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attribute, value);
  }

  function setCanonical(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    setMeta('meta[property="og:url"]', 'content', url);
  }

  function breadcrumb(name, url) {
    return {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Camera Rental Malaysia', item: BASE},
        {'@type': 'ListItem', position: 2, name, item: url}
      ]
    };
  }

  const canonical = document.querySelector('link[rel="canonical"]')?.href || absoluteUrl(pagePath);
  const graph = [];

  if (isHome) {
    graph.push({
      '@type': 'Organization',
      '@id': ORG_ID,
      name: '94 Ezy Rent',
      alternateName: ['94 EZY RENT', '94好租'],
      legalName: '94 Ezy Rent',
      url: BASE,
      logo: {'@type': 'ImageObject', url: absoluteUrl('assets/logo.png')},
      image: absoluteUrl('assets/dji-pocket-4-pro.jpg'),
      email: '94renteasy@gmail.com',
      telephone: '+60174753794',
      identifier: 'SSM 202503067061',
      sameAs: [
        'https://www.instagram.com/94ezyrent',
        'https://facebook.com/94ezyrent',
        'https://xhslink.cn/m/9kJpMuZeTEn'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+60174753794',
        email: '94renteasy@gmail.com',
        contactType: 'rental enquiries',
        availableLanguage: ['English', 'Malay', 'Chinese']
      }
    });
    graph.push({
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: BASE,
      name: '94 Ezy Rent',
      alternateName: '94 EZY RENT Camera Rental Malaysia',
      publisher: {'@id': ORG_ID},
      inLanguage: ['en-MY', 'ms-MY', 'zh-Hans', 'zh-Hant']
    });
    graph.push({
      '@type': 'WebPage',
      '@id': `${BASE}#webpage`,
      url: BASE,
      name: document.title,
      description: descriptionMeta?.content || '',
      isPartOf: {'@id': WEBSITE_ID},
      about: {'@id': ORG_ID},
      primaryImageOfPage: {'@type': 'ImageObject', url: absoluteUrl('assets/dji-pocket-4-pro.jpg')},
      inLanguage: 'en-MY'
    });
    graph.push({
      '@type': 'Service',
      '@id': `${BASE}#camera-rental-service`,
      name: 'Camera and creator equipment rental in Malaysia',
      serviceType: ['Camera rental', 'Camera lens rental', 'Drone rental', '360 camera rental', 'Creator equipment rental'],
      provider: {'@id': ORG_ID},
      areaServed: ['Malaysia', 'Kuala Lumpur', 'Penang', 'Johor Bahru', 'Melaka', 'Kota Kinabalu', 'Semporna', 'Singapore'],
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: absoluteUrl('index.html#booking'),
        servicePhone: {'@type': 'ContactPoint', telephone: '+60174753794'}
      }
    });
  } else {
    const pageType = pageFile === 'catalogue.html' ? 'CollectionPage' : pageFile === 'gallery.html' ? 'ImageGallery' : pageFile === 'faq.html' ? 'FAQPage' : 'WebPage';
    graph.push({
      '@type': pageType,
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: document.title,
      description: descriptionMeta?.content || '',
      isPartOf: {'@id': WEBSITE_ID},
      about: {'@id': ORG_ID},
      breadcrumb: {'@id': `${canonical}#breadcrumb`},
      inLanguage: 'en-MY'
    });
    graph.push(breadcrumb(document.querySelector('h1')?.textContent.trim() || document.title, canonical));
  }

  if (pageFile === 'catalogue.html' && Array.isArray(window.GEAR_PRODUCTS)) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${canonical}#gear-list`,
      name: 'Camera rental equipment available from 94 Ezy Rent',
      numberOfItems: window.GEAR_PRODUCTS.length,
      itemListElement: window.GEAR_PRODUCTS.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`product.html?gear=${encodeURIComponent(product.slug)}`),
        name: product.name,
        description: product.desc,
        ...(product.image ? {image: absoluteUrl(product.image)} : {})
      }))
    });
  }

  if (pageFile === 'faq.html') {
    const faqItems = [...document.querySelectorAll('.faq-card')].map((card) => {
      const question = card.querySelector('.faq-title')?.textContent.trim();
      const answer = card.querySelector('.faq-text')?.textContent.trim();
      return question && answer ? {'@type': 'Question', name: question, acceptedAnswer: {'@type': 'Answer', text: answer}} : null;
    }).filter(Boolean);
    if (faqItems.length) graph[0].mainEntity = faqItems;
  }

  if (pageFile === 'product.html' && typeof window.getGearProduct === 'function') {
    const slug = new URLSearchParams(window.location.search).get('gear');
    const product = window.getGearProduct(slug);
    if (product) {
      const productUrl = absoluteUrl(`product.html?gear=${encodeURIComponent(product.slug)}`);
      const productTitle = `Rent ${product.name} in Malaysia | 94 Ezy Rent`;
      const productDescription = `${product.desc} Check rental availability, included kit and pickup options across Malaysia with 94 Ezy Rent.`;
      document.title = productTitle;
      if (descriptionMeta) descriptionMeta.content = productDescription;
      setCanonical(productUrl);
      setMeta('meta[property="og:title"]', 'content', productTitle);
      setMeta('meta[property="og:description"]', 'content', productDescription);
      setMeta('meta[property="og:type"]', 'content', 'product');
      setMeta('meta[name="twitter:title"]', 'content', productTitle);
      setMeta('meta[name="twitter:description"]', 'content', productDescription);
      if (product.image) {
        const productImage = absoluteUrl(product.image);
        setMeta('meta[property="og:image"]', 'content', productImage);
        setMeta('meta[name="twitter:image"]', 'content', productImage);
      }
      graph.length = 0;
      graph.push({
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: product.name,
        description: product.desc,
        category: product.cat,
        url: productUrl,
        ...(product.image ? {image: absoluteUrl(product.image)} : {}),
        brand: {'@type': 'Brand', name: product.name.split(' ')[0]},
        additionalProperty: product.features.map((feature) => ({'@type': 'PropertyValue', name: 'Feature', value: feature}))
      });
      graph.push({
        '@type': 'WebPage',
        '@id': `${productUrl}#webpage`,
        url: productUrl,
        name: productTitle,
        description: productDescription,
        isPartOf: {'@id': WEBSITE_ID},
        about: {'@id': `${productUrl}#product`},
        breadcrumb: {'@id': `${productUrl}#breadcrumb`},
        inLanguage: 'en-MY'
      });
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${productUrl}#breadcrumb`,
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Camera Rental Malaysia', item: BASE},
          {'@type': 'ListItem', position: 2, name: 'Rental Gear', item: absoluteUrl('catalogue.html')},
          {'@type': 'ListItem', position: 3, name: product.name, item: productUrl}
        ]
      });
    }
  }

  const structuredData = document.createElement('script');
  structuredData.type = 'application/ld+json';
  structuredData.id = 'site-structured-data';
  structuredData.textContent = JSON.stringify({'@context': 'https://schema.org', '@graph': graph});
  document.head.appendChild(structuredData);
})();
