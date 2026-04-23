// ─── Cached regex patterns (created once, not per call) ───────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CLEAN = /\D/g;
const SPECIAL_CHARS_ONLY = /^[^a-zA-Z0-9]+$/;

// ─── Common email domain typos ─────────────────────────────────────────────────
const EMAIL_TYPOS = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gamil.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outloook.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
};

// ─── Common weak passwords ─────────────────────────────────────────────────────
const WEAK_PASSWORDS = new Set([
  'password', '12345678', 'qwerty', 'abc123', '111111',
  'password1', 'iloveyou', 'admin123', '123456789', 'welcome',
  'monkey', 'dragon', 'master', 'letmein', 'football',
]);

// ─── Sequential digit pattern (e.g. 1234567890) ───────────────────────────────
function isSequential(digits) {
  for (let i = 0; i < digits.length - 1; i++) {
    if (parseInt(digits[i + 1]) - parseInt(digits[i]) !== 1) return false;
  }
  return true;
}

// ─── All-same digit pattern (e.g. 0000000000) ─────────────────────────────────
function isAllSame(digits) {
  return digits.split('').every((d) => d === digits[0]);
}

// ──────────────────────────────────────────────────────────────────────────────
// validateEmail
// Returns { valid: bool, error: string, suggestion: string|null }
// ──────────────────────────────────────────────────────────────────────────────
export function validateEmail(value) {
  const trimmed = (value || '').trim();

  if (!trimmed) {
    return { valid: false, error: 'El correo electrónico es requerido.', suggestion: null };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Formato de correo inválido (ej: usuario@dominio.com)',
      suggestion: null,
    };
  }

  // Check for typos in the domain part
  const domain = trimmed.split('@')[1]?.toLowerCase();
  const correction = domain ? EMAIL_TYPOS[domain] : null;
  const suggestion = correction
    ? `¿Quisiste decir ${trimmed.split('@')[0]}@${correction}?`
    : null;

  return { valid: true, error: '', suggestion };
}

// ──────────────────────────────────────────────────────────────────────────────
// validatePhone
// Returns { valid: bool, error: string }
// Accepts empty string as valid (phone is usually optional)
// ──────────────────────────────────────────────────────────────────────────────
export function validatePhone(value) {
  const raw = (value || '').trim();
  if (!raw) return { valid: true, error: '' }; // optional field

  const digits = raw.replace(PHONE_CLEAN, '');
  const count = digits.length;

  if (count < 10) {
    return {
      valid: false,
      error: `Teléfono debe tener mínimo 10 dígitos (${count} proporcionados).`,
    };
  }

  if (count > 15) {
    return {
      valid: false,
      error: `Teléfono no puede superar 15 dígitos (${count} proporcionados).`,
    };
  }

  if (isAllSame(digits)) {
    return { valid: false, error: 'Teléfono inválido (todos los dígitos son iguales).' };
  }

  if (count === 10 && isSequential(digits)) {
    return { valid: false, error: 'Teléfono inválido (secuencia numérica no permitida).' };
  }

  return { valid: true, error: '' };
}

// ──────────────────────────────────────────────────────────────────────────────
// validatePassword
// Returns { valid: bool, error: string, strength: 0|1|2|3 }
//   strength 0 = invalid
//   strength 1 = min 8 chars
//   strength 2 = + uppercase + number
//   strength 3 = + special char
// ──────────────────────────────────────────────────────────────────────────────
export function validatePassword(value) {
  const val = value || '';

  if (!val) {
    return { valid: false, error: 'La contraseña es requerida.', strength: 0 };
  }

  if (WEAK_PASSWORDS.has(val.toLowerCase())) {
    return { valid: false, error: 'Contraseña demasiado común. Elige una más segura.', strength: 0 };
  }

  if (val.length < 8) {
    return {
      valid: false,
      error: `La contraseña debe tener al menos 8 caracteres (${val.length} proporcionados).`,
      strength: 0,
    };
  }

  const hasUpper = /[A-Z]/.test(val);
  const hasLower = /[a-z]/.test(val);
  const hasNumber = /\d/.test(val);
  const hasSpecial = /[!@#$%^&*]/.test(val);

  if (!hasLower) {
    return { valid: false, error: 'La contraseña debe contener al menos una letra minúscula.', strength: 1 };
  }

  // Strength 1: 8+ chars with lowercase
  let strength = 1;

  if (hasUpper && hasNumber) strength = 2;
  if (hasUpper && hasNumber && hasSpecial) strength = 3;

  // We allow strength 1 as valid (8+ chars), but warn about improvements
  return { valid: true, error: '', strength };
}

// ──────────────────────────────────────────────────────────────────────────────
// validateName
// Returns { valid: bool, error: string }
// ──────────────────────────────────────────────────────────────────────────────
export function validateName(value, label = 'Nombre', min = 3) {
  const trimmed = (value || '').trim();

  if (!trimmed) {
    return { valid: false, error: `${label} es requerido.` };
  }

  if (SPECIAL_CHARS_ONLY.test(trimmed)) {
    return { valid: false, error: `${label} contiene caracteres inválidos.` };
  }

  if (trimmed.length < min) {
    return {
      valid: false,
      error: `${label} debe tener al menos ${min} caracteres (${trimmed.length} proporcionados).`,
    };
  }

  return { valid: true, error: '' };
}

// ──────────────────────────────────────────────────────────────────────────────
// validateSalary
// Returns { valid: bool, error: string }
// Both values are optional; only validates when at least one is provided
// ──────────────────────────────────────────────────────────────────────────────
export function validateSalary(minVal, maxVal) {
  const min = minVal !== '' && minVal !== null ? Number(minVal) : null;
  const max = maxVal !== '' && maxVal !== null ? Number(maxVal) : null;

  if (min !== null && isNaN(min)) {
    return { valid: false, error: 'Salario mínimo debe ser un número válido.' };
  }

  if (max !== null && isNaN(max)) {
    return { valid: false, error: 'Salario máximo debe ser un número válido.' };
  }

  if (min !== null && min < 0) {
    return { valid: false, error: 'El salario mínimo no puede ser negativo.' };
  }

  if (max !== null && max < 0) {
    return { valid: false, error: 'El salario máximo no puede ser negativo.' };
  }

  if (min !== null && max !== null && min > max) {
    return { valid: false, error: 'El salario mínimo no puede superar el máximo.' };
  }

  return { valid: true, error: '' };
}

// ──────────────────────────────────────────────────────────────────────────────
// validateRequirementTag
// Returns { valid: bool, error: string }
// ──────────────────────────────────────────────────────────────────────────────
export function validateRequirementTag(value, existing = []) {
  const trimmed = (value || '').trim();

  if (!trimmed) {
    return { valid: false, error: 'Escribe un requisito antes de agregar.' };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: 'El requisito debe tener al menos 2 caracteres.' };
  }

  if (existing.some((r) => r.toLowerCase() === trimmed.toLowerCase())) {
    return { valid: false, error: `"${trimmed}" ya está en la lista.` };
  }

  return { valid: true, error: '' };
}

// ──────────────────────────────────────────────────────────────────────────────
// getPasswordStrengthLabel
// Helper to get a display label for password strength level
// ──────────────────────────────────────────────────────────────────────────────
export function getPasswordStrengthLabel(strength) {
  switch (strength) {
    case 1: return { label: 'Débil', color: '#ef4444' };
    case 2: return { label: 'Media', color: '#f59e0b' };
    case 3: return { label: 'Fuerte', color: '#22c55e' };
    default: return { label: '', color: '#d1d5db' };
  }
}
