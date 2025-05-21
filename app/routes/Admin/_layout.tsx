import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import AdminHeader from "components/AdminHeader";
import { Outlet, useNavigate } from "react-router-dom";
import useUsers from "hooks/useUsers";
import useAuth from "hooks/useAuth";

const LoadingProgressBar = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      width: ["0%", "95%"],
      transition: { duration: 8, ease: "linear" },
    });
  }, [controls]);

  return (
    <div
      style={{
        width: "100%",
        height: 6,
        backgroundColor: "#e0e0e0",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          height: "100%",
          backgroundColor: "#17C3B2",
          borderRadius: 3,
          width: "0%",
        }}
        animate={controls}
      />
    </div>
  );
};

export default function AdminLayout() {
  const { GetUserById } = useUsers();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!loading && user) {
        try {
          const { data, err } = await GetUserById(user.id);
          if (err || !data || data.role !== "Admin") {
            setIsAdmin(false);
            navigate("/");
          } else {
            setIsAdmin(true);
          }
        } catch {
          setIsAdmin(false);
          navigate("/");
        } finally {
          setCheckingAuth(false);
        }
      } else if (!user && !loading) {
        setIsAdmin(false);
        setCheckingAuth(false);
        navigate("/");
      }
    };

    verifyAdmin();
  }, [loading, user]);

  if (loading || checkingAuth) {
    return (
      <div className="flex min-h-screen w-full mx-auto max-w-[1170px] px-4 sm:px-6 flex-col gap-4">
        <LoadingProgressBar />
        <span className="text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full sticky top-0 z-50 bg-[#F4F4F4b3] backdrop-blur-md">
        <AdminHeader />
      </header>

      <main className="flex-1 w-full mx-auto max-w-[1170px] px-4 sm:px-6 py-6">
        {isAdmin ? (
          <Outlet />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-red-500">
              You do not have permission to access this page.
            </h1>
          </div>
        )}
      </main>
    </div>
  );
}
