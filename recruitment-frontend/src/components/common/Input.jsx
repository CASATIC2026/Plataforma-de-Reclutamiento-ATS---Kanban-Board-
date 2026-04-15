export default function Input({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  success = false,
  hint = '',
}) {
  const borderClass = error
    ? 'border-red-400 focus:ring-red-300'
    : success
    ? 'border-green-400 focus:ring-green-300'
    : 'border-gray-300 focus:ring-indigo-500';

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${borderClass}`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
