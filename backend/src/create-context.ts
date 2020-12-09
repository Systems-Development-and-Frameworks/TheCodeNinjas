import * as jwt from "jsonwebtoken";
import { JwtPayload } from "./jwt-payload";

export default function ({ req }) {
  try {
    const { headers } = req;
    const auth = headers["authorization"];
    const token = auth.replace("Bearer ", "");

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as Partial<JwtPayload>;

    return { user: payload };
  } catch (e) {
    return { user: null };
  }
}
