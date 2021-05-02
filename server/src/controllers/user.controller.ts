import { hash } from "bcrypt";
import { Router } from "express";
import { DI } from "../index";
import { Users } from "../models/users";
const SALT_ROUNDS = 10;
const router = Router();

router.get("/", async (_, res) => {
  try {
    const users = await DI.em.find(Users, {});
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const user = await DI.em.findOne(Users, {
      username: req.params.username,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "ha ocurrido un error" });
  }
});

//POST

router.post("/register", async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.name) {
    res.status(400);
    return res.json({ message: "Algun dato faltante" });
  }
  try {
    const hasshedPassword = await hash(req.body.password, SALT_ROUNDS);
    const user = new Users(req.body.username, hasshedPassword, req.body.name);
    await DI.usersRepository.persistAndFlush(user);

    return res.json(user);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({
        message: "El nombre de usuario ya existe",
      });

    console.error(error);
    res.status(400);
    return res.json({ message: error.message });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const user = await DI.usersRepository.findOne({
      id: req.body.id,
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    DI.usersRepository.removeAndFlush(user);
    return res.status(200).json({ message: "Baja satisfactoria!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const UserController = router;
