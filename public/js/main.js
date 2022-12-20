const socket = io();

const productsContainer = document.getElementById("products-table-body");
const createProductForm = document.getElementById("create-product-form")


socket.on('products', (products) => {


  const allProductsElement = products.map((product) => `
  <tr>
  <td> ${product.title}</td>
    <td>${product.description}</td>
  <td> ${product.price}</td>
  <td> <img height="72px" width="72px" src=${product.thumbnail}/> </td>
  </tr>
  `)

  .join("");



  productsContainer.innerHTML = allProductsElement;
});

createProductForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(createProductForm);

    const product = {};

    for(const field of formData.entries()){

        product[field[0]] = field [1];
    }

//    await fetch('/api/products', {
//     body: JSON.stringify(product),
//     method: 'POST',
//     headers:{
//         "Content-Type": "application/json",
//     },
//    });

  socket.emit("addProduct", product);

});