import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ 
  title, 
  columns = [], 
  data = [], 
  onAdd, 
  isLoading = false,
  pagination = null // { currentPage, totalPages, totalCount, onPageChange, pageSize, onPageSizeChange }
}) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add New
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : safeData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 font-medium">
                  No records found
                </td>
              </tr>
            ) : (
              safeData.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row, i) : (row[col.accessor] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{data.length}</span> of <span className="font-semibold text-gray-900">{pagination.totalCount}</span> entries
            </p>
            {pagination.onPageSizeChange && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Rows:</label>
                <select 
                  className="text-sm border rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-blue-500"
                  value={pagination.pageSize || 10}
                  onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || isLoading}
              className="p-2 border rounded-lg hover:bg-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  if (pagination.currentPage <= 3) pageNum = i + 1;
                  else if (pagination.currentPage >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                  else pageNum = pagination.currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => pagination.onPageChange(pageNum)}
                    className={`min-w-[36px] h-9 rounded-lg font-medium text-sm transition-all ${
                      pagination.currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'hover:bg-white border hover:border-blue-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages || isLoading}
              className="p-2 border rounded-lg hover:bg-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
