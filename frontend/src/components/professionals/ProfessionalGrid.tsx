import type { Professional } from '../../types/professional';
import ProfessionalCard from './ProfessionalCard';

interface ProfessionalGridProps {
  professionals: Professional[];
}

export default function ProfessionalGrid({ professionals }: ProfessionalGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {professionals.map((pro) => (
        <ProfessionalCard key={pro.documentId} professional={pro} />
      ))}
    </div>
  );
}
