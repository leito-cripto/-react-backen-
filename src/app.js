console.log('Servidor listo ���');
import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import viewsRouter from "./routes/views.router.js";
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configurar Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Router
app.use("/", viewsRouter);

// Servidor HTTP
const httpServer = app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// WebSocket server
const io = new Server(httpServer);

// Archivo de productos
const productsFile = path.join(__dirname, "products.json");

const getProducts = () => {
  if (!fs.existsSync(productsFile)) return [];
  return JSON.parse(fs.readFileSync(productsFile, "utf-8"));
};

const saveProducts = (products) => {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};

// WebSockets
io.on("connection", (socket) => {
  console.log("✅ Nuevo cliente conectado");

  // Enviar lista inicial
  socket.emit("updateProducts", getProducts());

  // Crear producto
  socket.on("addProduct", (product) => {
    let products = getProducts();
    const newProduct = {
      id: Date.now(),
      title: product.title,
      price: product.price,
    };
    products.push(newProduct);
    saveProducts(products);

    io.emit("updateProducts", products); // enviar a todos
  });

  // Eliminar producto
  socket.on("deleteProduct", (id) => {
    let products = getProducts().filter((p) => p.id !== id);
    saveProducts(products);
    io.emit("updateProducts", products);
  });
});
