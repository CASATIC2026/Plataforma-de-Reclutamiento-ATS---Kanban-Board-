import { useState } from "react";
import { DndContext, DragOverlay, useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";
import { updateEstadoPostulacion } from "../../api/postulacionesApi";

const COLUMNAS = [
  { id: "Nuevo",         label: "🆕 Nuevos",          color: "bg-blue-50   border-blue-200"   },
  { id: "Entrevista",    label: "🎙️ Entrevista",      color: "bg-yellow-50 border-yellow-200" },
  { id: "PruebaTecnica", label: "💻 Prueba Técnica",   color: "bg-purple-50 border-purple-200" },
  { id: "Oferta",        label: "🎉 Oferta",           color: "bg-green-50  border-green-200"  },
];

const Columna = ({ id, label, color, postulaciones, onDelete, onRefresh }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[220px] rounded-xl border-2 p-3 transition-colors ${color} ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-700 text-sm">{label}</h3>
        <span className="text-xs bg-white rounded-full px-2 py-0.5 shadow text-gray-500">
          {postulaciones.length}
        </span>
      </div>
      <div className="min-h-[100px]">
        {postulaciones.map((p) => (
          <KanbanCard key={p.id} postulacion={p} onDelete={onDelete} onRefresh={onRefresh} />
        ))}
      </div>
    </div>
  );
};

const KanbanBoard = ({ postulaciones: inicial, onDelete, onRefresh }) => {
  const [postulaciones, setPostulaciones] = useState(inicial);
  const [draggingId, setDraggingId] = useState(null);

  const postulacionesPorEstado = (estado) =>
    postulaciones.filter((p) => p.estado === estado);

  const draggingItem = postulaciones.find((p) => p.id === draggingId);

  const handleDragStart = ({ active }) => setDraggingId(active.id);

  const handleDragEnd = async ({ active, over }) => {
    setDraggingId(null);
    if (!over) return;

    const nuevoEstado = over.id;
    const postulacion = postulaciones.find((p) => p.id === active.id);
    if (!postulacion || postulacion.estado === nuevoEstado) return;

    // Optimistic update
    setPostulaciones((prev) =>
      prev.map((p) => (p.id === active.id ? { ...p, estado: nuevoEstado } : p))
    );

    try {
      await updateEstadoPostulacion(active.id, nuevoEstado);
    } catch {
      // Revert on error
      setPostulaciones((prev) =>
        prev.map((p) =>
          p.id === active.id ? { ...p, estado: postulacion.estado } : p
        )
      );
      alert("Error al actualizar el estado. Intenta de nuevo.");
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNAS.map((col) => (
          <Columna
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            postulaciones={postulacionesPorEstado(col.id)}
            onDelete={onDelete}
            onRefresh={onRefresh}
          />
        ))}
      </div>

      <DragOverlay>
        {draggingItem ? <KanbanCard postulacion={draggingItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;