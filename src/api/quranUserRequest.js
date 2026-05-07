export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export async function qfUserRequest(accessToken, pathname, options = {}) {
  if (!accessToken) {
    return { ok: false, data: null, error: 'Missing Quran Foundation session.' };
  }

  try {
    const upstreamPath = new URL(pathname, 'https://qf.local');
    Object.entries(options.searchParams || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        upstreamPath.searchParams.set(key, String(value));
      }
    });

    const url = new URL('/api/qf-user', window.location.origin);
    url.searchParams.set('path', `${upstreamPath.pathname}${upstreamPath.search}`);

    const res = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-timezone': getUserTimezone(),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('qf_unauthorized'));
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        data,
        error: data?.message || data?.error || `Quran Foundation request failed (${res.status}).`,
      };
    }

    return { ok: true, data, error: null };
  } catch (error) {
    console.error('Quran Foundation User API request failed:', error);
    return { ok: false, data: null, error: error.message };
  }
}
