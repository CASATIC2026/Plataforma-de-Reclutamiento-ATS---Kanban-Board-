import { getColorForId } from '../../utils/vacanteHelpers';

export default function CandidateSummary({ postulacion }) {
  const vacancyColor = postulacion.vacanteId ? getColorForId(postulacion.vacanteId) : null;

  return (
    <>
      <p className="font-semibold text-gray-900 text-sm truncate">
        {postulacion.nombreCandidato}
      </p>

      {vacancyColor ? (
        <div
          className="text-xs font-medium px-2.5 py-1 rounded-full mt-2 inline-block truncate max-w-full"
          style={{
            backgroundColor: vacancyColor.bg,
            color: vacancyColor.text,
          }}
          title={postulacion.vacanteTitulo}
        >
          {postulacion.vacanteTitulo}
        </div>
      ) : (
        <p className="text-xs text-navy font-medium truncate mt-0.5">
          {postulacion.vacanteTitulo}
        </p>
      )}

      <div className="mt-2 space-y-0.5">
        <p className="text-xs text-gray-500 truncate">{postulacion.email}</p>
        {postulacion.telefono && (
          <p className="text-xs text-gray-500">{postulacion.telefono}</p>
        )}
      </div>
    </>
  );
}
