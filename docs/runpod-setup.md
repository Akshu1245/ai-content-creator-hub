# RunPod Setup for VORAX

Deploy your own GPU-powered video generation worker on RunPod and connect it to VORAX for ~₹3/video.

---

## Step 1 — Create a RunPod account

1. Go to [https://runpod.io](https://runpod.io) and create an account.
2. Add a minimum of **$10 credits** via the Billing dashboard.

---

## Step 2 — Deploy the VORAX Worker

1. In the RunPod dashboard, click **Serverless** in the left sidebar.
2. Click **New Endpoint**.
3. Choose a GPU:
   - **RTX 4090** — recommended (fastest, ~₹4/video)
   - **RTX 3090** — good balance (~₹3/video)
4. Docker Image: *(you will add this once the VORAX worker image is published)*
5. Set **Max Workers** to `3`.
6. Click **Deploy**.

---

## Step 3 — Get your Endpoint URL

1. After deployment, open your new endpoint from the Serverless list.
2. Copy the **Endpoint ID** (looks like: `abc123xyz789`).
3. Your full endpoint URL will be:

```
https://api.runpod.ai/v2/{endpoint_id}
```

---

## Step 4 — Get your API Key

1. In RunPod, go to **Settings → API Keys**.
2. Click **+ API Key**.
3. Give it a name (e.g. `vorax-key`) and copy the generated key.
   - It starts with `rpa_`

---

## Step 5 — Add to VORAX

1. Open VORAX in your browser.
2. Go to **Settings → Video Generation Engine**.
3. Select the **RunPod** card.
4. Paste:
   - **Endpoint URL**: `https://api.runpod.ai/v2/{your_endpoint_id}`
   - **API Key**: `rpa_xxxxxxxxxxxxxxxxxxxx`
5. Click **Test Connection** — you should see a green ✓.
6. Click **Save Engine Settings**.

All future video generations will now use your RunPod GPU endpoint.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `RunPod auth failed (HTTP 401)` | Double-check the API key — it must start with `rpa_` |
| `Connection timed out` | Verify the endpoint URL format: `https://api.runpod.ai/v2/{id}` |
| `Job failed: FAILED` | Check RunPod logs in the serverless endpoint dashboard |
| Test Connection hangs | Endpoint may be cold-starting — wait 30 s and try again |

---

## Cost Estimate

| GPU | ~Time per video | ~Cost per video |
|---|---|---|
| RTX 4090 | 15–30 s | ₹3–5 |
| RTX 3090 | 25–50 s | ₹2–4 |
| RTX 3080 | 40–70 s | ₹1.5–3 |

*Estimates based on 5-second 768×512 video. Actual costs vary with RunPod pricing.*
