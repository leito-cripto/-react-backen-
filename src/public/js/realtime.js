const socket = io();

// Escuchar lista de productos y renderizarla
socket.on("updateProducts", (products) => {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerText = `${p.id} - ${p.title} - $${p.price}`;
    list.appendChild(li);
  });
});

// Agregar producto
document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const price = parseFloat(document.getElementById("price").value);

  socket.emit("addProduct", { title, price });
  e.target.reset();
});

// Eliminar producto
document.getElementById("delete-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("deleteId").value);

  socket.emit("deleteProduct", id);
  e.target.reset();
});
