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

const ICON_KEYWORDS = [
  { keys: ['react', 'next', 'node', 'fullstack', 'full-stack'], icon: 'rocket_launch' },
  { keys: ['security', 'cissp', 'cyber', 'ciber'], icon: 'shield' },
  { keys: ['design', 'ux', 'ui', 'figma'], icon: 'brush' },
  { keys: ['postgres', 'sql', 'database', 'data'], icon: 'database' },
  { keys: ['mobile', 'ios', 'android', 'flutter'], icon: 'smartphone' },
  { keys: ['analytics', 'data science', 'ml', 'ai'], icon: 'analytics' },
  { keys: ['aws', 'cloud', 'azure', 'gcp'], icon: 'cloud' },
  { keys: ['devops', 'kubernetes', 'docker'], icon: 'verified_user' },
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
  return new Date(isoString) - new Date() < 2 * 24 * 60 * 60 * 1000;
}

export function deriveBadge(createdAt) {
  if (!createdAt) return null;
  const ageMs = Date.now() - new Date(createdAt).getTime();
  if (ageMs < 12 * 60 * 60 * 1000) return 'urgent';
  if (isRecent(createdAt)) return 'new';
  return null;
}

export function deriveIconKey(requisitos = [], titulo = '') {
  const haystack = [...requisitos, titulo].join(' ').toLowerCase();
  const match = ICON_KEYWORDS.find(({ keys }) => keys.some((k) => haystack.includes(k)));
  return match?.icon ?? 'code';
}

export function getPuntajeStyle(score) {
  if (score == null) return {};
  if (score >= SCORE_THRESHOLDS.HIGH) {
    return { backgroundColor: 'var(--color-score-high-bg)', color: 'var(--color-score-high-fg)' };
  }
  if (score >= SCORE_THRESHOLDS.MEDIUM) {
    return { backgroundColor: 'var(--color-score-mid-bg)', color: 'var(--color-score-mid-fg)' };
  }
  return { backgroundColor: 'var(--color-score-low-bg)', color: 'var(--color-score-low-fg)' };
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
  const requisitos = v.requisitos ?? [];
  return {
    id: v.id,
    title: v.titulo,
    company: v.empresaNombre ?? 'Empresa Privada',
    location: v.ubicacion,
    type: v.tipoContrato,
    salary: formatSalary(v.salarioMin, v.salarioMax),
    urgent: isRecent(v.createdAt),
    badge: deriveBadge(v.createdAt),
    iconKey: deriveIconKey(requisitos, v.titulo),
    posted: formatRelativeDate(v.createdAt),
    logoLetters: getLogoLetters(v.titulo),
    logoBg: color.bg,
    logoColor: color.text,
    description: v.descripcion,
    requirements: requisitos,
    estaActiva: v.estaActiva,
    createdAt: v.createdAt,
    salarioMin: v.salarioMin,
    salarioMax: v.salarioMax,
  };
}

export function computeAverageSalary(jobs) {
  const withSalary = jobs.filter((j) => j.salarioMin != null && j.salarioMax != null);
  if (!withSalary.length) return null;
  const sum = withSalary.reduce((acc, j) => acc + (Number(j.salarioMin) + Number(j.salarioMax)) / 2, 0);
  return Math.round(sum / withSalary.length);
}

export function countNewThisWeek(jobs) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return jobs.filter((j) => j.createdAt && new Date(j.createdAt).getTime() > weekAgo).length;
}
