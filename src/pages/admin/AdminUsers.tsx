import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { UserProfile, UserRole } from '../../types';
import { Users, ShieldCheck, Building2, Layers, Search, CheckCircle2, Ban } from 'lucide-react';

interface AdminUsersProps {
  navigate: (route: string) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ navigate }) => {
  const { users, updateUserProfile, showToast } = useApp();
  const [filterRole, setFilterRole] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!u.fullName.toLowerCase().includes(q) && !u.companyName.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleToggleStatus = (user: UserProfile) => {
    const nextStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
    updateUserProfile(user.id, { accountStatus: nextStatus });
    showToast(`User ${user.fullName} status set to ${nextStatus.toUpperCase()}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            Participant Account Management
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Audit registered corporate buyer organizations, environmental project originators, and channel brokers.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {['all', 'buyer', 'seller', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                filterRole === r ? 'bg-[#123D2A] text-white shadow-xs' : 'text-[#69746D] bg-white border border-[#DDEBDD]'
              }`}
            >
              {r === 'all' ? 'All Roles' : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#DDEBDD] bg-[#F7F8F4] flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[#DDEBDD] rounded-lg bg-white sm:w-80 focus:outline-none"
          />
          <span className="text-xs text-[#69746D] font-mono">
            Showing {filtered.length} users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDEBDD] text-[#69746D] font-mono text-[11px] uppercase bg-white">
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Entity & Title</th>
                <th className="py-3 px-4">Country & Email</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDEBDD]/60">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-[#F7F8F4]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#123D2A]">{u.fullName}</div>
                    <span className="text-[10px] uppercase font-mono font-bold text-[#218653]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#202923]">
                    <div className="font-semibold">{u.companyName}</div>
                    <div className="text-[11px] text-[#69746D]">{u.jobTitle || u.companyType || 'Authorized Representative'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#69746D]">
                    <div>{u.country}</div>
                    <div className="font-mono text-[11px]">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#69746D] whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      u.accountStatus === 'active' ? 'bg-[#DDEBDD] text-[#218653]' : 'bg-red-50 text-[#C94C4C]'
                    }`}>
                      {u.accountStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                          u.accountStatus === 'active'
                            ? 'border-red-200 text-[#C94C4C] hover:bg-red-50'
                            : 'border-[#218653] text-[#218653] hover:bg-emerald-50'
                        }`}
                      >
                        {u.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
