import React from "react";

export default function RobotsPagination({
  startIndex,
  endIndex,
  totalItems,
  pageSize,
  setPageSize,
  safeCurrentPage,
  totalPages,
  getPageNumbers,
  setCurrentPage,
}) {
  return (
    <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
      <div className="flex items-center gap-4">
        <span>
          Showing{" "}
          <strong className="text-slate-800 dark:text-slate-200">
            {totalItems > 0 ? startIndex + 1 : 0}
          </strong>{" "}
          to{" "}
          <strong className="text-slate-800 dark:text-slate-200">
            {endIndex}
          </strong>{" "}
          of{" "}
          <strong className="text-slate-800 dark:text-slate-200">
            {totalItems}
          </strong>{" "}
          AGVs
        </span>

        {/* Rows per page selector */}
        <div className="flex items-center gap-1.5">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={safeCurrentPage === 1}
          className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                safeCurrentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={safeCurrentPage === totalPages}
          className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
}
