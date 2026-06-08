import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosInstance';

/**
 * Tenant filter dropdown — only rendered for platform-tier users (Admin/Owner).
 * Selecting a company stores its id in AuthContext.selectedCompanyId; pages that
 * fetch data read that value and append ?companyId=... to their API calls.
 * Backend ignores the param for non-platform users, so this is purely a UX layer.
 */
export default function CompanySwitcher() {
  const { isPlatformTier, selectedCompanyId, setSelectedCompany } = useAuth();
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    if (!isPlatformTier) return;
    API.get('/empresas')
      .then((r) => setEmpresas(r.data ?? []))
      .catch(() => setEmpresas([]));
  }, [isPlatformTier]);

  if (!isPlatformTier) return null;

  return (
    <select
      value={selectedCompanyId ?? ''}
      onChange={(e) => setSelectedCompany(e.target.value || null)}
      title="Filtrar por empresa"
      style={{
        padding: '6px 10px',
        borderRadius: 8,
        border: '1.5px solid var(--color-accent)',
        background: 'var(--color-surface)',
        color: 'var(--color-navy)',
        fontWeight: 600,
        fontSize: '0.85rem',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <option value="">Todas las empresas</option>
      {empresas.map((e) => (
        <option key={e.id} value={e.id}>{e.nombre}</option>
      ))}
    </select>
  );
}
