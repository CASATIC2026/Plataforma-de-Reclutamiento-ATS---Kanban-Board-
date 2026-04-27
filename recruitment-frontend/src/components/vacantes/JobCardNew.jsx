import { memo, useState } from 'react';

function JobCardNew({ job, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="job-card"
      role="button"
      tabIndex={0}
      aria-label={`Ver vacante: ${job.title}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{
        background: hovered ? '#1a2040' : '#F4F4F4',
        border: `1.5px solid ${hovered ? '#CD7B4F' : '#131931'}`,
        borderRadius: '12px',
        padding: '22px 20px 18px 20px',
        boxShadow: hovered ? '0 8px 32px rgba(205,123,79,0.18)' : '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '260px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div
          style={{
            background: hovered ? '#CD7B4F' : '#131931',
            borderRadius: '8px',
            padding: '4px 12px',
            transition: 'background 0.25s',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontFamily: "'Maven Pro', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {job.title}
          </span>
        </div>
        <span
          style={{
            color: hovered ? '#aab0cc' : '#323232',
            fontFamily: 'sans-serif',
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          {job.type}
        </span>
      </div>

      <span
        style={{
          color: '#334CAF',
          fontFamily: 'sans-serif',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {job.requirements && job.requirements[0] ? job.requirements[0] : 'General'}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>📍</span>
          <span
            style={{
              color: hovered ? '#ccc' : '#333',
              fontFamily: 'sans-serif',
              fontSize: '11px',
            }}
          >
            {job.location}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '13px' }}>🕐</span>
          <span
            style={{
              color: hovered ? '#aaa' : '#555',
              fontFamily: 'sans-serif',
              fontSize: '11px',
            }}
          >
            {job.posted}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>💵</span>
          <span
            style={{
              color: hovered ? '#ccc' : '#333',
              fontFamily: 'sans-serif',
              fontSize: '11px',
            }}
          >
            {job.salary}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '13px' }}>📋</span>
          <span
            style={{
              color: hovered ? '#aaa' : '#555',
              fontFamily: 'sans-serif',
              fontSize: '11px',
            }}
          >
            {job.requirements?.length || 0} Requisitos
          </span>
        </div>
      </div>

      <div style={{ height: '1px', background: hovered ? '#334' : '#D2D1D1', margin: '4px 0' }} />

      <p
        style={{
          color: hovered ? '#ccd' : '#222',
          fontFamily: 'sans-serif',
          fontSize: '13px',
          lineHeight: '1.5',
          flex: 1,
          margin: 0,
        }}
      >
        {job.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          style={{
            background: '#319E85',
            border: '1px solid #BDBDBD',
            borderRadius: '8px',
            padding: '6px 16px',
            color: '#F3F3F3',
            fontFamily: 'sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#267a68')}
          onMouseLeave={(e) => (e.target.style.background = '#319E85')}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}

export default memo(JobCardNew);
