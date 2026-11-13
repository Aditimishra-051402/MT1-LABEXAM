import express from "express";

const app = express();

// Middleware to read JSON data
app.use(express.json());

// Shopping cart array
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 999,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "Laptop Bag",
    price: 599,
    quantity: 2,
    category: "Accessories",
  },
];

// Validate product details
function validProduct(product) {
  return (
    typeof product.productName === "string" &&
    product.productName.trim() !== "" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    Number.isInteger(product.quantity) &&
    product.quantity > 0 &&
    typeof product.category === "string" &&
    product.category.trim() !== ""
  );
}

// GET - Retrieve all cart items
app.get("/cart", (req, res) => {
  res.status(200).json(cart);
});

// GET - Retrieve product by ID
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    ...product,
    totalPrice: product.price * product.quantity,
  });
});

// POST - Add new product
app.post("/cart", (req, res) => {
  const product = req.body;

  if (
    !Number.isInteger(product.id) ||
    product.id <= 0 ||
    cart.some((item) => item.id === product.id) ||
    !validProduct(product)
  ) {
    return res.status(400).json({
      message: "Invalid product details or duplicate ID",
    });
  }

  cart.push(product);

  res.status(201).json({
    message: "Product added successfully",
    product: product,
  });
});

// PUT - Update product
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  if (!validProduct(req.body)) {
    return res.status(400).json({
      message: "Invalid product details",
    });
  }

  cart[index] = {
    id: id,
    ...req.body,
  };

  res.status(200).json({
    message: "Product updated successfully",
    product: cart[index],
  });
});

// DELETE - Remove product
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deletedProduct = cart.splice(index, 1);

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct[0],
  });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      message: "Invalid JSON format",
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
});

// Start Express server
app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});
