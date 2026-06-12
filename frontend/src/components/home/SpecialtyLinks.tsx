import { Link } from 'react-router-dom';
import { SPECIALTIES } from '../../lib/constants';

export default function SpecialtyLinks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
        ¿Qué necesitás?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {SPECIALTIES.map(({ value, label, icon }) => (
          <Link
            key={value}
            to={`/profesionales?especialidad=${value}`}
            className="flex flex-col items-center gap-2 p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <span className="text-3xl" role="img" aria-label={label}>
              {icon}
            </span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
