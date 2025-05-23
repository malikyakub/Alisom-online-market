import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCustomerInsights from "hooks/useCustomerInsights";

type Customer = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  repeat: string;
  highestOrder: string;
  since: string;
};

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<number>>(
    new Set()
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { getCustomerInsights, isLoading } = useCustomerInsights();
  const rowsPerPage = 12;

  useEffect(() => {
    getCustomerInsights().then(({ data, err }) => {
      if (data) {
        const formatted = data.map((c, i) => ({
          id: i + 1,
          fullName: c.fullname,
          phone: c.phone,
          email: c.email,
          address: c.address || "N/A",
          repeat: c.is_repeat ? "YES" : "NO",
          highestOrder: `$${c.highest_order.toFixed(2)}`,
          since: c.since.split("T")[0],
        }));
        setCustomers(formatted);
      }
    });
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAction = (action: string, id: number) => {
    if (action === "delete") alert(`Delete customer ${id}`);
    if (action === "copy-id") navigator.clipboard.writeText(id.toString());
    if (action === "edit") alert(`Edit customer ${id}`);
    setDropdownOpenId(null);
  };

  const isSelected = (id: number) => selectedCustomerIds.has(id);

  const toggleSelect = (id: number) => {
    setSelectedCustomerIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const selectAllOnPage = () => {
    const newSet = new Set(selectedCustomerIds);
    paginatedCustomers.forEach((c) => newSet.add(c.id));
    setSelectedCustomerIds(newSet);
  };

  const deselectAllOnPage = () => {
    setSelectedCustomerIds((prev) => {
      const newSet = new Set(prev);
      paginatedCustomers.forEach((c) => newSet.delete(c.id));
      return newSet;
    });
  };

  const areAllOnPageSelected = paginatedCustomers.every((c) =>
    selectedCustomerIds.has(c.id)
  );

  const toggleSelectAll = () => {
    areAllOnPageSelected ? deselectAllOnPage() : selectAllOnPage();
  };

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  return (
    <div className="text-[#1A2238] dark:text-[#F4F4F4] min-h-screen">
      <div className="flex flex-wrap justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            Customers ({filteredCustomers.length})
          </h1>
          <p className="text-lg text-[#666666] dark:text-[#CCCCCC]">
            Manage your customer profiles and order stats.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-[#A3A3A3] dark:border-white/20 bg-white dark:bg-white/10 rounded-lg px-3 py-2 text-sm text-[#333] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-[#2C2C2C]/20 rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F4F4] dark:bg-[#2C2C2C]/50 text-[#333] dark:text-white py-2">
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
                "Full Name",
                "Phone",
                "Email",
                "Address",
                "Repeat",
                "Highest Order",
                "Since",
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
            {paginatedCustomers.map((customer) => (
              <tr
                key={customer.id}
                className={`border-t transition-colors ${
                  isSelected(customer.id)
                    ? "bg-blue-50 dark:bg-[#2B3C55]"
                    : "hover:bg-gray-50 dark:hover:bg-[#1F2937]"
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={isSelected(customer.id)}
                    onChange={() => toggleSelect(customer.id)}
                  />
                </td>
                <td className="px-4 py-3 font-bold text-[#333] dark:text-white whitespace-nowrap">
                  {customer.fullName}
                </td>
                <td className="px-4 py-3 text-[#333] dark:text-white whitespace-nowrap">
                  {customer.phone}
                </td>
                <td className="px-4 py-3 text-[#333] dark:text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                  {customer.email}
                </td>
                <td className="px-4 py-3 text-[#333] dark:text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                  {customer.address}
                </td>
                <td className="px-4 py-3 text-[#333] dark:text-white whitespace-nowrap">
                  {customer.repeat}
                </td>
                <td className="px-4 py-3 text-[#333] dark:text-white whitespace-nowrap">
                  {customer.highestOrder}
                </td>
                <td className="px-4 py-3 text-[#333] dark:text-white whitespace-nowrap">
                  {customer.since}
                </td>
                <td className="px-4 py-3 relative whitespace-nowrap">
                  <button
                    onClick={() => console.log("You can't change this")}
                    className="text-xl text-[#666] dark:text-[#CCCCCC] hover:text-black dark:hover:text-white transition"
                  >
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-[#F4F4F4] dark:bg-[#2C2C2C] flex flex-col sm:flex-row justify-between items-center text-sm text-[#333] dark:text-white gap-2 border-t border-gray-200 dark:border-white/10">
        <p>
          {selectedCustomerIds.size > 0
            ? `${selectedCustomerIds.size} of ${filteredCustomers.length} selected`
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
    </div>
  );
};

export default CustomerTable;
