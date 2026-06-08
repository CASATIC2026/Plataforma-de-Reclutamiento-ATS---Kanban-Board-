import { getPasswordStrengthLabel } from '../../utils/validators';

export default function PasswordStrengthBar({ strength }) {
  if (!strength) return null;
  const { label, color } = getPasswordStrengthLabel(strength);
  return (
    <div className="flex items-center gap-2 -mt-1 mb-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className="h-1 flex-1 rounded-full transition-all"
            style={{ backgroundColor: level <= strength ? color : 'rgba(85,67,62,0.2)' }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
