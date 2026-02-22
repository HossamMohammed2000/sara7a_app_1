import {
  globalErrorHandler,
  notFoundException,
} from "./Utils/Response/error.response.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import { successResponse } from "./Utils/Response/success.response.js";
import connectDB from "./DB/connection.js";

const bootstrap = async (app, express) => {
  app.use(express.json());
await connectDB();
  app.get("/", (req, res) => {
    return successResponse(
      res,
      (statusCode = 201),
      (message = "hello from sucess response"),
      {},
    );

  });

  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.all("/*dummy", (req, res) => {
    throw notFoundException({ message: "not found handler" });
  });
  app.use(globalErrorHandler);
};

export default bootstrap;
