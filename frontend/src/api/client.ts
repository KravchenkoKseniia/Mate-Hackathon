const API_BASE = "/api";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Upload failed");
  }
  const data = await res.json();
  return data.image_url;
}

export async function removeBackground(imageUrl: string): Promise<string> {
  const res = await fetch(`${API_BASE}/remove-bg`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Background removal failed");
  }
  const data = await res.json();
  return data.cutout_url;
}

export async function generateShots(
  imageUrl: string,
  scenes: string[],
): Promise<{ scene_name: string; images: string[] }[]> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, scenes }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Generation failed");
  }
  const data = await res.json();
  return data.results;
}

export async function fetchScenes(): Promise<
  { id: string; name: string; prompt: string }[]
> {
  const res = await fetch(`${API_BASE}/scenes`);
  if (!res.ok) throw new Error("Failed to fetch scenes");
  return res.json();
}

export async function recommendScenes(
  imageUrl: string,
  sceneIds?: string[],
): Promise<{ reasoning: string; recommended_scenes: string[] }> {
  const body: Record<string, unknown> = { image_url: imageUrl };
  if (sceneIds) body.scene_ids = sceneIds;
  const res = await fetch(`${API_BASE}/recommend-scenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { reasoning: "", recommended_scenes: [] };
  return res.json();
}
