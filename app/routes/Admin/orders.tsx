import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Order = {
  id: number;
  productName: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  total: string;
  shipping: string;
};

const initialOrders: Order[] = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  productName: `Product ${i + 1}`,
  customer: `Customer ${i + 1}`,
  phone: `+1 (555) 010-${1000 + i}`,
  email: `customer${i + 1}@example.com`,
  address: `123${i} Main St, City ${i + 1}`,
  total: `$${(100 + i * 10).toFixed(2)}`,
  shipping: i % 2 === 0 ? "Free" : "$5.00",
}));

const OrdersTable: React.FC = () => {
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<number>>(new Set());
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 12;
  const totalPages = Math.ceil(initialOrders.length / rowsPerPage);

  const filteredOrders = initialOrders.filter((order) =>
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAction = (action: string, id: number) => {
    if (action === "delete") alert(`Delete order ${id}`);
    if (action === "copy-id") navigator.clipboard.writeText(id.toString());
    if (action === "edit") alert(`Edit order ${id}`);
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

  const selectAllOnPage = () => {
    const newSet = new Set(selectedOrderIds);
    paginatedOrders.forEach((o) => newSet.add(o.id));
    setSelectedOrderIds(newSet);
  };

  const deselectAllOnPage = () => {
    setSelectedOrderIds((prev) => {
      const newSet = new Set(prev);
      paginatedOrders.forEach((o) => newSet.delete(o.id));
      return newSet;
    });
  };

  const areAllOnPageSelected = paginatedOrders.every((o) =>
    selectedOrderIds.has(o.id)
  );

  const toggleSelectAll = () => {
    areAllOnPageSelected ? deselectAllOnPage() : selectAllOnPage();
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

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F4F4] text-[#333] py-2">
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
                "Email",
                "Address",
                "Total",
                "Shipping",
                "",
              ].map((header, idx) => (
                <th
                  key={idx}
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
                className={`border-t transition ${
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
                <td className="px-4 py-3 font-bold text-[#333] whitespace-nowrap">
                  {order.productName}
                </td>
                <td className="px-4 py-3 text-[#333] whitespace-nowrap">
                  {order.customer}
                </td>
                <td className="px-4 py-3 text-[#333] whitespace-nowrap">
                  {order.phone}
                </td>
                <td className="px-4 py-3 text-[#333] whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                  {order.email}
                </td>
                <td className="px-4 py-3 text-[#333] whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                  {order.address}
                </td>
                <td className="px-4 py-3 text-[#333] whitespace-nowrap">
                  {order.total}
                </td>
                <td className="px-4 py-3 text-[#333] whitespace-nowrap">
                  {order.shipping}
                </td>
                <td className="px-4 py-3 relative whitespace-nowrap">
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
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction("copy-id", order.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
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
    </div>
  );
};

export default OrdersTable;
