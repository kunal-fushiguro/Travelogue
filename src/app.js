import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

export { app };
