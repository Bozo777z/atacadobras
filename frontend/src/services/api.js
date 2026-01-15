const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

async function fetchAPI(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` } : {})
  };

  const response = await fetch(`${API_URL}/api${path}`, {
    headers,
    ...options
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error ${response.status}: ${text}`);
  }
  return response.json();
}

export async function getStoreSettings() {
  const res = await fetchAPI('/store-settings?populate=*');
  return res;
}

export async function getCategories() {
  const res = await fetchAPI('/categories');
  return res;
}

export async function getProducts(params = '') {
  // Example: /products?filters[category][slug][$eq]=infantil-feminino&populate=images
  const res = await fetchAPI(`/products${params ? `?${params}` : '?populate=*'}`);
  return res;
}

export async function getProductBySlug(slug) {
  const res = await fetchAPI(`/products?filters[slug][$eq]=${slug}&populate=*`);
  return res;
}

export async function getShippingRules() {
  const res = await fetchAPI('/shipping-rules');
  return res;
}

export async function getShippingMethods() {
  const res = await fetchAPI('/shipping-methods?populate=availableStates');
  return res;
}

export async function createOrder(orderPayload) {
  // orderPayload: { customerName, customerEmail, items, subtotal, shipping, total, paymentMethod }
  const res = await fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify({ data: orderPayload })
  });
  return res;
}
