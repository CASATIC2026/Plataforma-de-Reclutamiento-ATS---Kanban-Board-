import { useCallback } from 'react';
import { updateEstado } from '../api/postulacionesApi';

export function useRechazadosRestore(setRechazados) {
  const handleRestore = useCallback(
    async (postulacionId) => {
      try {
        await updateEstado(postulacionId, 0);
        setRechazados((prev) => prev.filter((r) => r.id !== postulacionId));
      } catch (err) {
        console.error('Error restoring candidate:', err);
      }
    },
    [setRechazados]
  );

  return { handleRestore };
}
