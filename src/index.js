import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './dirname.js';
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'

import { productsRouter, ViewsRouter } from './routes/index.js';
import { productManager } from './Managers/index.js';



const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const PORT = 8080;

console.log(__dirname);

app.engine("hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
}));

app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) =>{
//     req.io = io;

//     next()
// })

app.set('io', io);

app.use('/', ViewsRouter)
app.use('/api/products', productsRouter)


const server = httpServer.listen(PORT, () =>
    console.log(`Server running on port ${server.address().port}`)
);

server.on("error", (error) => {
    console.log(error);
});

io.on("connection",async (socket) => {
    console.log(`New client connected, id: ${socket.id}`)

    io.sockets.emit('hola', 'HOLA!');

    const products = await productManager.getProducts()

    io.sockets.emit("products", products );

    socket.on('addProduct', async (product) => {
      await  productManager.saveProduct(product)
    })
});