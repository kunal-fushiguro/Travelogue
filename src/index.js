import { databaseConnect } from "./config/database/index.js";
import { app } from "./app.js";
import { PORT } from "./config/envConfig/index.js";

databaseConnect()
  .then(() => {
    app.on("error", (err) => {
      console.error("Application error : " + err);
    });

    app.listen(PORT || 8000, () => {
      console.log("Server started on PORT : " + PORT || 8000);
    });
  })
  .catch((err) => {
    console.error("database error : " + err);
    process.exit(1);
  });
