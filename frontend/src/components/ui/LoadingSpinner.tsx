interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = 'Cargando...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12" role="status">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="mt-4 text-gray-500 text-sm">{text}</p>
    </div>
  );
}
