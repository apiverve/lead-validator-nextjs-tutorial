/**
 * Lead Validator API Route
 *
 * Checks an email and a phone number with APIVerve, then scores the lead.
 * The API key stays on the server: the browser only ever talks to this route.
 *
 * Email Validator:        https://apiverve.com/marketplace/emailvalidator
 * Phone Number Validator: https://apiverve.com/marketplace/phonenumbervalidator
 */

import { NextResponse } from 'next/server';

// Set APIVERVE_API_KEY in .env.local (local) or your host's environment variables.
// Get a free key at https://dashboard.apiverve.com
const API_KEY = process.env.APIVERVE_API_KEY;

const EMAIL_API = 'https://api.apiverve.com/v1/emailvalidator';
const PHONE_API = 'https://api.apiverve.com/v1/phonenumbervalidator';

const COUNTRIES = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IN', 'JP', 'BR', 'MX'];

// ============================================
// Rate limit
// Once deployed, anyone who finds this URL can call it with YOUR key.
// This caps each visitor at RATE_LIMIT requests per minute. It is kept in
// memory, so it resets on cold starts and isn't shared between instances:
// good enough for a demo. For production, use a shared store (e.g. Upstash
// Redis) or put the form behind your own auth.
// ============================================
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

async function callApi(url, params) {
  const res = await fetch(`${url}?${new URLSearchParams(params)}`, {
    headers: { 'x-api-key': API_KEY },
    cache: 'no-store'
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.status !== 'ok') {
    throw new Error(body?.error || `APIVerve returned ${res.status}`);
  }
  return body.data;
}

/**
 * Each check is pass, warn or fail. A fail costs 40 points, a warning 15.
 * Only free-plan fields are used, so the score works on every plan.
 */
function emailChecks(d) {
  // suggestedCorrection (paid plans) can catch a typo hasTypo misses.
  const typo = d.hasTypo || !!d.suggestedCorrection;
  return [
    { label: 'Deliverable', status: d.isValid && d.isMxValid ? 'pass' : 'fail',
      detail: d.isMxValid ? 'Domain accepts mail' : 'Domain has no mail server' },
    { label: 'Not disposable', status: d.isDisposable ? 'fail' : 'pass',
      detail: d.isDisposable ? 'Throwaway inbox' : 'Permanent inbox' },
    { label: 'No typo', status: typo ? 'warn' : 'pass',
      detail: typo ? (d.suggestedCorrection ? `Did they mean ${d.suggestedCorrection}?` : 'Looks like a misspelled domain') : 'Domain spelled correctly' },
    { label: 'Personal inbox', status: d.isRoleAccount ? 'warn' : 'pass',
      detail: d.isRoleAccount ? 'Shared address (info@, sales@)' : 'Reaches a person' },
    { label: 'Work email', status: 'info',
      detail: d.isCompanyEmail ? 'Company domain' : d.isFreeEmail ? 'Free provider (Gmail, Yahoo…)' : 'Unknown provider' }
  ];
}

function phoneChecks(d) {
  return [
    { label: 'Valid number', status: d.isValid ? 'pass' : 'fail',
      detail: d.isValid ? d.formatted?.international || 'Valid' : 'Not a real number for this country' },
    { label: 'Not disposable', status: d.isDisposable ? 'fail' : 'pass',
      detail: d.isDisposable ? 'Temporary number' : 'Permanent number' },
    { label: 'Not VoIP', status: d.isVoip ? 'warn' : 'pass',
      detail: d.isVoip ? 'Internet number, easy to create' : 'Carrier-issued' },
    { label: 'Line type', status: 'info',
      detail: d.isMobile ? 'Mobile' : (d.type || 'unknown').replace(/_/g, ' ') }
  ];
}

function score(checks) {
  const penalty = checks.reduce((n, c) => n + (c.status === 'fail' ? 40 : c.status === 'warn' ? 15 : 0), 0);
  return Math.max(0, 100 - penalty);
}

export async function POST(request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Missing APIVERVE_API_KEY. Add it to .env.local, or to your host’s environment variables, then restart.' },
      { status: 500 }
    );
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Wait a minute and try again.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().slice(0, 254);
  const phone = String(body.phone || '').trim().slice(0, 32);
  const country = COUNTRIES.includes(body.country) ? body.country : 'US';

  if (!email && !phone) {
    return NextResponse.json({ error: 'Enter an email or a phone number.' }, { status: 400 });
  }

  // Both lookups run at once; one failing doesn't sink the other.
  const [emailRes, phoneRes] = await Promise.allSettled([
    email ? callApi(EMAIL_API, { email }) : null,
    phone ? callApi(PHONE_API, { number: phone, country }) : null
  ]);

  const result = { email: null, phone: null };
  const all = [];

  if (email) {
    if (emailRes.status === 'fulfilled') {
      const checks = emailChecks(emailRes.value);
      result.email = { value: email, checks, riskLevel: emailRes.value.riskLevel ?? null };
      all.push(...checks);
    } else {
      result.email = { value: email, error: emailRes.reason.message };
    }
  }

  if (phone) {
    if (phoneRes.status === 'fulfilled') {
      const checks = phoneChecks(phoneRes.value);
      result.phone = { value: phone, checks, riskLevel: phoneRes.value.riskLevel ?? null };
      all.push(...checks);
    } else {
      result.phone = { value: phone, error: phoneRes.reason.message };
    }
  }

  if (!all.length) {
    return NextResponse.json({ error: result.email?.error || result.phone?.error || 'Validation failed.' }, { status: 502 });
  }

  result.score = score(all);
  return NextResponse.json(result);
}
