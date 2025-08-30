import { Router } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();


const productsFile = path.join(__dirname, "../products.json");

const getProducts = () => {
  if (!fs.existsSync(productsFile)) return [];
  return JSON.parse(fs.readFileSync(productsFile, "utf-8"));
};


router.get("/", (req, res) => {
  res.render("home", { products: getProducts() });
});


router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
