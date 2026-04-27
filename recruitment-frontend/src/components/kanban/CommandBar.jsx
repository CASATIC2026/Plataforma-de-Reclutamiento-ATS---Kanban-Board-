import { useState, useEffect, useRef } from 'react';

export default function CommandBar({ filters, setFilters, vacantes }) {
  const [searchLocal, setSearchLocal] = useState(filters.search);
  const searchTimeoutRef = useRef(null);

  // Debounce search input (300ms)
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setFilters({ ...filters, search: searchLocal });
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchLocal, filters, setFilters]);

  return (
    <div className="sticky top-0 z-30 bg-white rounded-xl shadow-sm p-4 mb-6 border border-border/10">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchLocal}
            onChange={(e) => setSearchLocal(e.target.value)}
            className="w-full bg-accent-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Vacancy Select */}
        <div className="min-w-[200px]">
          <select
            value={filters.vacanteId || ''}
            onChange={(e) => setFilters({ ...filters, vacanteId: e.target.value || null })}
            className="w-full bg-accent-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all appearance-none"
          >
            <option value="">Todas las vacantes</option>
            {vacantes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.titulo}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="min-w-[160px]">
          <select
            value={filters.fecha}
            onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
            className="w-full bg-accent-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all appearance-none"
          >
            <option value="todos">Todos</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
          </select>
        </div>

        {/* Sort */}
        <div className="min-w-[160px]">
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="w-full bg-accent-bg border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-navy/20 focus:border-transparent outline-none transition-all appearance-none"
          >
            <option value="reciente">Recientes primero</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(filters.search || filters.vacanteId || filters.fecha !== 'todos' || filters.sort !== 'reciente') && (
          <button
            onClick={() =>
              setFilters({
                search: '',
                vacanteId: null,
                fecha: 'todos',
                sort: 'reciente',
              })
            }
            className="px-4 py-2.5 text-sm font-semibold text-danger hover:bg-red-50 rounded-lg transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
