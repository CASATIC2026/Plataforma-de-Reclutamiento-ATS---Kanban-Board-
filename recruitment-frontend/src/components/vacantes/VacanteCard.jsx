import Button from '../common/Button';

export default function VacanteCard({ vacante, onDelete, showActions = false }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-gray-800">{vacante.titulo}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
            vacante.estaActiva
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {vacante.estaActiva ? 'Activa' : 'Cerrada'}
        </span>
      </div>

      {/* Info */}
      <p className="text-gray-500 text-sm mb-1">{vacante.ubicacion} · {vacante.tipoContrato}</p>

      {vacante.salarioMin && vacante.salarioMax && (
        <p className="text-indigo-600 font-semibold text-sm mb-3">
          ${vacante.salarioMin.toLocaleString()} - ${vacante.salarioMax.toLocaleString()}
        </p>
      )}

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{vacante.descripcion}</p>

      {/* Tags */}
      {vacante.requisitos.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {vacante.requisitos.map((req, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              {req}
            </span>
          ))}
        </div>
      )}

      {/* Spacer to push actions to bottom */}
      <div className="mt-auto">
        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Button variant="danger" onClick={() => onDelete(vacante.id)}>
              Eliminar
            </Button>
          </div>
        )}

        {!showActions && (
          <div className="pt-4 border-t border-gray-100">
            <Button>Postularme</Button>
          </div>
        )}
      </div>
    </div>
  );
}