import KanbanBoard from '../components/kanban/KanbanBoard';

export default function KanbanPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Kanban de Candidatos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Arrastra las tarjetas entre columnas para actualizar el estado de cada postulación.
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}
