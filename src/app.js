import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes/index.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { rateLimit } from "express-rate-limit";

const app = e();

app.use(
  cors({
    // origin: "",
    credentials: true,
  })
);

app.use(e.json({ limit: "25kb" }));
app.use(e.urlencoded({ extended: true, limit: "25kb" }));
app.use(e.static("public"));
app.use(cookieParser());
app.set("trust proxy", 1);

// ********** Routes ******************
app.use("/api/v1", router);

// *********** handle 404 not found error ****************
app.all("*", (req, res, next) => {
  const error = new Error("Endpoint not found.");
  next(error);
});
app.use((error, req, res, next) => {
  return res
    .status(404)
    .json(new ApiResponse(404, error.message, {}, false).error());
});

// ********* Rate Limiting routes  ******************
// this is not a professinal way to do

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});

export { app };
