import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { CommissionRecord } from '../../types';
import { 
  DollarSign, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText,
  Filter
} from 'lucide-react';

interface AdminCommissionsProps {
  navigate: (route: string) => void;
}

export const AdminCommissions: React.FC<AdminCommissionsProps> = ({ navigate }) => {
  const { commissions, updateCommissionStatus, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = commissions.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const totalCollected = commissions.reduce((sum, c) => sum + (c.status === 'paid' ? c.netCommissionDue : 0), 0);
  const totalPending = commissions.reduce((sum, c) => sum + (c.status === 'unpaid' ? c.netCommissionDue : 0), 0);
  const totalVolume = commissions.reduce((sum, c) => sum + c.transactionQuantity, 0);

  const handleExportCSV = () => {
    const headers = [
      'Deal Reference',
      'Buyer Company',
      'Seller Company',
      'Quantity (tCO2e)',
      'Unit Price (USD)',
      'Transaction Value (USD)',
      'Commission Rate (%)',
      'Fixed Fee (USD)',
      'Total Platform Fee (USD)',
      'Status'
    ];

    const rows = filtered.map(c => [
      c.dealReference,
      `"${c.buyerCompany}"`,
      `"${c.sellerCompany}"`,
      c.transactionQuantity,
      c.agreedUnitPrice,
      c.eligibleTransactionValue,
      c.commissionRate,
      c.fixedFee,
      c.netCommissionDue,
      c.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carbonbridge_commission_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported Commission Ledger CSV successfully.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            Commission Ledger & Facilitation Revenue
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Verified deal facilitation earnings, settlement statuses, and exportable financial audit logs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs font-semibold text-[#123D2A] bg-white border border-[#DDEBDD] rounded-xl hover:bg-[#DDEBDD]/50 transition-all shadow-xs flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-[#218653]" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Collected Success Fees
          </span>
          <span className="text-2xl font-extrabold text-[#218653] font-mono tabular-nums">
            ${totalCollected.toLocaleString()} USD
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">Confirmed settlement</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Pending Disbursal
          </span>
          <span className="text-2xl font-extrabold text-[#D99A32] font-mono tabular-nums">
            ${totalPending.toLocaleString()} USD
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">In escrow / completion</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Transacted Volume
          </span>
          <span className="text-2xl font-extrabold text-[#123D2A] font-mono tabular-nums">
            {totalVolume.toLocaleString()} tCO2e
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">Across facilitated deals</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs">
        {['all', 'paid', 'unpaid', 'overdue', 'waived'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
              filterStatus === st ? 'bg-[#123D2A] text-white shadow-xs' : 'text-[#69746D] bg-white border border-[#DDEBDD]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Commission Ledger Table */}
      <div className="bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDEBDD] text-[#69746D] font-mono text-[11px] uppercase bg-[#F7F8F4]">
                <th className="py-3 px-4">Deal Reference</th>
                <th className="py-3 px-4">Counterparties</th>
                <th className="py-3 px-4 text-right">Volume</th>
                <th className="py-3 px-4 text-right">Agreed Price</th>
                <th className="py-3 px-4 text-right">Deal Value</th>
                <th className="py-3 px-4 text-right">Commission Terms</th>
                <th className="py-3 px-4 text-right">Net Fee Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDEBDD]/60">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-[#F7F8F4]/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#218653] whitespace-nowrap">
                    {c.dealReference}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate">
                    <div className="font-bold text-[#123D2A]">{c.buyerCompany}</div>
                    <div className="text-[11px] text-[#69746D]">Seller: {c.sellerCompany}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-[#123D2A] tabular-nums whitespace-nowrap">
                    {c.transactionQuantity.toLocaleString()} {c.quantityUnit}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-[#202923] tabular-nums whitespace-nowrap">
                    ${c.agreedUnitPrice.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#123D2A] tabular-nums whitespace-nowrap">
                    ${c.eligibleTransactionValue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#69746D] whitespace-nowrap">
                    {c.commissionRate}% {c.fixedFee ? `+ $${c.fixedFee}` : ''}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#218653] tabular-nums whitespace-nowrap">
                    ${c.netCommissionDue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'paid'
                        ? 'bg-[#DDEBDD] text-[#218653]'
                        : c.status === 'unpaid'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-neutral-100 text-[#69746D]'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => updateCommissionStatus(c.id, c.status === 'paid' ? 'unpaid' : 'paid')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                        c.status === 'paid'
                          ? 'border-[#DDEBDD] text-[#69746D] hover:bg-neutral-50'
                          : 'bg-[#218653] text-white hover:bg-[#1B4D36]'
                      }`}
                    >
                      {c.status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                    </button>
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
