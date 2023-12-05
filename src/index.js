//importações necessárias para o projeto
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

//configuração de json e cors
app.use(bodyParser.json());
app.use(cors());

//rota que lista todos os usuários cadastrados
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  if (users.length > 0) return res.status(200).send(users);
  return res.status(404).send("No users found");
});

//rota que cadastra um usuário
app.post("/user", async (req, res) => {
  const userData = req.body;

  try {
    const newUser = await prisma.user.create({
      data: userData,
    });

    return res.status(201).send(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send("Error creating user");
  }
});

//rota que apaga um usuário, passando o id
app.delete("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send("Error deleting user");
  }
});

// Rota que atualiza um usuário, pelo id
app.put("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedUserData = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updatedUserData,
    });

    return res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Error updating user");
  }
});

// Rota que lista usuários que contenham o nome específico
app.get("/users/:name", async (req, res) => {
  const userName = req.params.name;

  try {
    const users = await prisma.user.findMany({
      where: {
        nome: {
          contains: userName,
        },
      },
    });

    if (users.length > 0) {
      return res.status(200).send(users);
    } else {
      return res.status(404).send("No users found with the specified name");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send("Error fetching users");
  }
});

/ Rota que lista um usuário pelo id
app.get("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      return res.status(200).send(user);
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).send("Error fetching user");
  }
});

// Inicie o servidor na porta especificada
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = { app, server };