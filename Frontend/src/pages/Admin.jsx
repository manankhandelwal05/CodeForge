import React from 'react';
import { Plus, Edit, Trash2, Home, Video, FileText, ShieldAlert, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Admin() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      gradient: 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/10 hover:border-emerald-500/30',
      btnStyle: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      gradient: 'from-amber-500 to-orange-600 text-amber-400 border-amber-500/10 hover:border-amber-500/30',
      btnStyle: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      gradient: 'from-rose-500 to-red-600 text-rose-400 border-rose-500/10 hover:border-rose-500/30',
      btnStyle: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Solutions',
      description: 'Upload, manage, and delete solution videos',
      icon: Video,
      gradient: 'from-blue-500 to-indigo-600 text-blue-400 border-blue-500/10 hover:border-blue-500/30',
      btnStyle: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20',
      route: '/admin/video'
    },
    {
      id: 'editorial',
      title: 'Manage Editorials',
      description: 'Draft written explanations and editorials',
      icon: FileText,
      gradient: 'from-violet-500 to-fuchsia-600 text-violet-400 border-violet-500/10 hover:border-violet-500/30',
      btnStyle: 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border-violet-500/20',
      route: '/admin/editorial'
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))] text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center shadow-lg shadow-zinc-500/10 flex-shrink-0">
              <ShieldAlert size={24} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Admin Control Room
              </h1>
              <p className="text-zinc-400 text-sm mt-1 font-normal leading-relaxed">
                Manage problems, media attachments, solution videos, and editorials.
              </p>
            </div>
          </div>
          
          <NavLink
            to="/"
            className="flex items-center justify-center gap-2 py-3.5 px-6 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white hover:text-white rounded-xl text-sm font-semibold active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/25 flex-shrink-0 cursor-pointer"
          >
            <Home size={16} />
            Return to Dashboard
          </NavLink>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] rounded-3xl hover:border-zinc-500 p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  {/* Icon with beautiful gradient background */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${option.gradient} flex items-center justify-center shadow-md mb-5`}>
                    <IconComponent size={22} className="text-white" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold tracking-tight text-white mb-2">
                    {option.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
                    {option.description}
                  </p>
                </div>
                
                {/* Action button */}
                <NavLink 
                  to={option.route}
                  className={`w-full py-3.5 px-4 ${option.btnStyle} border rounded-xl font-semibold text-xs tracking-wide uppercase transition duration-150 flex items-center justify-center gap-1.5 active:scale-[0.99] cursor-pointer`}
                >
                  Manage {option.title.split(' ')[0]}
                  <ArrowRight size={14} />
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;