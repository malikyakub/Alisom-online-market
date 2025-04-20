import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("Login", "routes/Login.tsx"),
  route("Signup", "routes/Signup.tsx"),
  route("User", "routes/User/_layout.tsx", {}, [
    route("Account", "routes/User/Account.tsx"),
  ]),
  route("Admin", "routes/Admin/_layout.tsx", {}, [ //? this is the Admin layoutout --> pages-ka admin-ka hoos imade inee listigaas galaan lga rbaa
  ]),
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;
