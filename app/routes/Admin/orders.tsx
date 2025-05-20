import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PaymentApprovalModal from "components/PaymentApprovalModal";
import useOrders from "hooks/useOrders";
import useSendEmail from "hooks/useSendEmail";
import type { EmailMessage } from "hooks/useSendEmail";

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
  const { AllOrders, updateOrderStatus } = useOrders();
  const { isLoading, sendBatchEmails } = useSendEmail();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const rowsPerPage = 12;

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, err } = await AllOrders();
      if (err) {
        console.error("Error fetching orders:", err);
        return;
      }

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

  const handleAction = (action: string, id: string) => {
    const order = orders.find((o) => o.Order_id === id);
    switch (action) {
      case "delete":
        setOrders((prev) => prev.filter((order) => order.Order_id !== id));
        break;
      case "copy-id":
        navigator.clipboard.writeText(id);
        break;
      case "edit":
        alert(`Edit order ${id}`);
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
      await updateOrderStatus(selectedOrder.Order_id, "Approved");
      setOrders((prev) =>
        prev.map((o) =>
          o.Order_id === selectedOrder.Order_id ? { ...o, Status: "Paid" } : o
        )
      );
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

      {/* Table rendering logic remains unchanged */}
      {/* ... */}

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
