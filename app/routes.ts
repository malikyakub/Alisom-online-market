import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("Login", "routes/Login.tsx"),
  route("Signup", "routes/Signup.tsx"),
  route("User", "routes/User/_layout.tsx", {}, [
    route("Account", "routes/User/Account.tsx"),
  ]),
  route("Admin", "routes/Admin/_layout.tsx", {}, [
    route("Dashboard", "routes/Admin/Dashboard.tsx"),
  ]),
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;
