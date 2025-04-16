import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("Login", "routes/Login.tsx"),
    route("Signup", "routes/Signup.tsx"),
    route("Useraccount", "routes/UserAccount.tsx"),
    
] satisfies RouteConfig;
