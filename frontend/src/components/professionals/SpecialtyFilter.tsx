import { SPECIALTIES } from '../../lib/constants';
import type { Specialty } from '../../types/professional';

interface SpecialtyFilterProps {
  active: Specialty | null;
  onChange: (specialty: Specialty | null) => void;
}

export default function SpecialtyFilter({ active, onChange }: SpecialtyFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          active === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Todos
      </button>
      {SPECIALTIES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            active === value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-base">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
