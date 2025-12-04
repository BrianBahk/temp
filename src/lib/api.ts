export interface APIPublication {
  id: number;
  title: string;
  author?: string;
}

export async function fetchPublications(): Promise<APIPublication[]> {
  const base = import.meta.env.VITE_API_URL || '';
  const url = base ? `${base.replace(/\/$/, '')}/api/publications` : '/api/publications';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch publications: ${res.status}`);
  return res.json();
}
