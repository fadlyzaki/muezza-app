export function decodeJwtPayload(token) {
  const payload = token?.split('.')?.[1];

  if (!payload) {
    throw new Error('Invalid identity token.');
  }

  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const json = decodeURIComponent(
    atob(paddedBase64)
      .split('')
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  );

  return JSON.parse(json);
}
