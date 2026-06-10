/** First name for welcome copy */
export function getFirstName(user) {
  const name = user?.nombre?.trim();
  if (!name) return 'Candidato';
  return name.split(/\s+/)[0];
}

export function getDisplayName(user) {
  if (!user) return '';
  const parts = [user.nombre, user.apellido].filter(Boolean);
  return parts.join(' ') || user.email || 'Usuario';
}

export function getInitials(user) {
  const name = getDisplayName(user);
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export function getRoleLabel(user) {
  const rol = user?.rol;
  if (!rol) return 'Candidato';
  if (rol === 'Estudiante') return 'Candidato';
  return rol;
}

/** Profile completion % for the progress card */
export function computeProfileProgress(user, applications = []) {
  let pct = 40;
  if (user?.carrera?.trim()) pct += 25;
  if (applications.length > 0) pct += 20;
  if (applications.some((a) => a.estado >= 1)) pct += 15;
  return Math.min(100, pct);
}

export function getPreferenceSubtitle(user, featuredJob) {
  if (user?.carrera?.trim()) {
    return `Basado en tu perfil de "${user.carrera}"`;
  }
  if (featuredJob?.requirements?.length) {
    const tag = featuredJob.requirements[0];
    return `Basado en vacantes con "${tag}" y similares`;
  }
  return 'Basado en vacantes activas en la plataforma';
}

/** Exclude vacantes the user already applied to */
export function getRecommendedJobs(mappedJobs, applications, limit = 3) {
  const appliedIds = new Set(applications.map((a) => a.vacanteId).filter(Boolean));
  return mappedJobs.filter((j) => !appliedIds.has(j.id)).slice(0, limit);
}

const ESTADO_LABELS = {
  0: 'Pendiente',
  1: 'En Revisión',
  2: 'Prueba Técnica',
  3: 'Oferta',
  '-1': 'Rechazada',
};

/** Derive a client-side notification list from status changes on the user's applications */
export function getRecentNotifications(applications = [], maxDays = 30) {
  const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;
  return applications
    .filter((a) => a.estado !== 0 && a.updatedAt && new Date(a.updatedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map((a) => ({
      id: a.id,
      message: `Tu postulación a "${a.vacanteTitulo}" cambió a ${ESTADO_LABELS[a.estado] ?? 'actualizado'}`,
      date: a.updatedAt,
    }));
}
