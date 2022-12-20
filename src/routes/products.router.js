import { Router } from "express";
import { productManager } from "../Managers/index.js";
import { ERRORS } from "../consts/index.js";


const router = Router()

router.get('/', async (req, res) => {
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

router.get("/:id", async (req, res) => {
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


router.post("/", async (req,res) => {
    try{
        const {title, description, price, code, thumbnail, stock} = req.body;
      

        if (!title || !description || !price || !code)
        return res.send({
         success: false,
         error: "Las variables son obligatorias",
        });
        const savedProduct = await productManager.saveProduct ({
            title,
            description,
            price,
            code,
            thumbnail,
            stock,
        });

        // req.io.sockets.emit("products", products);

        req.get('io').socket.emit("hello", "hola!")

        return res.send({success: true, product: savedProduct});
    } catch (error){
        console.log (error);

        if (error.name === ERRORS.VALIDATION_ERROR){
            return res.send({
                success: false,
                error: {[error.name]: error.messaje},
            });
        }

        res.send ({
            success:false,
            error: "ha ocurrido un error",
        });
    }
});

router.put ("/:id", async (req, res) =>{
    try{
    const {id: paramId} = req.params;
    const id = Number(paramId);
    if (id < 0){
        return res.send ({
            sucess: false,
            error: "El id debe ser un numero valido",
        });
    }
    const {title, description, price, code, thumbnail, stock} = req.body;

    const updateProduct = await productManager.update({
        id,
        newData: {title, description, price, code, thumbnail, stock},
    });

    return res.send({success: true, product: updateProduct});
} catch (error) {
    console.log (error);
    if(error.name === ERRORS.NOT_FOUND)
    return res.send ({
        success: false,
        error:`${error.name}: ${error.message}`,
    });

    res.send({
        success: false,
        error: "Ha ocurrido un error"
    });
}
});

router.delete ("/:id", async (req, res) =>{
    try {
        const {id:paramId} = req.params;
        const id = Number(paramId);
        if (id < 0){
            return res.send ({
                success:false,
                error: "El id debe ser un numero valido",
            });
        }

        const deletedProduct = await productManager.deleteProduct(id);

        res.send({
            success: true,
            deleted: deletedProduct,
        });
    }catch (error){
        console.log(error);
        if (error.name === ERRORS.NOT_FOUND)
        return res.send({
            success:false,
            error: `${error.name}: ${error.message}`,
        });
        res.send({
            success: false,
            error: "Ha ocurrido un error",
        });
    }
});


export {router as productsRouter}