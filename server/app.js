import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import adminRoutes from "./routes/adminRoute.js";
import courseRoutes from "./routes/courseRoute.js";
import otherRoutes from "./routes/otherRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import userRoutes from "./routes/userRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/course", courseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", otherRoutes);

export default app;
