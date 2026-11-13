import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shopping cart array
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 999,
    quantity: 1,
  },
  {
    id: 3,
    productName: "Laptop Bag",
    price: 599,
    quantity: 1,
  },
];

// Create HTTP server
const server = http.createServer((req, res) => {
  // Home route
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end("<h1>Welcome to Shopping Cart Application</h1>");
  }

  // Get all cart items
  else if (req.method === "GET" && req.url === "/cart") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(cart));
  }

  // About route
  else if (req.method === "GET" && req.url === "/about") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(
      "<h1>About Shopping Cart</h1><p>This application manages shopping products.</p>",
    );
  }

  // Serve HTML using FS module
  else if (req.method === "GET" && req.url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });

        res.end("Error reading HTML file");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
      });

      res.end(data);
    });
  }

  // Add product to cart
  else if (req.method === "POST" && req.url === "/add-to-cart") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const product = JSON.parse(body);

        if (
          product.id === undefined ||
          !product.productName ||
          typeof product.price !== "number" ||
          !Number.isFinite(product.price) ||
          product.price < 0 ||
          !Number.isInteger(product.quantity) ||
          product.quantity <= 0 ||
          cart.some((item) => item.id === product.id)
        ) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              message: "Invalid product details or duplicate ID",
            }),
          );

          return;
        }

        cart.push(product);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product: product,
          }),
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Invalid JSON format",
          }),
        );
      }
    });
  }

  // Invalid routes
  else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    res.end("404 - Page Not Found");
  }
});

// Start server
server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
