import { Router } from "express";
import { Chat } from "../models/Chat";
import { permissionMiddleware } from "../functions";
import { DI } from "../index";

const router = Router();

router.get("/chats", permissionMiddleware, async (_, res) => {
  try {
    const chats = await DI.em.find(Chat, {});
    return res.json({ chats: chats });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/chats/:username", permissionMiddleware, async (req, res) => {
  try {
    const user = await DI.usersRepository.findOne(
      {
        username: req.params.username,
      },
      ["SavedChats"]
    );

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ chats: user.SavedChats });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/chats/new", permissionMiddleware, async (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.username)
    return res.status(400).json({ message: "Algun dato faltante" });

  DI.em.fork();
  DI.em.begin();
  try {
    const user = await DI.usersRepository.findOne(
      { username: req.body.username },
      ["SavedChats"]
    );
    if (!user)
      return res
        .status(404)
        .json({ message: "No se encuentra el usuario especificado" });

    const chat = DI.em.create(Chat, {
      Nombre: req.body.name,
      Descripcion: req.body.description,
      createdBy: user,
    });
    DI.em.persist(chat);

    user.SavedChats.add(chat);

    DI.em.commit();
    return res.status(200).json({ message: "chat creado satisfactoriamente" });
  } catch (error) {
    DI.em.rollback();
    return res.status(400).json({ message: error.message });
  }
});

router.post("/chats/add/", permissionMiddleware, async (req, res) => {
  if (!req.body.username || !req.body.chatID)
    return res
      .status(400)
      .json({ message: "Algun dato faltante, verifica los datos ingresados" });

  try {
    const user = await DI.usersRepository.findOne({
      username: req.body.username,
    });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado f" });

    const chat = await DI.em.findOne(Chat, { ChatID: req.body.chatID });

    if (!chat) return res.status(404).json({ message: "Chat no encontrado" });

    if (user.SavedChats.contains(chat))
      return res
        .status(400)
        .json({ messaage: "Ya tienes registrado ese chat en tu lista" });

    user.SavedChats.add(chat);

    return res.json({ message: "Chat agregado satisfactoriamente" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const ApiController = router;
