import React from "react";

export default function UsersView() {
  const users = [
    {
      name: "Shubham",
      role: "Fleet Lead Operator",
      badge: "Superuser",
      email: "shubham@rfms.io",
    },
    {
      name: "B. John",
      role: "Senior Maintenance Engineer",
      badge: "Mechanic",
      email: "john@rfms.io",
    },
    {
      name: "A. Carl",
      role: "Floor Safety Auditor",
      badge: "Safety",
      email: "carl@rfms.io",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-5">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Users
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {users.map((u, i) => (
          <div
            key={i}
            className="p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {u.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {u.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {u.email} • {u.role}
                </div>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              {u.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
