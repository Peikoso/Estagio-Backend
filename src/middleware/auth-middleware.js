import { AuthService } from "../services/auth.js";
import { UnauthorizedError } from "../utils/errors.js";

export const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token not provided.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedUser = await AuthService.verifyToken(token);
    req.user = decodedUser; // usuário disponível em qualquer controller
    next();
  } catch (error) {
    throw new UnauthorizedError(error.message);
  }
};
