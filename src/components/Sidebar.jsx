import React from 'react';

const menuItems = [
  { label: 'Dashboard', active: true },
  { label: 'Respiratory Data', active: false },
  { label: 'AI Risk Analysis', active: false },
  { label: 'Reports', active: false },
  { label: 'Doctor Insights', active: false },
  { label: 'Settings', active: false },
  { label: 'Logout', active: false }
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">RespiraGuard</h1>
          <p className="mt-1 text-xs font-medium text-slate-500">AI Respiratory Platform</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                item.active
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={onClose}
            aria-label="Close sidebar"
          />

          <aside className="relative h-full w-64 border-r border-slate-200 bg-white px-5 py-6 shadow-xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">RespiraGuard</h1>
                <p className="mt-1 text-xs font-medium text-slate-500">AI Respiratory Platform</p>
              </div>
              <button
                type="button"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                onClick={onClose}
                aria-label="Close navigation"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path d="M6 6L18 18M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                    item.active
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
