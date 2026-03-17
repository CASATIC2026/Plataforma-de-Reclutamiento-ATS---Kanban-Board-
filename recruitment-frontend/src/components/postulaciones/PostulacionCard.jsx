import Button from '../common/Button';

export default function PostulacionCard({ postulacion, onDelete }) {
  const fecha = new Date(postulacion.createdAt).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      {/* Candidate name + date */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-800">{postulacion.nombreCandidato}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{fecha}</p>
        </div>

        {postulacion.cvFileName && (
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full whitespace-nowrap">
            CV adjunto
          </span>
        )}
      </div>

      {/* Contact info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>{postulacion.email}</p>
        {postulacion.telefono && <p>{postulacion.telefono}</p>}
      </div>

      {/* Vacante */}
      <p className="text-xs text-gray-400">
        Vacante:{' '}
        <span className="font-medium text-gray-600">{postulacion.vacanteTitulo}</span>
      </p>

      {/* Actions */}
      <div className="pt-3 border-t border-gray-100">
        <Button variant="danger" onClick={() => onDelete(postulacion.id)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
