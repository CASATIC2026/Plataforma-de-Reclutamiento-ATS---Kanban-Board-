import { useState } from "react";

const jobs = [
  { id: 1, title: "Frontend Developer", category: "Tecnología", type: "Tiempo Completo", location: "San Salvador, San Salvador", salary: "$500-$800 USD", posted: "Hace 2 días", desc: "Construye interfaces modernas con foco en rendimiento y accesibilidad" },
  { id: 2, title: "Backend Developer", category: "Tecnología", type: "Tiempo Completo", location: "San Salvador, San Salvador", salary: "$600-$1000 USD", posted: "Hace 1 día", desc: "Diseña APIs robustas y escalables con buenas prácticas de seguridad" },
  { id: 3, title: "UX/UI Designer", category: "Diseño", type: "Remoto", location: "San Salvador, San Salvador", salary: "$400-$700 USD", posted: "Hace 3 días", desc: "Crea experiencias de usuario intuitivas y visualmente impactantes" },
  { id: 4, title: "Data Analyst", category: "Datos", type: "Freelance", location: "San Salvador, San Salvador", salary: "$500-$900 USD", posted: "Hace 4 días", desc: "Transforma datos complejos en insights accionables para el negocio" },
  { id: 5, title: "DevOps Engineer", category: "Tecnología", type: "Tiempo Completo", location: "Santa Ana, Santa Ana", salary: "$700-$1200 USD", posted: "Hace 2 días", desc: "Automatiza pipelines y mantiene infraestructura en la nube" },
  { id: 6, title: "Product Manager", category: "Gestión", type: "Tiempo Completo", location: "San Salvador, San Salvador", salary: "$800-$1500 USD", posted: "Hace 1 día", desc: "Lidera el desarrollo de productos digitales con visión estratégica" },
];

const filters = ["Todos", "Tiempo Completo", "Medio Tiempo", "Remoto", "Freelance", "Temporal", "Prácticas"];

const categoryColors = {
  "Tecnología": "#334CAF",
  "Diseño": "#9B34AF",
  "Datos": "#AF5F34",
  "Gestión": "#2E8B57",
};

function JobCard({ job }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1a2040" : "#F4F4F4",
        border: `1.5px solid ${hovered ? "#CD7B4F" : "#131931"}`,
        borderRadius: "12px",
        padding: "22px 20px 18px 20px",
        boxShadow: hovered ? "0 8px 32px rgba(205,123,79,0.18)" : "0 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minHeight: "260px",
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{
          background: hovered ? "#CD7B4F" : "#131931",
          borderRadius: "8px",
          padding: "4px 12px",
          transition: "background 0.25s",
        }}>
          <span style={{ color: "#fff", fontFamily: "'Maven Pro', sans-serif", fontWeight: 700, fontSize: "14px" }}>{job.title}</span>
        </div>
        <span style={{ color: hovered ? "#aab0cc" : "#323232", fontFamily: "sans-serif", fontSize: "11px", fontWeight: 700 }}>{job.type}</span>
      </div>

      {/* Category */}
      <span style={{ color: categoryColors[job.category] || "#334CAF", fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600 }}>{job.category}</span>

      {/* Location & Date */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "16px" }}>📍</span>
          <span style={{ color: hovered ? "#ccc" : "#333", fontFamily: "sans-serif", fontSize: "11px" }}>{job.location}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "13px" }}>🕐</span>
          <span style={{ color: hovered ? "#aaa" : "#555", fontFamily: "sans-serif", fontSize: "11px" }}>{job.posted}</span>
        </div>
      </div>

      {/* Salary & Requirements */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>💵</span>
          <span style={{ color: hovered ? "#ccc" : "#333", fontFamily: "sans-serif", fontSize: "11px" }}>{job.salary}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "13px" }}>📋</span>
          <span style={{ color: hovered ? "#aaa" : "#555", fontFamily: "sans-serif", fontSize: "11px" }}>Requerimientos</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: hovered ? "#334" : "#D2D1D1", margin: "4px 0" }} />

      {/* Description */}
      <p style={{ color: hovered ? "#ccd" : "#222", fontFamily: "sans-serif", fontSize: "13px", lineHeight: "1.5", flex: 1, margin: 0 }}>{job.desc}</p>

      {/* CTA */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{
          background: "#319E85",
          border: "1px solid #BDBDBD",
          borderRadius: "8px",
          padding: "6px 16px",
          color: "#F3F3F3",
          fontFamily: "sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => e.target.style.background = "#267a68"}
          onMouseLeave={e => e.target.style.background = "#319E85"}
        >Ver detalles</button>
      </div>
    </div>
  );
}

export default function Homepage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = jobs.filter(j => {
    const matchFilter = activeFilter === "Todos" || j.type === activeFilter;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.desc.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ fontFamily: "sans-serif", background: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@400;700&family=Maven+Pro:wght@400;700&family=Jersey+25&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-thumb { background: #CD7B4F; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pulse { 0%,100% { opacity:0.7; } 50% { opacity:1; } }
      `}</style>

      {/* HEADER */}
      <header style={{
        background: "#E0E0E0",
        height: "90px",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}>
        {/* Logo */}
        <div style={{
          width: "70px", height: "70px",
          borderRadius: "50%", background: "#3a3a3a",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color: "#fff", fontFamily: "'Maven Pro', sans-serif", fontWeight: 700, fontSize: "22px" }}>Talent</span>
        </div>

        {/* Nav */}
        <nav style={{
          marginLeft: "auto",
          marginRight: "auto",
          background: "#CD7B4F",
          borderRadius: "10px",
          padding: "0 32px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          gap: "40px",
        }}>
          {["Inicio", "Empresas", "Recursos"].map(item => (
            <a key={item} href="#" style={{
              color: "#fff", fontFamily: "sans-serif", fontSize: "18px",
              textDecoration: "none", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.target.style.opacity = "0.7"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >{item}</a>
          ))}
        </nav>

        {/* Auth buttons */}
        <div style={{ display: "flex", gap: "12px", marginLeft: "20px" }}>
          <button style={{
            background: "#C5C6DD", border: "none", borderRadius: "16px",
            padding: "10px 24px", fontFamily: "sans-serif", fontWeight: 700, fontSize: "16px",
            cursor: "pointer", color: "#000",
          }}>Iniciar sesión</button>
          <button style={{
            background: "#111114", border: "none", borderRadius: "16px",
            padding: "10px 24px", fontFamily: "sans-serif", fontWeight: 700, fontSize: "16px",
            cursor: "pointer", color: "#fff",
          }}>Registrarse</button>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        background: "#131931",
        padding: "80px 40px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(205,123,79,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-40px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(31,157,185,0.05)", pointerEvents: "none" }} />

        <p style={{
          color: "#fff", fontFamily: "'Kaisei Decol', serif", fontSize: "40px",
          margin: "0 0 4px", animation: "fadeUp 0.7s ease both",
        }}>Encuentra el trabajo</p>
        <p style={{
          color: "#1F9DB9", fontFamily: "'Kaisei Decol', serif", fontSize: "40px",
          fontWeight: 700, margin: "0 0 20px", animation: "fadeUp 0.7s 0.1s ease both",
        }}>que mereces</p>
        <p style={{
          color: "#fff", fontFamily: "'Jersey 25', sans-serif", fontSize: "18px",
          opacity: 0.8, maxWidth: "640px", margin: "0 auto 36px",
          animation: "fadeUp 0.7s 0.2s ease both",
        }}>Conectamos talento excepcional con las empresas más innovadoras de El Salvador</p>

        {/* Search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0",
          maxWidth: "680px", margin: "0 auto",
          background: "rgba(217,217,217,0.12)",
          borderRadius: "10px", overflow: "hidden",
          animation: "fadeUp 0.7s 0.3s ease both",
        }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Puesto, ubicación, requisito..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#fff", fontFamily: "sans-serif", fontSize: "15px", padding: "16px 18px",
            }}
          />
          <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.2)" }} />
          <input
            value={dept}
            onChange={e => setDept(e.target.value)}
            placeholder="Departamento"
            style={{
              width: "160px", background: "transparent", border: "none", outline: "none",
              color: "#fff", fontFamily: "sans-serif", fontWeight: 600, fontSize: "15px", padding: "16px 14px",
            }}
          />
          <button style={{
            background: "#CD7B4F", border: "none", padding: "16px 24px",
            color: "#fff", fontFamily: "sans-serif", fontSize: "15px", fontWeight: 700, cursor: "pointer",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "#b5673d"}
            onMouseLeave={e => e.target.style.background = "#CD7B4F"}
          >Buscar</button>
        </div>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          {["Tecnología", "Diseño", "Datos", "Gestión"].map(tag => (
            <span key={tag} style={{
              background: "rgba(217,217,217,0.1)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px", color: "rgba(255,255,255,0.5)", fontSize: "13px",
              padding: "4px 14px", fontFamily: "sans-serif",
            }}>{tag}</span>
          ))}
        </div>

        <div style={{ height: "1px", background: "rgba(189,189,189,0.3)", margin: "48px auto 0", maxWidth: "1200px" }} />
      </section>

      {/* FILTER BAR */}
      <div style={{
        background: "#FFF5F5",
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        borderBottom: "1px solid #eee",
      }}>
        <span style={{ color: "#5B5959", fontFamily: "'Jersey 25', sans-serif", fontSize: "18px", marginRight: "8px" }}>Filtrar por:</span>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              background: activeFilter === f ? "#131E4D" : "#F4F4F4",
              border: "1px solid #BDBDBD",
              borderRadius: "10px",
              padding: "6px 18px",
              color: activeFilter === f ? "#F3F3F3" : "#464646",
              fontFamily: "sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >{f}</button>
        ))}
      </div>

      {/* JOB GRID */}
      <section style={{ background: "#353535", padding: "48px 40px 60px" }}>
        {filtered.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", fontFamily: "sans-serif", fontSize: "18px", padding: "60px 0" }}>No se encontraron empleos con este filtro.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "28px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}>
            {filtered.map((job, i) => (
              <div key={job.id} style={{ animation: `fadeUp 0.5s ${i * 0.07}s ease both` }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px", marginTop: "40px" }}>
          {[1, 2, 3, 4, 5].map(p => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              style={{
                background: currentPage === p ? "#CD7B4F" : "transparent",
                border: currentPage === p ? "none" : "1px solid #666",
                borderRadius: "6px",
                width: "32px", height: "32px",
                color: "#fff", fontFamily: "'Maven Pro', sans-serif", fontWeight: 700, fontSize: "15px",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >{p}</button>
          ))}
          <button style={{
            background: "transparent", border: "none", color: "#FFF5F5",
            fontSize: "20px", cursor: "pointer", lineHeight: 1,
          }}>›</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#131931", padding: "48px 40px 32px", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px", paddingBottom: "32px", borderBottom: "1px solid rgba(189,189,189,0.3)" }}>
            {/* Brand */}
            <div style={{ maxWidth: "260px" }}>
              <p style={{ fontFamily: "'Maven Pro', sans-serif", fontWeight: 700, fontSize: "22px", margin: "0 0 12px" }}>TALENTO</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", fontSize: "16px", fontWeight: 700, lineHeight: "1.5", margin: 0 }}>Conectando talento con Oportunidades</p>
            </div>

            {/* Footer links */}
            {[
              { title: "Candidatos", links: ["Buscar empleos", "Mi perfil", "Recursos"] },
              { title: "Empresas", links: ["Buscar empleos", "Mi perfil", "Recursos"] },
              { title: "Administracion", links: ["Buscar empleos", "Mi perfil", "Recursos"] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "18px", margin: "0 0 14px" }}>{col.title}</p>
                {col.links.map(l => (
                  <p key={l} style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", fontSize: "16px", fontWeight: 700, margin: "0 0 8px", cursor: "pointer" }}
                    onMouseEnter={e => e.target.style.color = "#CD7B4F"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                  >{l}</p>
                ))}
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "rgba(189,189,189,0.6)", fontFamily: "'Jersey 25', sans-serif", fontSize: "17px", marginTop: "24px" }}>
            © 2025 Talent. Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}