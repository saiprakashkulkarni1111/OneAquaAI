import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Bell, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Filter,
  ExternalLink,
  Info
} from 'lucide-react';
import { WaterAlert } from '../types';

interface AlertsViewProps {
  alerts: WaterAlert[];
  onSelectEcosystemByName: (name: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onSelectEcosystemByName
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [verifiedList, setVerifiedList] = useState<Record<string, number>>({});

  const handleVerify = (id: string, currentCount: number) => {
    setVerifiedList(prev => ({
      ...prev,
      [id]: (prev[id] || currentCount) + 1
    }));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Urgent Investigation':
        return {
          badge: 'bg-rose-50 text-rose-800 border-rose-300',
          border: 'border-rose-300',
          indicator: 'bg-rose-600'
        };
      case 'Warning':
        return {
          badge: 'bg-amber-50 text-amber-900 border-amber-300',
          border: 'border-amber-300',
          indicator: 'bg-amber-600'
        };
      default:
        return {
          badge: 'bg-teal-50 text-teal-900 border-teal-300',
          border: 'border-teal-300',
          indicator: 'bg-teal-600'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#FAF7F2] border border-[#DFD7C7] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                Early Warning System
              </span>
              <span className="text-xs text-stone-500 font-mono">IEEE OneAquaHealth Surveillance Protocol</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Active Urban Catchment Alerts</h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
              Consolidated advisories triggered by citizen threshold aggregation, sudden foam or scum accumulation, or vector habitat anomalies.
            </p>
          </div>

          <div className="flex items-center bg-[#EFEAE0] p-1.5 rounded-xl border border-[#D8D0C0] text-xs">
            <span className="text-stone-600 mr-2 ml-1 font-medium">Filter:</span>
            {['all', 'Urgent Investigation', 'Warning', 'Advisory'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg font-medium transition capitalize cursor-pointer ${
                  filterSeverity === sev ? 'bg-teal-700 text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {sev === 'all' ? 'All Alerts' : sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory Cards List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);
          const currentVerified = verifiedList[alert.id] || alert.verifiedByCitizens;

          return (
            <div
              key={alert.id}
              className={`bg-[#FAF7F2] border ${style.border} rounded-2xl p-6 shadow-xs relative overflow-hidden transition`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3 max-w-3xl">
                  <div className={`p-2.5 rounded-xl ${style.badge} shrink-0 mt-0.5`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${style.badge}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-mono text-stone-500">
                        ID: {alert.id} • Issued: {alert.issuedAt}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 mt-1">{alert.title}</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {alert.details}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleVerify(alert.id, alert.verifiedByCitizens)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EFEAE0] hover:bg-[#E5DFD3] text-xs font-semibold text-emerald-800 border border-[#D5CDBC] transition cursor-pointer shadow-xs"
                  title="Confirm as an on-the-ground citizen observer"
                >
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Verify Indicator ({currentVerified})</span>
                </button>
              </div>

              {/* Triggers & Recommended Precautions */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F4EFE6] p-4 rounded-xl border border-[#DED6C7]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-600 block mb-1.5 font-semibold">
                    Field Indicators Triggering Advisory:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {alert.indicatorTriggers.map((trig, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-800 border border-[#DED6C7]"
                      >
                        {trig}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-600 block mb-1.5 font-semibold">
                    Recommended Community Precautions:
                  </span>
                  <ul className="text-xs text-stone-700 space-y-1">
                    {alert.recommendedPrecautions.map((prec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-teal-700 font-bold">•</span>
                        <span>{prec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Footer with Catchment reference */}
              <div className="mt-4 pt-3 border-t border-[#E3DCCF] flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  Target Waterbody: <strong className="text-stone-800 font-semibold">{alert.ecosystemName}</strong>
                </span>

                <button
                  onClick={() => onSelectEcosystemByName(alert.ecosystemName)}
                  className="text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>Locate Catchment Basin</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
