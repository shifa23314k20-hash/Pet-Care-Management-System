import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import vaccinationRoutes from "./routes/vaccination.routes.js";
import petRoutes from "./routes/pet.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import healthRecordRoutes from "./routes/healthRecord.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import {
  notFoundMiddleware,
  errorMiddleware,
} from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API working",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/vaccination", vaccinationRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/health-record", healthRecordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;