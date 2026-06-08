import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const KanbanCard = ({ postulacion, onDelete, onRefresh }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: postulacion.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-surface rounded-lg shadow p-3 mb-2 cursor-grab border border-gray-200 hover:shadow-md transition-shadow"
    >
      <p className="font-semibold text-gray-800 text-sm">{postulacion.nombreCandidato}</p>
      <p className="text-xs text-gray-500 mt-1">{postulacion.email}</p>
      <p className="text-xs text-gray-400">{postulacion.telefono}</p>
      {postulacion.cvFileName && (
        <span className="inline-block mt-2 text-xs bg-[rgba(96,165,250,0.12)] text-[#93c5fd] px-2 py-0.5 rounded">
          📄 {postulacion.cvFileName}
        </span>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("¿Eliminar esta postulación?"))
              onDelete(postulacion.id).then(onRefresh);
          }}
          className="mt-2 text-xs text-error hover:text-error/80 block"
        >
          Eliminar
        </button>
      )}
    </div>
  );
};

export default KanbanCard;