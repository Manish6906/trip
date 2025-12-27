import "dotenv/config";
import express from "express";
import cors from "cors";
import tripRoutes from "./routes/tripRoutes.js";

const app = express();

/* ✅ CORS CONFIG */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tripfrontend-phi.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

/* TEST ROUTE */
app.get("/get", (req, res) => {
  res.json({ message: "Hello from backend" });
});

/* API ROUTES */
app.use("/api", tripRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
