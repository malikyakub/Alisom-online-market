import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("Login", "routes/Login.tsx"),
  route("Signup", "routes/Signup.tsx"),
  route("Contact", "routes/Contact.tsx"),
  route("User", "routes/User/_layout.tsx", {}, [
    route("Account", "routes/User/Account.tsx"),
    route("Checkout", "routes/User/Checkout.tsx"),
    route("Cart", "routes/User/Cart.tsx"),
    route("Products", "routes/User/Products.tsx"),
  ]),

  route("Admin", "routes/Admin/_layout.tsx", {}, [
    route("Dashboard", "routes/Admin/Dashboard.tsx"),
    route("AddProduct", "routes/Admin/AddProduct.tsx"),
    route("products", "routes/Admin/products.tsx"),
    route("customers", "routes/Admin/customers.tsx"),
    route("Categories", "routes/Admin/Categories.tsx"),
  ]),
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;
