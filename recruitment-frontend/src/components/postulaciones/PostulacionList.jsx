import PostulacionCard from './PostulacionCard';

export default function PostulacionList({ postulaciones, onDelete }) {
  if (postulaciones.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No hay postulaciones todavía</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postulaciones.map((p) => (
        <PostulacionCard key={p.id} postulacion={p} onDelete={onDelete} />
      ))}
    </div>
  );
}
