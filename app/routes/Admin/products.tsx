import React, { useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: string;
  cost: string;
  quantity: number;
  category: string;
  brand: string;
  condition: string;
  featured: string;
  date: string;
};

const initialProducts: Product[] = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: `$${(100 + i).toFixed(2)}`,
  cost: `$${(80 + i).toFixed(2)}`,
  quantity: 200 + i,
  category: i % 2 === 0 ? 'Computers' : 'Phones',
  brand: 'Apple',
  condition: 'Brand New',
  featured: i % 3 === 0 ? 'YES' : 'NO',
  date: '04/18/2025',
}));

const ProductTable: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12; 
  const totalPages = Math.ceil(initialProducts.length / rowsPerPage);

  const handleSelect = (id: number) => {
    setSelectedProduct(id === selectedProduct ? null : id);
  };

  const handleAction = (action: string, id: number) => {
    if (action === 'delete') alert(`Delete product ${id}`);
    if (action === 'copy-id') navigator.clipboard.writeText(id.toString());
    if (action === 'edit') alert(`Edit product ${id}`);
    setDropdownOpenId(null);
  };

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? product.condition === statusFilter : true;
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Products ({filteredProducts.length})</h1>
          <p className="text-gray-500 text-sm">Manage your products and track restocks here.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Brand New">Brand New</option>
            <option value="Used">Used</option>
          </select>
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Category</option>
            <option value="Computers">Computers</option>
            <option value="Phones">Phones</option>
          </select>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Columns
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Cost</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">Condition</th>
              <th className="px-4 py-2">Featured</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className={`border-t ${
                  selectedProduct === product.id ? 'bg-blue-100' : ''
                }`}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedProduct === product.id}
                    onChange={() => handleSelect(product.id)}
                  />
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2">{product.cost}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.brand}</td>
                <td className="px-4 py-2">{product.condition}</td>
                <td className="px-4 py-2">{product.featured}</td>
                <td className="px-4 py-2">{product.date}</td>
                <td className="px-4 py-2 relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === product.id ? null : product.id
                      )
                    }
                    className="text-gray-600 hover:text-black"
                  >
                    &#x2026;
                  </button>
                  {dropdownOpenId === product.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-10">
                      <button
                        onClick={() => handleAction('edit', product.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction('copy-id', product.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Copy ID
                      </button>
                      <button
                        onClick={() => handleAction('delete', product.id)}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-between items-center text-sm text-gray-700 border-t border-gray-300">
          {/* Selection Info */}
          <p>
            {selectedProduct
              ? `1 of ${filteredProducts.length} row(s) selected`
              : 'No row selected'}
          </p>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
              value={rowsPerPage}
              disabled
            >
              <option value={12}>20</option>
            </select>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <button
                className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
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

export default ProductTable;