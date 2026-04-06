const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const SESSION_STORAGE_KEY = 'civicconnect_session_user';

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

async function parseError(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const payload = await response.json();
    const apiError = payload?.error;

    if (apiError) {
      throw new ApiError(
        apiError.message || `Request failed with status ${response.status}`,
        response.status,
        apiError.code,
        apiError.details,
      );
    }
  } else {
    const errorText = await response.text();
    throw new ApiError(errorText || `Request failed with status ${response.status}`, response.status);
  }

  throw new ApiError(`Request failed with status ${response.status}`, response.status);
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    await parseError(response);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export function getStoredSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredSessionUser(user) {
  if (!user) {
    clearStoredSessionUser();
    return;
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredSessionUser() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getRoleHomePath(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'worker':
    case 'supervisor':
    case 'department_head':
      return '/worker/dashboard';
    case 'citizen':
    default:
      return '/user/dashboard';
  }
}

export function getPortalRoles(portalRole) {
  switch (portalRole) {
    case 'admin':
      return ['admin'];
    case 'worker':
      return ['worker', 'supervisor', 'department_head'];
    case 'citizen':
    default:
      return ['citizen'];
  }
}

export function getReadableErrorMessage(error, fallback = 'Something went wrong.') {
  if (error instanceof ApiError) {
    if (error.details && typeof error.details === 'object') {
      const firstEntry = Object.values(error.details).find(
        (messages) => Array.isArray(messages) && messages.length > 0,
      );

      if (firstEntry) {
        return firstEntry[0];
      }
    }

    return error.message || fallback;
  }

  return error?.message || fallback;
}

export async function getServerHealth() {
  return apiRequest('/health');
}

export async function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (data?.user) {
    setStoredSessionUser(data.user);
  }

  return data;
}

export async function logoutUser() {
  try {
    await apiRequest('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
  } finally {
    clearStoredSessionUser();
  }
}

export async function fetchCurrentSession() {
  const data = await apiRequest('/auth/me');

  if (data?.user) {
    setStoredSessionUser(data.user);
  }

  return data;
}

export async function fetchCitizenDashboard() {
  return apiRequest('/user/dashboard');
}

export async function fetchMyReports() {
  return apiRequest('/user/reports');
}

export async function fetchUserReportDetails(issueId) {
  return apiRequest(`/user/reports/${encodeURIComponent(issueId)}`);
}

export async function createCitizenReport(payload) {
  return apiRequest('/user/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchUserNotifications() {
  return apiRequest('/user/notifications');
}

export async function fetchUserSettings() {
  return apiRequest('/user/settings');
}

export async function updateUserSettings(userId, payload) {
  return apiRequest(`/user/settings/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function fetchTrackedIssue(trackingCode) {
  return apiRequest(`/issues/track/${encodeURIComponent(trackingCode)}`);
}

export async function fetchWorkerDashboard() {
  return apiRequest('/worker/dashboard');
}

export async function fetchWorkerTasks() {
  return apiRequest('/worker/tasks');
}

export async function fetchWorkerTaskDetails(taskCode) {
  return apiRequest(`/worker/tasks/${encodeURIComponent(taskCode)}`);
}

export async function startWorkerTask(taskCode) {
  return apiRequest(`/worker/tasks/${encodeURIComponent(taskCode)}/start`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function markWorkerTaskInProgress(taskCode) {
  return apiRequest(`/worker/tasks/${encodeURIComponent(taskCode)}/in-progress`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function submitWorkerTaskProof(taskCode, { proofFile, notes }) {
  const formData = new FormData();
  formData.append('proof', proofFile);
  if (notes) {
    formData.append('notes', notes);
  }

  const response = await fetch(buildUrl(`/worker/tasks/${encodeURIComponent(taskCode)}/proof`), {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    await parseError(response);
  }

  return response.json();
}

export async function submitWorkerResolutionNotes(taskCode, resolutionNotes) {
  return apiRequest(`/worker/tasks/${encodeURIComponent(taskCode)}/resolution-notes`, {
    method: 'PATCH',
    body: JSON.stringify({ resolution_notes: resolutionNotes }),
  });
}

export async function fetchWorkerCommunications() {
  return apiRequest('/worker/communications');
}

export async function sendWorkerCommunication(payload) {
  return apiRequest('/worker/communications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchWorkerNotifications() {
  return apiRequest('/worker/notifications');
}

export async function fetchWorkerSettings() {
  return apiRequest('/worker/settings');
}

export async function updateWorkerSettings(userId, payload) {
  return updateUserSettings(userId, payload);
}

export async function submitWorkerTask(taskCode, { resolutionNotes, proofFile }) {
  const formData = new FormData();
  formData.append('resolution_notes', resolutionNotes);
  formData.append('proof', proofFile);

  const response = await fetch(buildUrl(`/worker/tasks/${encodeURIComponent(taskCode)}/submit`), {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    await parseError(response);
  }

  return response.json();
}
