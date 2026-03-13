import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routers
import scriptRoutes from "./routes/scriptRoutes.js";
import voiceRoutes from "./routes/voiceRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import complianceRoutes from "./routes/complianceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.API_PORT || "3001");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Mount routers
app.use("/api", scriptRoutes);
app.use("/api", voiceRoutes);
app.use("/api", mediaRoutes);
app.use("/api", videoRoutes);
app.use("/api", complianceRoutes);
app.use("/api", paymentRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../dist")));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});