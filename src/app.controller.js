import {
  globalErrorHandler,
  notFoundException,
} from "./Utils/Response/error.response.js";

import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";

import { successResponse } from "./Utils/Response/success.response.js";

import connectDB from "./DB/connection.js";
import cors from "cors";
import { connectRedis } from "./DB/redis.connection.js";

import { emailSubjects, sendEmail } from "./Utils/email/email.utils.js";
import { messageRouter } from "./Modules/index.js";
import { corsOptions } from "./Utils/cors/cors.utils.js";
import helmet from "helmet";
import morgan from "morgan";
import { attachRouterWithLogger } from "./Utils/loggers/morgan.logger.js";
import { customRateLimiter } from "./Middlewares/rateLimitter.middleware.js";


const bootstrap = async (app, express) => {
  app.use(express.json(), cors(corsOptions()), helmet(), customRateLimiter);

  await connectDB();
  await connectRedis();
  
  await sendEmail({
    to: "hm080373@gmail.com",
    subject: emailSubjects.welcome,
  });
  try {
    if (process.env.SEND_TEST_EMAIL === "true") {
      await sendEmail({
        to: "hm080373@gmail.com",
        subject: emailSubjects.welcome,
        html: "<h1>Welcome</h1>",
      });
    }
  } catch (error) {
    console.log("Test email failed:", error.message);
  }

  app.get("/", (req, res) => {
    return successResponse(res, 201, "hello from success response", {});
  });
attachRouterWithLogger(app, authRouter, "/auth", "auth.logs.txt");
  app.use("/uploads", express.static("./uploads"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);

  app.all("/*dummy", (req, res, next) => {
    throw notFoundException(req, res);
  });
  console.log(Math.floor(Math.random() * (900000 + 1000000) - 100000));

  app.use(globalErrorHandler);
};

export default bootstrap;
