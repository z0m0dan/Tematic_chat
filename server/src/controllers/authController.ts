import { compare } from "bcrypt";
import express from "express";
import { sign, verify } from "jsonwebtoken";
import { DI } from "../index";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const user = await DI.usersRepository.findOne({
      username: req.body.username,
    });

    if (!user)
      return res.status(404).json({
        message: "Usuario inexistente",
      });

    if (!(await compare(req.body.password, user.password)))
      return res.status(401).json({
        message: "Clave incorrecta",
      });
    const payload = {
      sub: user.id,
      user,
      iat: 60 * 60 * 24 * 7,
    };
    const token = sign(payload, process.env.JWT_SECRET || "secret");
    return res.status(200).json({
      message: "Logeado satisfactoriamente",
      token: token,
    });
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
});

router.get("/me", (req, res) => {
  if (!req.headers.authorization)
    return res.status(403).json({
      message: "No permisos: no se proporciono token",
    });

  const token = req.headers.authorization.split(" ")[1];
  try {
    const payload = verify(token, process.env.JWT_SECRET || "secret");
    return res.send((payload as any).user);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
});

export const AuthController = router;
