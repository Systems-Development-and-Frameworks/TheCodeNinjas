import * as jwt from "jsonwebtoken";
import User from "./entities/user.entity";

export default function ({ req }) {
  try {
    const { headers } = req;
    const auth = headers["authorization"];
    const token = auth.replace("Bearer ", "");

    const payload: Partial<User> = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as Partial<User>;

    return { user: payload };
  } catch (e) {
    return null;
  }
}
