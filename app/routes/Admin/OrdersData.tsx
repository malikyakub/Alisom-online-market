import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useOrders from "hooks/useOrders";
import useProducts from "hooks/useProducts";
import { useParams } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
import Alert from "components/Alert";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Paid":
    case "Delivered":
      return "bg-[#28A745]/40 text-[#28A745]";
    case "Pending":
    case "Pickup":
      return "bg-[#FFC107]/40 text-[#FFC107]";
    case "Not-paid":
    case "Canceled":
      return "bg-[#DC3545]/40 text-[#DC3545]";
    case "Shipped":
      return "bg-[#007BFF]/40 text-[#007BFF]";
    default:
      return "bg-gray-300 text-gray-700";
  }
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center justify-center px-3 py-2 rounded text-xs font-semibold whitespace-nowrap ${getStatusStyles(
      status
    )}`}
  >
    {status}
  </span>
);

const OrdersData = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder, returnItem, isLoading } = useOrders();
  const { GetProductById } = useProducts();

  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    description: "",
    type: "info" as "success" | "warning" | "danger" | "info",
  });

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderWithProducts = async () => {
      setLoading(true);
      const result = await getOrder(orderId);
      if (result.err) {
        setErr(result.err);
        setLoading(false);
        return;
      }

      const items = result.data.items || [];

      const itemsWithFullProduct = await Promise.all(
        items.map(async (item: any) => {
          const { data: productData, err: productErr } = await GetProductById(
            item.product_id
          );
          if (productErr) {
            return { ...item, products: item.products || null };
          }
          return { ...item, products: productData };
        })
      );

      setData({ ...result.data, items: itemsWithFullProduct });
      setLoading(false);
    };

    fetchOrderWithProducts();
  }, [orderId]);

  const formatDateName = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options).replace(" ", "-");
  };

  const formatDateFull = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) return <div>Loading...</div>;
  if (err) return <div>Error: {err}</div>;
  if (!data) return <div>No order data found.</div>;

  const handleCopyName = (name: string) => {
    navigator.clipboard.writeText(name);
    setAlert({
      isOpen: true,
      title: "Copied to Clipboard",
      description: `Product name "${name}" has been copied.`,
      type: "info",
    });
    setDropdownOpenId(null);
  };

  const handleRemoveItem = async (order_item_id: string) => {
    if (!orderId) return;
    const { data: resultData, err } = await returnItem(orderId, order_item_id);
    if (err) {
      setAlert({
        isOpen: true,
        title: "Error",
        description: String(err),
        type: "danger",
      });
      return;
    }
    setData((prevData: any) => ({
      ...prevData,
      items: prevData.items.filter(
        (item: any) => item.order_item_id !== order_item_id
      ),
    }));
    setAlert({
      isOpen: true,
      title: "Item Removed",
      description: "Item was removed from the order successfully.",
      type: "success",
    });
    setDropdownOpenId(null);
  };

  return (
    <div className="text-[#1A2238] dark:text-[#F4F4F4] min-h-screen">
      <Alert
        isOpen={alert.isOpen}
        title={alert.title}
        description={alert.description}
        type={alert.type}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />

      <h1 className="text-3xl font-bold mb-4 text-[#1A2238] dark:text-white">
        Order {data?.created_at ? formatDateName(data.created_at) : "N/A"}
      </h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-[#2C2C2C]/20 p-4 rounded-lg shadow border border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
          <table className="min-w-full text-sm">
            <tbody>
              <tr className="align-middle">
                <td className="font-semibold pr-2 py-2">Name:</td>
                <td className="py-2">{data.Full_name}</td>
              </tr>
              <tr className="align-middle">
                <td className="font-semibold pr-2 py-2">Email:</td>
                <td className="py-2">
                  <a
                    href={`mailto:${data.Email}`}
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    {data.Email}
                  </a>
                </td>
              </tr>
              {data.Phone && (
                <tr className="align-middle">
                  <td className="font-semibold pr-2 py-2">Phone:</td>
                  <td className="py-2">{data.Phone}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="py-2">
            <span
              className={`inline-flex items-center justify-center px-3 py-2 rounded text-xs font-semibold whitespace-nowrap ${
                data.is_Guest
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
              }`}
            >
              {data.is_Guest ? "Guest" : "Customer"}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2C2C2C]/20 p-4 rounded-lg shadow border border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold mb-2">Order Details</h2>
          <table className="min-w-full text-sm">
            <tbody>
              <tr className="align-middle">
                <td className="font-semibold pr-2 py-2">Date:</td>
                <td className="py-2">{formatDateFull(data.created_at)}</td>
              </tr>
              {data.tracking_number && (
                <tr className="align-middle">
                  <td className="font-semibold pr-2 py-2">Tracking #:</td>
                  <td className="py-2">{data.tracking_number}</td>
                </tr>
              )}
              <tr className="align-middle">
                <td className="font-semibold pr-2 py-2">Status:</td>
                <td className="py-2">
                  <StatusBadge status={data.shipping_status || data.Status} />
                </td>
              </tr>
              <tr className="align-middle">
                <td className="font-semibold pr-2 py-2">Shipping:</td>
                <td className="py-2">{data.Shipping}</td>
              </tr>
              <tr className="align-middle">
                <td className="font-semibold pr-2 py-2">Address:</td>
                <td className="py-2">
                  {data.Address}, {data.City}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-[#2C2C2C]/20 rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
        <table className="min-w-full text-sm text-[#1A2238] dark:text-white">
          <thead className="bg-[#F4F4F4] dark:bg-[#2C2C2C]/50 text-[#333] dark:text-white">
            <tr>
              {["Product Name", "Price", "Quantity", "Total", ""].map(
                (header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 font-semibold whitespace-nowrap border-b border-gray-300 dark:border-white/10"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {data.items.map((item: any) => {
              const productName = item.products?.name || "Unknown Product";
              const price = item.products?.price;
              const total = price ? price * item.quantity : null;

              return (
                <tr
                  key={item.order_item_id}
                  className="border-t dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#1F2937] relative transition-colors"
                >
                  <td className="px-4 py-3 border-b border-gray-300 dark:border-white/10 font-medium max-w-xs truncate">
                    {productName}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300 dark:border-white/10">
                    {price != null ? `$${price.toFixed(2)}` : "N/A"}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300 dark:border-white/10">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300 dark:border-white/10">
                    {total != null ? `$${total.toFixed(2)}` : "N/A"}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-300 dark:border-white/10 relative">
                    <button
                      onClick={() =>
                        setDropdownOpenId(
                          dropdownOpenId === item.order_item_id
                            ? null
                            : item.order_item_id
                        )
                      }
                      className="text-xl text-[#666] dark:text-[#CCCCCC] hover:text-black dark:hover:text-white transition focus:outline-none"
                      aria-label="Actions dropdown"
                    >
                      ⋯
                    </button>

                    <AnimatePresence>
                      {dropdownOpenId === item.order_item_id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 right-0 mt-2 w-36 bg-white dark:bg-[#F4F4F4]/10 backdrop-blur-2xl border border-gray-200 dark:border-white/20 rounded-xl shadow-md p-2"
                        >
                          <button
                            onClick={() => handleCopyName(productName)}
                            className="block w-full px-4 py-2 text-sm text-[#333] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                          >
                            Copy Name
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.order_item_id)}
                            className="block w-full px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <span>Removing...</span>
                                <span>
                                  <ClipLoader size={16} color="#fff" />
                                </span>
                              </span>
                            ) : (
                              "Remove Item"
                            )}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersData;
