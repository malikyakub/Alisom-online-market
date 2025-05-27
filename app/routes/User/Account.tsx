import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUsers from "hooks/useUsers";
import useAuth from "hooks/useAuth";
import Alert from "components/Alert";

const UserAccount = () => {
  const { user, updatePassword } = useAuth();
  const { GetUserById, UpdateUser } = useUsers();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loaded, setLoaded] = useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    description: "",
    type: "info" as "success" | "warning" | "danger" | "info",
  });

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    } else if (user && !loaded) {
      GetUserById(user.id).then(({ data, err }) => {
        if (data) {
          const nameParts = (data.fullname ?? "").trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
          setFormData({
            user_id: data.user_id,
            firstName,
            lastName,
            email: data.email,
            address: data.address,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setLoaded(true);
        }
      });
    }
  }, [user, loaded, navigate, GetUserById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_id) {
      setAlert({
        isOpen: true,
        title: "Error",
        description: "User ID missing. Cannot update profile.",
        type: "danger",
      });
      return;
    }

    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        setAlert({
          isOpen: true,
          title: "Warning",
          description:
            "Please fill out all password fields to change password.",
          type: "warning",
        });
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setAlert({
          isOpen: true,
          title: "Warning",
          description: "New password and confirmation do not match.",
          type: "warning",
        });
        return;
      }

      const { success, error } = await updatePassword(
        formData.currentPassword,
        formData.newPassword
      );
      if (!success) {
        setAlert({
          isOpen: true,
          title: "Error",
          description: error || "Current password is incorrect.",
          type: "danger",
        });
        return;
      }
    }

    const updatedData = {
      fullname: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      address: formData.address,
    };

    const { err } = await UpdateUser(formData.user_id, updatedData);
    if (!err) {
      setAlert({
        isOpen: true,
        title: "Success",
        description: "Profile updated successfully.",
        type: "success",
      });
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } else {
      setAlert({
        isOpen: true,
        title: "Error",
        description: "Failed to update profile.",
        type: "danger",
      });
      console.error("Error updating profile:", err);
    }
  };

  return (
    <>
      <Alert
        title={alert.title}
        description={alert.description}
        type={alert.type}
        isOpen={alert.isOpen}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
      />
      <div className="p-4 sm:p-6 lg:p-8 h-full text-gray-900 dark:text-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Home / User /{" "}
            <span className="text-black dark:text-white font-semibold">
              My Account
            </span>
          </div>
          <div className="text-sm">
            Welcome,{" "}
            <span className="text-[#17C3B2] font-bold">
              {formData.firstName}!
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4">
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline block mb-4 lg:mb-0"
            >
              Manage My Account
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 sm:p-6 w-full lg:w-3/4">
            <h2 className="text-xl font-semibold mb-6 text-teal-600 dark:text-teal-400">
              Edit Your Profile
            </h2>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["firstName", "lastName", "email", "address"].map((field) => (
                  <div key={field}>
                    <label className="block font-bold mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      placeholder={`Enter your ${field}`}
                      value={formData[field as keyof typeof formData] as string}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 outline-none text-black dark:text-white"
                    />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-bold mb-2">Password Changes</h3>
                <div className="space-y-4">
                  {["currentPassword", "newPassword", "confirmPassword"].map(
                    (field) => (
                      <input
                        key={field}
                        type="password"
                        name={field}
                        placeholder={field
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())}
                        value={
                          formData[field as keyof typeof formData] as string
                        }
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500 outline-none text-black dark:text-white"
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="text-black dark:text-white font-semibold"
                  onClick={() => {
                    if (user) {
                      GetUserById(user.id).then(({ data }) => {
                        if (data) {
                          const nameParts = (data.fullname ?? "")
                            .trim()
                            .split(" ");
                          const firstName = nameParts[0] || "";
                          const lastName =
                            nameParts.length > 1
                              ? nameParts.slice(1).join(" ")
                              : "";
                          setFormData({
                            user_id: data.user_id,
                            firstName,
                            lastName,
                            email: data.email,
                            address: data.address,
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setLoaded(true);
                        }
                      });
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccount;
