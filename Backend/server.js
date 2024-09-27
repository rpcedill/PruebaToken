const express = require("express");
const http = require("http");
const sequelize = require("./config/database");
const Usuario = require("./models/Usuario");
const Token = require("./models/Token");
const cors = require("cors");

const { Server } = require("socket.io");
const { Op } = require("sequelize");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
    allowedHeaders: "*",
    credentials: true,
  },
});

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());

sequelize.sync();



function nuevoToken() {
  let token = "";
  let ind = 0;
  while (ind < 6) {
    ind += 1;
    token = token + Math.floor(Math.random() * 10);
  }
  return token;
}

app.post("/crearUsuario", async (req, res) => {
  try {
    const { nombre } = req.body;
    let user = await Usuario.create({
      nombre: nombre,
    });
    return res.status(200).json({ usaurio: user });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: "Usuario existente" });
  }
});

app.get("/tabla", async (req, res) => {
  try {
    const resultado = await Token.findAll({
      include: [
        {
            model: Usuario,
            attributes: ['nombre'], 
        },
    ],
    })
    return res.status(200).json({ lista: resultado });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: "Ocurrió un error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { nombre } = req.body;
    const usuario = await Usuario.findOne({ where: { nombre: nombre } });
    if (usuario) {
      return res.status(200).json({ usuario: usuario });
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
});

app.post("/usarToken", async (req, res) => {
  try {
    const { cliente, token } = req.query;
    const usuario = await Usuario.findOne({ where: { nombre: cliente } });
    if(!usuario){
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const tokenDB = await Token.findOne({
      where: {
        valor: token,
        usuarioId: usuario.id,
        expiracion: {
          [Op.gte]: new Date(),
        },
        estado: "SIN USAR",
      },
    });

    if (!tokenDB) {
      return res.status(404).json({ message: "Token inválido o expirado" });
    }

    await tokenDB.update({
      estado: "USADO",
      fechaUso: new Date(),
    });
    return res.status(200).json({ message: "Token usado exitosamente" });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: "Ocurrió un error" });
  }
});

const socketsActivos = new Set();

io.on("connection", async (socket) => {
  try {
    socketsActivos.add(socket.id);
    console.log("Cliente conectado", socket.id);

    socket.on("usuario", async (user) => {
      const usuario = await Usuario.findOne({ where: { id: user } });
      if (!usuario) {
        socket.emit("token", {
          mensaje: "Usuario no encontrado",
        });
      } else {
        let userID = usuario.id;
        let token = await obtenerToken(userID);
        socket.emit("token", {
          token: token,
        });

        let diferencia = Math.floor((token.expiracion - Date.now()) / 1000);
        contador(diferencia, socket, userID);
      }
    });

    socket.on("disconnect", () => {
      socketsActivos.delete(socket.id);
      console.log("Cliente desconectado", socket.id);
    });
  } catch (e) {
    console.log(e);
  }
});

server.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});


function contador(tiempo, socket, userID) {
  return new Promise((resolve, reject) => {
    try {
      let countDown = setInterval(async () => {
        if (!socketsActivos.has(socket.id)) {
          clearInterval(countDown);
          console.log("cerrado");
          resolve("sesión cerrada");
        }
        console.log(tiempo, socket.id);
        tiempo--;
        if (tiempo <= 0) {
          clearInterval(countDown);
          resolve("Tiempo acabado");
          let token = await generarNuevo(userID);
          socket.emit("token", {
            token: token,
          });
          let diferencia = Math.floor((token.expiracion - Date.now()) / 1000);
          contador(diferencia, socket, userID);
        }
      }, 1000);
    } catch (err) {
      resolve("Ocurrió un error");
    }
  });
}

async function obtenerToken(user) {
  const tokenDB = await Token.findOne({
    where: {
      usuarioId: user,
      expiracion: {
        [Op.gt]: new Date(),
      },
    },
    order: [["createdAt", "DESC"]],
  });
  if (tokenDB) {
    console.log("token existente", user);
    return tokenDB;
  }
  return await generarNuevo(user);
}

async function generarNuevo(user) {
  const ahora = new Date();
  const expiracion = new Date(ahora.getTime() + 60 * 1000);
  console.log("token nuevo", user);
  const token = await Token.create({
    valor: nuevoToken(),
    expiracion,
    usuarioId: user,
  });
  return token;
}
