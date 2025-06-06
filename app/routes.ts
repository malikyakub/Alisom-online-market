import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("Login", "routes/Login.tsx"),
  route("Signup", "routes/Signup.tsx"),
  route("forgot-password", "routes/ForgorPassword.tsx"),
  route("reset-password", "routes/ResetPassword.tsx"),
  route("Contact", "routes/Contact.tsx"),
  route("About", "routes/About.tsx"),
  route("privacy-policy", "routes/PrivacyPolicy.tsx"),
  route("terms-of-services", "routes/TermsOfService.tsx"),
  route("User", "routes/User/_layout.tsx", {}, [
    route("Account", "routes/User/Account.tsx"),
    route("Checkout", "routes/User/Checkout.tsx"),
    route("Cart", "routes/User/Cart.tsx"),
    route("Products", "routes/User/Products.tsx"),
    route("Wishlist", "routes/User/Wishlist.tsx"),
    route("products/:productId", "routes/User/ProductDetails.tsx"),
    route("orders", "routes/User/MyOrders.tsx"),
    route("reviews", "routes/User/MyReviews.tsx"),
  ]),

  route("Admin", "routes/Admin/_layout.tsx", {}, [
    route("Dashboard", "routes/Admin/Dashboard.tsx"),
    route("AddProduct", "routes/Admin/AddProduct.tsx"),
    route("products", "routes/Admin/products.tsx"),
    route("customers", "routes/Admin/customers.tsx"),
    route("Categories", "routes/Admin/Categories.tsx"),
    route("settings", "routes/Admin/settings.tsx"),
    route("orders", "routes/Admin/orders.tsx"),
    route("orders/:orderId", "routes/Admin/OrdersData.tsx"),
  ]),
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;
