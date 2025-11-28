import React, { useState, useEffect } from 'react';

/**
 *  DataTable 
 * 
 * @param {Object} props
 * @param {Array} props.columns 
 * @param {Array} props.data 
 * @param {Function} props.actions 
 * @param {string} props.height 
 * @param {boolean} props.isLoading 
 */
export default function PaginatedDataTable({ 
  columns, 
  data, 
  actions,
  height = "400px",
  isLoading = false
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Filter data when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }
    
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    const results = data.filter(item => {
      // Search in all fields for the search term
      return Object.keys(item).some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowercasedSearchTerm);
      });
    });
    
    setFilteredData(results);
    setCurrentPage(1); // Reset to first page after search
  }, [searchTerm, data]);

  // Reset pagination when data changes
  useEffect(() => {
    setFilteredData(data);
    setCurrentPage(1);
  }, [data]);

  // Handle page navigation
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      {/* Search and Pagination Controls */}
      <div className="bg-gray-50 p-3 border-b border-gray-200 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md pl-9 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} items
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
            className="px-2 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      
      {/* Table Container */}
      <div className={`overflow-y-auto`} style={{ height: height }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              currentItems.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md text-sm font-medium 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Previous
        </button>
        
        <div className="flex space-x-1">
          {/* Show only some of page numbers when there are many pages */}
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={i}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded-md text-sm font-medium
                          ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {/* If not showing all pages, display last page  */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 py-1 text-gray-500">...</span>
              <button
                onClick={() => goToPage(totalPages)}
                className={`px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 rounded-md text-sm font-medium 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}