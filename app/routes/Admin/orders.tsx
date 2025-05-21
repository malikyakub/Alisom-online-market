import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PaymentApprovalModal from "components/PaymentApprovalModal";
import useOrders from "hooks/useOrders";
import Alert from "components/Alert";

type OrderStatus = "Paid" | "Pending" | "Not-paid";

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
};

const OrdersTable: React.FC = () => {
  const { AllOrders, approveOrderAndReduceStock, deleteOrderAndRestockItems } =
    useOrders();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
        setAlert({
          isOpen: true,
          title: "Edit Action",
          description: `Edit order ${id} - (not implemented).`,
          type: "warning",
        });
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

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case "Paid":
        return "bg-[#28A745]/40 text-[#28A745]";
      case "Pending":
        return "bg-[#FFC107]/40 text-[#FFC107]";
      case "Not-paid":
      default:
        return "bg-[#DC3545]/40 text-[#DC3545]";
    }
  };

  const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => (
    <span
      className={`inline-flex items-center justify-center px-3 py-2 rounded text-xs font-semibold whitespace-nowrap ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );

  const handleApprovePayment = async () => {
    if (selectedOrder) {
      const { data, err } = await approveOrderAndReduceStock(
        selectedOrder.Order_id
      );

      if (!err) {
        setOrders((prev) =>
          prev.map((o) =>
            o.Order_id === selectedOrder.Order_id ? { ...o, Status: "Paid" } : o
          )
        );
        setAlert({
          isOpen: true,
          title: "Payment Approved",
          description: `Payment for order ${selectedOrder.Order_id} has been approved.`,
          type: "success",
        });
      } else {
        setAlert({
          isOpen: true,
          title: "Approval Failed",
          description: String(err),
          type: "danger",
        });
      }
    }

    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  return (
    <div>
      <Alert
        isOpen={alert.isOpen}
        title={alert.title}
        description={alert.description}
        type={alert.type}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />

      <div className="flex flex-wrap justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-[#1A2238]">
            Orders ({filteredOrders.length})
          </h1>
          <p className="text-lg text-[#666666]">
            Manage your orders and shipping details.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by customer..."
          className="border border-[#A3A3A3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F4F4] text-[#333]">
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
                className={`border-t ${
                  isSelected(order.Order_id) ? "bg-blue-50" : "hover:bg-gray-50"
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
                <td className="px-4 py-3 font-bold">{order.Full_name}</td>
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
                  ) : (
                    <StatusBadge status={order.Status} />
                  )}
                </td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === order.Order_id ? null : order.Order_id
                      )
                    }
                    className="text-xl text-[#666] hover:text-black transition"
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
                        className="absolute z-20 right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md p-2"
                      >
                        <button
                          onClick={() => handleAction("edit", order.Order_id)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleAction("copy-id", order.Order_id)
                          }
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
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

      <div className="p-4 bg-[#F4F4F4] flex flex-col sm:flex-row justify-between items-center text-sm text-[#333] gap-2 border-t">
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
              className="px-3 py-1 hover:bg-white disabled:opacity-50"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 hover:bg-white disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedOrder && (
        <PaymentApprovalModal
          onApprove={handleApprovePayment}
          onCancel={handleCancelPayment}
          customerName={selectedOrder.Full_name}
          amount={selectedOrder.total_price}
          phone={selectedOrder.Phone}
        />
      )}
    </div>
  );
};

export default OrdersTable;
