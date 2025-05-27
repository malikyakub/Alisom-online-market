import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PaymentApprovalModal from "components/PaymentApprovalModal";
import useOrders from "hooks/useOrders";
import Alert from "components/Alert";
import ShippingInfoModel from "components/ShippingInfoModel";

type OrderStatus = "Paid" | "Pending" | "Not-paid";
type OrderStatusWithShipping =
  | OrderStatus
  | "Shipped"
  | "Delivered"
  | "Pickup"
  | "Canceled";

type Order = {
  Order_id: string;
  Full_name: string;
  Phone: string;
  Email: string;
  Address: string;
  City: string;
  total_price: string;
  Shipping: string;
  Status: OrderStatus;
  shipping_status?: OrderStatusWithShipping;
};

interface HandleDeliverParams {
  order_id: string;
  tracking_number: string;
}

const OrdersTable: React.FC = () => {
  const {
    AllOrders,
    updateOrderStatusAndAdjustStock,
    deleteOrderAndRestockItems,
    SetOrderShippingData,
  } = useOrders();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type?: "success" | "warning" | "danger" | "info";
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
  });

  const rowsPerPage = 12;

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, err } = await AllOrders();
      if (err) return;

      const standardizedOrders = data.map((order: any) => {
        let status = order.Status;
        if (status === "No-paid" || status === "Denied") status = "Not-paid";
        else if (status === "Approved") status = "Paid";
        return { ...order, Status: status };
      });

      setOrders(standardizedOrders);
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.Full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAction = async (action: string, id: string) => {
    const order = orders.find((o) => o.Order_id === id);
    switch (action) {
      case "delete":
        const { err } = await deleteOrderAndRestockItems(id);
        if (!err) {
          setOrders((prev) => prev.filter((order) => order.Order_id !== id));
          setAlert({
            isOpen: true,
            title: "Order Deleted",
            description: `Order ${id} was deleted successfully.`,
            type: "success",
          });
        } else {
          setAlert({
            isOpen: true,
            title: "Error Deleting Order",
            description: String(err),
            type: "danger",
          });
        }
        break;
      case "copy-id":
        navigator.clipboard.writeText(id);
        setAlert({
          isOpen: true,
          title: "Copied to Clipboard",
          description: `Order ID ${id} has been copied.`,
          type: "info",
        });
        break;
      case "edit":
        window.location.href = `/admin/orders/${id}`;
        break;
      case "approve-payment":
        if (order?.Status === "Pending") {
          setSelectedOrder(order);
          setShowPaymentModal(true);
        }
        break;
    }
    setDropdownOpenId(null);
  };

  const isSelected = (id: string) => selectedOrderIds.has(id);

  const toggleSelect = (id: string) => {
    setSelectedOrderIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const areAllOnPageSelected = paginatedOrders.every((o) =>
    selectedOrderIds.has(o.Order_id)
  );

  const toggleSelectAll = () =>
    areAllOnPageSelected
      ? setSelectedOrderIds((prev) => {
          const newSet = new Set(prev);
          paginatedOrders.forEach((o) => newSet.delete(o.Order_id));
          return newSet;
        })
      : setSelectedOrderIds((prev) => {
          const newSet = new Set(prev);
          paginatedOrders.forEach((o) => newSet.add(o.Order_id));
          return newSet;
        });

  const getStatusStyles = (status: OrderStatus | string) => {
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

  const StatusBadge: React.FC<{ status: OrderStatusWithShipping }> = ({
    status,
  }) => (
    <span
      className={`inline-flex items-center justify-center px-3 py-2 rounded text-xs font-semibold whitespace-nowrap ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );

  const handlePaymentDecision = async (action: "Approved" | "Denied") => {
    if (!selectedOrder) return;

    const { data, err } = await updateOrderStatusAndAdjustStock(
      selectedOrder.Order_id,
      action
    );

    if (!err) {
      setOrders((prev) =>
        prev.map((o) =>
          o.Order_id === selectedOrder.Order_id
            ? { ...o, Status: action === "Approved" ? "Paid" : "Not-paid" }
            : o
        )
      );
      setAlert({
        isOpen: true,
        title: `Payment ${action === "Approved" ? "Approved" : "Denied"}`,
        description: `Payment for order ${
          selectedOrder.Order_id
        } has been ${action.toLowerCase()}.`,
        type: action === "Approved" ? "success" : "warning",
      });
    } else {
      setAlert({
        isOpen: true,
        title: `Payment ${
          action === "Approved" ? "Approval" : "Denial"
        } Failed`,
        description: String(err),
        type: "danger",
      });
    }

    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  const handleDelivery = async ({
    order_id,
    tracking_number,
  }: HandleDeliverParams): Promise<void> => {
    const { err, data } = await SetOrderShippingData(order_id, tracking_number);
    if (err) {
      setAlert({
        isOpen: true,
        title: "Shipping Update Failed",
        description: String(err),
        type: "danger",
      });
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.Order_id === order_id ? { ...o, shipping_status: "Shipped" } : o
        )
      );
      setAlert({
        isOpen: true,
        title: "Shipping Info Updated",
        description: `Order shipped with ${tracking_number}.`,
        type: "success",
      });
    }
    setShowShippingModal(false);
    setSelectedOrder(null);
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

      <div className="flex flex-wrap justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            Orders ({filteredOrders.length})
          </h1>
          <p className="text-lg text-[#666666] dark:text-[#CCCCCC]">
            Manage your orders and shipping details.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by customer..."
          className="border border-[#A3A3A3] dark:border-white/20 bg-white dark:bg-white/10 rounded-lg px-3 py-2 text-sm text-[#333] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-[#2C2C2C]/20 rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F4F4] dark:bg-[#2C2C2C]/50 text-[#333] dark:text-white">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={areAllOnPageSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              {[
                "Customer",
                "Phone",
                "Email",
                "City",
                "Address",
                "Total",
                "Shipping",
                "Status",
                "",
              ].map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left font-medium whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.Order_id}
                className={`border-t transition-colors ${
                  isSelected(order.Order_id)
                    ? "bg-blue-50 dark:bg-[#2B3C55]"
                    : "hover:bg-gray-50 dark:hover:bg-[#1F2937]"
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={isSelected(order.Order_id)}
                    onChange={() => toggleSelect(order.Order_id)}
                  />
                </td>
                <td className="px-4 py-3 font-bold whitespace-nowrap">
                  {order.Full_name}
                </td>
                <td className="px-4 py-3">{order.Phone}</td>
                <td className="px-4 py-3">{order.Email}</td>
                <td className="px-4 py-3">{order.City}</td>
                <td className="px-4 py-3 max-w-[200px] truncate">
                  {order.Address}
                </td>
                <td className="px-4 py-3">${order.total_price}</td>
                <td className="px-4 py-3">{order.Shipping}</td>
                <td className="px-4 py-3">
                  {order.Status === "Pending" ? (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowPaymentModal(true);
                      }}
                      className="focus:outline-none hover:opacity-80"
                    >
                      <StatusBadge status={order.Status} />
                    </button>
                  ) : order.Status === "Paid" &&
                    order.Shipping != "Pickup" &&
                    order.shipping_status == null ? (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowShippingModal(true);
                      }}
                      className="focus:outline-none hover:opacity-80"
                    >
                      <StatusBadge status={order.Status} />
                    </button>
                  ) : (
                    <StatusBadge
                      status={order.shipping_status ?? order.Status}
                    />
                  )}
                </td>

                <td className="px-4 py-3 relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === order.Order_id ? null : order.Order_id
                      )
                    }
                    className="text-xl text-[#666] dark:text-[#CCCCCC] hover:text-black dark:hover:text-white transition"
                  >
                    ⋯
                  </button>
                  <AnimatePresence>
                    {dropdownOpenId === order.Order_id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 right-0 mt-2 w-44 bg-white dark:bg-[#F4F4F4]/10 backdrop-blur-2xl border border-gray-200 dark:border-white/20 rounded-xl shadow-md p-2"
                      >
                        <button
                          onClick={() => handleAction("edit", order.Order_id)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleAction("copy-id", order.Order_id)
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() => handleAction("delete", order.Order_id)}
                          className="block w-full text-left px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-[#F4F4F4] dark:bg-[#2C2C2C] flex flex-col sm:flex-row justify-between items-center text-sm text-[#333] dark:text-white gap-2 border-t border-gray-200 dark:border-white/10">
        <p>
          {selectedOrderIds.size > 0
            ? `${selectedOrderIds.size} of ${filteredOrders.length} selected`
            : "No selection"}
        </p>
        <div className="flex items-center gap-3">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 hover:bg-white dark:hover:bg-white/10 disabled:opacity-50"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 hover:bg-white dark:hover:bg-white/10 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedOrder && (
        <PaymentApprovalModal
          onApprove={() => handlePaymentDecision("Approved")}
          onDeny={() => handlePaymentDecision("Denied")}
          onCancel={handleCancelPayment}
          customerName={selectedOrder.Full_name}
          amount={selectedOrder.total_price}
          phone={selectedOrder.Phone}
        />
      )}
      {showShippingModal && selectedOrder && (
        <ShippingInfoModel
          orderId={selectedOrder.Order_id}
          onClose={() => {
            setShowShippingModal(false);
            setSelectedOrder(null);
          }}
          onSave={(trackingNumber, orderId) =>
            handleDelivery({
              order_id: orderId,
              tracking_number: trackingNumber,
            })
          }
        />
      )}
    </div>
  );
};

export default OrdersTable;
