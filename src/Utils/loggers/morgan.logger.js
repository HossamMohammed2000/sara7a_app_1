import fs from "fs";
import path from "path";
import morgan from "morgan";

const __dirname = path.resolve();
export function attachRouterWithLogger(app, router, routePath,logFileName) {
  const logStream = fs.createWriteStream(
    path.join(__dirname, "./src/logger", logFileName),
    { flags: "a" },
  );
  app.use(routePath, morgan("combined", { stream: logStream }), router);
  app.use(routePath,morgan("dev") ,router);
}