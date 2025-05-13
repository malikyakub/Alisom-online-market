import React, { useState } from "react";

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

const initialCustomers: Customer[] = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  fullName: `Customer ${i + 1}`,
  phone: `+1 (555) 010-${1000 + i}`,
  email: `customer${i + 1}@example.com`,
  address: `123${i} Main St, City ${i + 1}`,
  repeat: i % 2 === 0 ? "YES" : "NO",
  highestOrder: `$${(150 + i * 5).toFixed(2)}`,
  since: `202${i % 5}-01-01`,
}));

const CustomerTable: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;
  const totalPages = Math.ceil(initialCustomers.length / rowsPerPage);

  const handleSelect = (id: number) => {
    setSelectedCustomer(id === selectedCustomer ? null : id);
  };

  const handleAction = (action: string, id: number) => {
    if (action === "delete") alert(`Delete customer ${id}`);
    if (action === "copy-id") navigator.clipboard.writeText(id.toString());
    if (action === "edit") alert(`Edit customer ${id}`);
    setDropdownOpenId(null);
  };

  const filteredCustomers = initialCustomers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-[#1A2238]">
            Customers ({filteredCustomers.length})
          </h1>
          <p className="text-lg text-[#666666]">
            Manage your customer profiles and order stats.
          </p>
        </div>
        
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-[#A3A3A3] rounded px-3 py-2 text-sm focus:outline-none focus:ring text-[#333333]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-[#F4F4F4] text-left">
            <tr>
              {[
                "Select",
                "Full Name",
                "Phone",
                "Email",
                "Address",
                "Repeat",
                "Highest Order",
                "Since",
                "",
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 whitespace-nowrap text-[#333333] text-sm"
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
                className={`border-t ${
                  selectedCustomer === customer.id ? "bg-[#E6F0FF]" : ""
                }`}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCustomer === customer.id}
                    onChange={() => handleSelect(customer.id)}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333] font-bold">
                  {customer.fullName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {customer.phone}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {customer.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {customer.address}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {customer.repeat}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {customer.highestOrder}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {customer.since}
                </td>
                <td className="px-4 py-2 relative whitespace-nowrap">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === customer.id ? null : customer.id
                      )
                    }
                    className="text-[#666666] hover:text-[#333333]"
                  >
                    &#x2026;
                  </button>
                  {dropdownOpenId === customer.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-[#A3A3A3] rounded-lg shadow-lg z-10 p-2 space-y-1">
                      <button
                        onClick={() => handleAction("edit", customer.id)}
                        className="block w-full text-left px-3 py-2 text-sm font-medium text-[#333333] rounded-md hover:bg-[#F4F4F4]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction("copy-id", customer.id)}
                        className="block w-full text-left px-3 py-2 text-sm font-medium text-[#333333] rounded-md hover:bg-[#F4F4F4]"
                      >
                        Copy ID
                      </button>
                      <button
                        onClick={() => handleAction("delete", customer.id)}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-md bg-[#DC3545] text-white hover:bg-[#C82333]"
                      >
                        Delete
                        <span className="text-xs opacity-80">⌘ ⌫</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="p-4 bg-[#F4F4F4] flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-[#333333] border-t border-[#A3A3A3] gap-2">
          <p>
            {selectedCustomer
              ? `1 of ${filteredCustomers.length} row(s) selected`
              : "No row selected"}
          </p>

          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              className="border border-[#A3A3A3] rounded px-2 py-1 text-sm focus:outline-none text-[#333333]"
              value={rowsPerPage}
              disabled
            >
              <option value={12}>20</option>
            </select>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center border border-[#A3A3A3] rounded">
              <button
                className="px-2 py-1 text-[#666666] hover:text-[#333333] disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <button
                className="px-2 py-1 text-[#666666] hover:text-[#333333] disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
