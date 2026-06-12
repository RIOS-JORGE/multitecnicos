export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Directorio Profesional — Todos los derechos reservados
        </p>
        <p>
          Conectamos profesionales con clientes de forma rápida y sencilla.
        </p>
      </div>
    </footer>
  );
}
