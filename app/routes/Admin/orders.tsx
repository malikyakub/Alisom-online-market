import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PaymentApprovalModal from "components/PaymentApprovalModal";

const OrdersTable: React.FC = () => {
  type Order = {
    id: number;
    productName: string;
    customer: string;
    phone: string;
    address: string;
    total: string;
    method: "Pickup" | "Delivery";
    status: "Paid" | "Pending" | "No-paid";
  };

  const statuses: Order["status"][] = ["Paid", "Pending", "No-paid"];
  const initialOrders: Order[] = Array.from({ length: 14 }).map((_, i) => ({
    id: i + 1,
    productName: `Product ${i + 1}`,
    customer: `Customer ${i + 1}`,
    phone: `+1 (555) 010-${1000 + i}`,
    address: `123${i} Main St, City ${i + 1}`,
    total: `$${(100 + i * 10).toFixed(2)}`,
    method: i % 2 === 0 ? "Pickup" : "Delivery",
    status: statuses[i % 3],
  }));

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<number>>(
    new Set()
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const rowsPerPage = 12;
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const filteredOrders = orders.filter((order) =>
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAction = (action: string, id: number) => {
    if (action === "delete") {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    }
    if (action === "copy-id") navigator.clipboard.writeText(id.toString());
    if (action === "edit") alert(`Edit order ${id}`);
    if (action === "approve-payment") {
      const order = orders.find((o) => o.id === id);
      if (order?.status === "Pending") {
        setSelectedOrder(order);
        setShowPaymentModal(true);
      }
    }
    setDropdownOpenId(null);
  };

  const isSelected = (id: number) => selectedOrderIds.has(id);
  const toggleSelect = (id: number) => {
    setSelectedOrderIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const areAllOnPageSelected = paginatedOrders.every((o) =>
    selectedOrderIds.has(o.id)
  );

  const toggleSelectAll = () =>
    areAllOnPageSelected
      ? setSelectedOrderIds((prev) => {
          const newSet = new Set(prev);
          paginatedOrders.forEach((o) => newSet.delete(o.id));
          return newSet;
        })
      : setSelectedOrderIds((prev) => {
          const newSet = new Set(prev);
          paginatedOrders.forEach((o) => newSet.add(o.id));
          return newSet;
        });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "No-paid":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div>
      {/* Header */}
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

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F4F4] text-[#333]">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={areAllOnPageSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              {[
                "Product Name",
                "Customer",
                "Phone",
                "Address",
                "Total",
                "Method",
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
                key={order.id}
                className={`border-t ${
                  isSelected(order.id) ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={isSelected(order.id)}
                    onChange={() => toggleSelect(order.id)}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-bold">
                  {order.productName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {order.customer}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{order.phone}</td>
                <td className="px-4 py-3 whitespace-nowrap max-w-[200px] truncate">
                  {order.address}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{order.total}</td>
                <td className="px-4 py-3 whitespace-nowrap">{order.method}</td>
                <td className="px-4 py-3">
                  {order.status === "Pending" ? (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowPaymentModal(true);
                      }}
                      className={`inline-block px-3 py-2 rounded w-[80px] text-xs font-semibold text-center cursor-pointer hover:opacity-80 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </button>
                  ) : (
                    <span
                      className={`inline-block px-3 py-2 rounded w-[80px] text-xs font-semibold text-center ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === order.id ? null : order.id
                      )
                    }
                    className="text-xl text-[#666] hover:text-black transition"
                  >
                    ⋯
                  </button>
                  <AnimatePresence>
                    {dropdownOpenId === order.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-md p-2"
                      >
                        <button
                          onClick={() => handleAction("edit", order.id)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction("copy-id", order.id)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() => handleAction("delete", order.id)}
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

      {/* Footer */}
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
          onApprove={() => {
            alert("Payment approved!");
            setShowPaymentModal(false);
            setSelectedOrder(null);
          }}
          onCancel={() => {
            setShowPaymentModal(false);
            setSelectedOrder(null);
          }}
          customerName={selectedOrder.customer}
          amount={selectedOrder.total}
          phone={selectedOrder.phone}
        />
      )}
    </div>
  );
};

export default OrdersTable;
