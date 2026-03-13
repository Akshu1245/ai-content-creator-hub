import { Router } from "express";

const router = Router();
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

function sanitize(str: unknown, maxLen = 200): string {
  return Array.from(String(str ?? "").substring(0, maxLen))
    .filter((char) => char.charCodeAt(0) >= 32)
    .join("");
}

router.post("/stock-media", async (req, res) => {
  try {
    if (!PEXELS_API_KEY) return res.status(500).json({ error: "PEXELS_API_KEY not configured" });
    const { query, type, per_page, orientation } = req.body;
    const safeQuery = sanitize(query, 200);
    if (!safeQuery) return res.status(400).json({ error: "Missing search query" });
    const mediaType = type === "videos" ? "videos" : "photos";
    const baseUrl = mediaType === "videos" ? "https://api.pexels.com/videos/search" : "https://api.pexels.com/v1/search";
    const safePP = Math.min(Math.max(Number(per_page) || 10, 1), 30);
    const safeOrientation = ["landscape", "portrait", "square"].includes(orientation) ? orientation : "landscape";
    const params = new URLSearchParams({ query: safeQuery, per_page: String(safePP), orientation: safeOrientation });
    const response = await fetch(`${baseUrl}?${params}`, { headers: { Authorization: PEXELS_API_KEY } });
    if (!response.ok) throw new Error("Media search failed");
    const pData = await response.json();
    if (mediaType === "videos") {
      const videos = (pData.videos || []).map((v: any) => ({
        id: v.id, url: v.url, image: v.image, duration: v.duration,
        width: v.width, height: v.height,
        videoFiles: v.video_files?.map((f: any) => ({ link: f.link, quality: f.quality, width: f.width, height: f.height, fileType: f.file_type })) || [],
        photographer: v.user?.name || "",
      }));
      return res.json({ type: "videos", results: videos, total: pData.total_results });
    } else {
      const photos = (pData.photos || []).map((p: any) => ({
        id: p.id, url: p.url, alt: p.alt, photographer: p.photographer,
        src: { original: p.src?.original, large: p.src?.large, medium: p.src?.medium, small: p.src?.small, landscape: p.src?.landscape },
      }));
      return res.json({ type: "photos", results: photos, total: pData.total_results });
    }
  } catch (e: any) {
    console.error("stock-media error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

export default router;