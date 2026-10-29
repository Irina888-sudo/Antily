/** Client HTTP générique pour l'API générée (voir .env.example : VITE_API_URL). */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('access_token');          // [1] lire le jeton rangé
  const res = await fetch(`${API_URL}${path}`, {               // [2] UN SEUL fetch
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),  // [3] le badge, s'il existe
      ...options?.headers,                                     // [4] les en-têtes de l'appelant
    },
  });                                                          // [5] ferme l'objet ET fetch(
  if (!res.ok) {                                               // [6] erreur du back ?
    const message = await res.text().catch(() => '');
    throw new Error(message || `Erreur API (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}


export const apiClient = {
  list: <T>(resource: string) => request<T[]>(`/${resource}`),
  get: <T>(resource: string, id: string | number) => request<T>(`/${resource}/${id}`),
  create: <T>(resource: string, body: unknown) =>
    request<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(body) }),
  update: <T>(resource: string, id: string | number, body: unknown) =>
    request<T>(`/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (resource: string, id: string | number) =>
    request<void>(`/${resource}/${id}`, { method: 'DELETE' }),
  
};

export async function downloadFile(path: string, filename: string) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Erreur API (${res.status})`);
  const blob = await res.blob();                 // le fichier reçu, en mémoire
  const url = URL.createObjectURL(blob);         // une adresse temporaire vers ce fichier
  const a = document.createElement('a');         // un lien invisible
  a.href = url;
  a.download = filename;                         // le nom du fichier téléchargé
  a.click();                                     // on clique pour lui
  URL.revokeObjectURL(url);                      // on libère la mémoire
}

export async function uploadFile<T>(path: string, file: File): Promise<T> {
  const token = localStorage.getItem('access_token');
  const body = new FormData();
  body.append('file', file);
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });
  if (!res.ok) throw new Error(`Erreur API (${res.status})`);
  return res.json();
}
