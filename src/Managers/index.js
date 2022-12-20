import { ProductManagerFilesystem } from "./ProductManager.js";

export const productManager = new ProductManagerFilesystem(
    "./src/db/ProductManagerFilesystem.json"
    );
