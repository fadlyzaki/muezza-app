import { qfUserRequest } from './quranUserRequest';

function normalizeUserProfile(profile) {
  if (!profile) return null;

  return {
    id: profile.id,
    username: profile.username,
    first_name: profile.firstName || profile.first_name || profile.username,
    last_name: profile.lastName || profile.last_name || '',
    email: profile.email || null,
    avatar_urls: profile.avatarUrls || profile.avatar_urls || null,
    source: 'quran_foundation_profile',
  };
}

export async function getUserProfile(accessToken) {
  if (!accessToken) return null;

  try {
    const result = await qfUserRequest(accessToken, '/users/profile', {
      searchParams: { qdc: 'true' },
    });
    if (!result.ok) return null;
    return normalizeUserProfile(result.data);
  } catch {
    return null;
  }
}
