import { SCORE_THRESHOLDS } from '../constants';

const LOGO_COLORS = [
  { bg: '#1C3A5A', text: '#7EB8E8' },
  { bg: '#2E3A5A', text: '#9BB5E0' },
  { bg: '#3A2E1C', text: '#E8B87E' },
  { bg: '#1C3A2E', text: '#7EC4A8' },
  { bg: '#2E1C3A', text: '#B87EC4' },
  { bg: '#1C3A3A', text: '#7EC4C4' },
  { bg: '#3A1C1C', text: '#E87E7E' },
  { bg: '#1C2E3A', text: '#7EA8C4' },
  { bg: '#3A3A1C', text: '#C4C47E' },
  { bg: '#2E1C2E', text: '#C47EC4' },
];

export function getColorForId(id) {
  if (!id || typeof id !== 'string') return LOGO_COLORS[0];
  const hash = id.replace(/-/g, '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return LOGO_COLORS[hash % LOGO_COLORS.length];
}

export function getLogoLetters(titulo) {
  const words = titulo.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return titulo.substring(0, 2).toUpperCase();
}

export function formatSalary(min, max) {
  if (min && max) return `$${Number(min).toLocaleString('en-US')} – $${Number(max).toLocaleString('en-US')} USD`;
  if (min) return `Desde $${Number(min).toLocaleString('en-US')} USD`;
  if (max) return `Hasta $${Number(max).toLocaleString('en-US')} USD`;
  return 'Salario a convenir';
}

export function formatRelativeDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '—';
  const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Hace 1 día';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 14) return 'Hace 1 semana';
  return `Hace ${Math.floor(diffDays / 7)} semanas`;
}

export function isRecent(isoString) {
  return (new Date() - new Date(isoString)) < 2 * 24 * 60 * 60 * 1000;
}

export function getPuntajeStyle(score) {
  if (score == null) return {};
  if (score >= SCORE_THRESHOLDS.HIGH) {
    return { backgroundColor: '#d1fae5', color: '#065f46' };
  }
  if (score >= SCORE_THRESHOLDS.MEDIUM) {
    return { backgroundColor: '#fef3c7', color: '#92400e' };
  }
  return { backgroundColor: '#fee2e2', color: '#991b1b' };
}

export function formatSalaryRange(min, max) {
  if (!min || !max) return '—';
  return `$${Number(min).toLocaleString('en-US')} - $${Number(max).toLocaleString('en-US')}`;
}

export function formatId(id, length = 8) {
  if (!id) return '—';
  return String(id).slice(0, length).toUpperCase();
}

export function mapVacante(v) {
  const color = getColorForId(v.id);
  return {
    id: v.id,
    title: v.titulo,
    company: 'Empresa Privada',
    location: v.ubicacion,
    type: v.tipoContrato,
    salary: formatSalary(v.salarioMin, v.salarioMax),
    urgent: isRecent(v.createdAt),
    posted: formatRelativeDate(v.createdAt),
    logoLetters: getLogoLetters(v.titulo),
    logoBg: color.bg,
    logoColor: color.text,
    description: v.descripcion,
    requirements: v.requisitos,
    estaActiva: v.estaActiva,
  };
}
