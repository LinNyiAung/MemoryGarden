const BASE = 'https://memorygarden.onrender.com/api';

export async function getFlowers() {
  const res = await fetch(`${BASE}/flowers`);
  return res.json();
}

export async function getGarden() {
  const res = await fetch(`${BASE}/garden`);
  return res.json();
}

export async function updateGarden(title) {
  const res = await fetch(`${BASE}/garden`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  return res.json();
}

export async function plantFlower(data, photoFile) {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => form.append(k, v));
  if (photoFile) form.append('photo', photoFile);
  const res = await fetch(`${BASE}/flowers`, { method: 'POST', body: form });
  return res.json();
}

export async function deleteFlower(id) {
  const res = await fetch(`${BASE}/flowers/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function bloomFlower(id) {
  const res = await fetch(`${BASE}/flowers/${id}/bloom`, { method: 'PATCH' });
  return res.json();
}

export async function uploadAvatar(who, photoFile) {
  const form = new FormData();
  if (photoFile) form.append('photo', photoFile);
  const res = await fetch(`${BASE}/garden/avatar/${who}`, { 
    method: 'POST', 
    body: form 
  });
  return res.json();
}
