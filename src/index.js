import express from 'express';
import { productManager } from './Managers/index.js';

const app = express();

const PORT = 8080;

app.get('/api/products', async (req, res) => {
    try {
        const { limit, skip } = req.query

        const allProducts = await productManager.getProducts();

        if (!limit || limit < 1) {
            return res.send({ success: true, products: allProducts });
        }

        //    const products = allProducts.slice(skip ?? 0, limit + skip)
        const products = allProducts.slice(0, limit);

        res.send({ success: true, products: allProducts });
    } catch (error) {
        console.log(error)

        res.send({ success: false, error: "ha ocurrido un error" });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const { id: paramId } = req.params;

        const id = Number(paramId)

        if (Number.isNaN(id) || id < 0) {
            return res.send({ success: false, error: "el id debe ser un numero valido" });
        }

        const product = await productManager.getProductById(id)

        if(!product) {
            return res.send({ success: false, error: "producto no encontrado" });
        }

        res.send ({success: true, product: product});

    } catch (error) {
        console.log(error)

        res.send({success: false, error:"ha ocurrido un error"})
     }
});


app.listen(PORT, () => console.log('Server running on port ${8080}'));