import VacanteCard from './VacanteCard';

export default function VacanteList({ vacantes, onDelete, onApply, showActions = false }) {
  if (vacantes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No hay vacantes disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vacantes.map((vacante) => (
        <VacanteCard
          key={vacante.id}
          vacante={vacante}
          onDelete={onDelete}
          onApply={onApply}
          showActions={showActions}
        />
      ))}
    </div>
  );
}