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
    <div className="w-full h-2 bg-gray-200 overflow-hidden">
      <motion.div
        className="h-full bg-teal-500"
        style={{ width: "0%" }}
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
      <div className="flex mt-2 w-full mx-auto max-w-[1170px] px-4 sm:px-6 flex-col gap-4">
        <LoadingProgressBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header className="w-full sticky top-0 z-50 bg-[#F4F4F4]/10 backdrop-blur-md">
        <AdminHeader />
      </header>

      <main className="flex-1 w-full mx-auto max-w-[1170px] px-4 sm:px-6 py-6">
        {isAdmin ? (
          <Outlet />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-red-500 text-centers">
              You do not have permission to access this page.
            </h1>
          </div>
        )}
      </main>
    </div>
  );
}
