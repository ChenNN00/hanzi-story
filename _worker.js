// HanziStory — Cloudflare Pages _worker.js
// Handles server-side routes: /api/* and /auth/*
// All other routes → getSingleAsset() (Pages native static serving, NOT fetch(request))
// fetch(request) in Pages Functions mode causes 503 for static assets — use getSingleAsset instead.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith('/api/')) {
      return handleApi(request, env, path);
    }
    if (path.startsWith('/auth/')) {
      return handleAuth(request, env, path);
    }
    // Static assets: use Pages native getSingleAsset, NOT fetch(request)
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
};

// ---- API Routes ----
async function handleApi(request, env, path) {
  const url = new URL(request.url);

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (path === '/api/create-subscription' && request.method === 'POST') {
    return handleCreateSubscription(request, env);
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}

async function handleCreateSubscription(request, env) {
  const clientId = env.PAYPAL_CLIENT_ID;
  const clientSecret = env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json({ error: 'PayPal not configured' }, { status: 503 });
  }

  let planKey;
  try {
    const body = await request.json();
    planKey = body.plan;
  } catch (e) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const PLANS = {
    monthly: { planId: 'P-9JX74235EE472163KNJQLP7I', isSubscription: true },
    annual: { planId: 'P-4PE61198JK444992VNJQLP7I', isSubscription: true },
    lifetime: { isSubscription: false, amount: '198.00', description: 'HanziStory Lifetime Explorer' },
  };

  const planConfig = PLANS[planKey];
  if (!planConfig) {
    return Response.json({ error: 'Unknown plan: ' + planKey }, { status: 400 });
  }

  try {
    const token = await getPayPalToken(clientId, clientSecret);

    if (planConfig.isSubscription) {
      const res = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `sub-${planKey}-${Date.now()}`,
        },
        body: JSON.stringify({
          plan_id: planConfig.planId,
          application_context: {
            brand_name: 'HanziStory',
            landing_page: 'BILLING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: `https://han-zi-story.online/pricing-success?plan=${planKey}`,
            cancel_url: 'https://han-zi-story.online/pricing',
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Subscription error: ' + JSON.stringify(data));
      const approvalLink = data.links?.find(l => l.rel === 'approve');
      return Response.json({ approvalUrl: approvalLink?.href, type: 'subscription', plan: planKey }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      const res = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `order-${planKey}-${Date.now()}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: { currency_code: 'USD', value: planConfig.amount },
            description: planConfig.description,
          }],
          application_context: {
            brand_name: 'HanziStory',
            landing_page: 'BILLING',
            user_action: 'PAY_NOW',
            return_url: `https://han-zi-story.online/pricing-success?plan=${planKey}`,
            cancel_url: 'https://han-zi-story.online/pricing',
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Order error: ' + JSON.stringify(data));
      const approvalLink = data.links?.find(l => l.rel === 'approve');
      return Response.json({ approvalUrl: approvalLink?.href, type: 'order', plan: planKey }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }
  } catch (e) {
    console.error('PayPal error:', e.message);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

async function getPayPalToken(clientId, clientSecret) {
  const credentials = btoa(clientId + ':' + clientSecret);
  const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Token error: ' + JSON.stringify(data));
  return data.access_token;
}

// ---- Auth Routes ----
// Google OAuth, /auth/me, /auth/logout — stub (static files handle redirects)
async function handleAuth(request, env, path) {
  // Pass through to static asset serving (OAuth redirects handled in static HTML)
  return env.ASSETS.fetch(request);
}
