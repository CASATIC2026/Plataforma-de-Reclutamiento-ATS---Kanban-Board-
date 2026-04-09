# Kanban Board
Repository: casatic2026/plataforma-de-reclutamiento-ats---kanban-board-
Branch: development-BM
================================================
  RECRUITMENT PLATFORM ATS — ARCHITECTURE
================================================


BACKEND: RecruitmentAPI/
─────────────────────────────────────────────────────────────────

RecruitmentAPI/
│
├── Controllers/                  # Entry point — receives HTTP requests
│   ├── VacantesController.cs
│   └── PostulacionesController.cs
│
├── Services/                     # Business logic
│   ├── Interfaces/
│   │   ├── IVacanteService.cs
│   │   └── IPostulacionService.cs
│   ├── VacanteService.cs
│   └── PostulacionService.cs
│
├── Repositories/                 # Talks to the database only
│   ├── Interfaces/
│   │   ├── IVacanteRepository.cs
│   │   └── IPostulacionRepository.cs
│   ├── VacanteRepository.cs
│   └── PostulacionRepository.cs
│
├── Models/                       # Domain entities (DB tables)
│   ├── Vacante.cs
│   ├── Requisito.cs
│   └── Postulacion.cs
│
├── DTOs/                         # What we send and receive
│   ├── CreateVacanteDTO.cs
│   ├── UpdateVacanteDTO.cs
│   ├── VacanteResponseDTO.cs
│   ├── CreatePostulacionDTO.cs
│   └── PostulacionResponseDTO.cs
│
├── Data/                         # EF Core context & config
│   ├── AppDbContext.cs
│   └── Configurations/
│       ├── VacanteConfiguration.cs
│       ├── RequisitoConfiguration.cs
│       └── PostulacionConfiguration.cs
│
├── Migrations/                   # EF Core auto-generated
│   ├── 20260221213705_InitialCreate
│   └── 20260302103713_AddPostulaciones
│
├── Storage/CVs/                  # Uploaded CVs saved here
├── Program.cs                    # App entry point + DI registration
└── appsettings.json


FRONTEND: recruitment-frontend/
─────────────────────────────────────────────────────────────────

recruitment-frontend/src/
│
├── api/                          # All HTTP calls to backend
│   ├── vacantesApi.js
│   └── postulacionesApi.js
│
├── components/
│   ├── common/                   # Reusable UI primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   ├── vacantes/
│   │   ├── VacanteCard.jsx
│   │   ├── VacanteForm.jsx
│   │   ├── VacanteList.jsx
│   │   ├── JobCard.jsx
│   │   └── JobDetailModal.jsx
│   └── postulaciones/
│       ├── ApplyModal.jsx
│       ├── PostulacionForm.jsx
│       ├── PostulacionCard.jsx
│       └── PostulacionList.jsx
│
├── pages/
│   ├── PublicVacantesPage.jsx    # Candidates: browse & apply
│   ├── AdminVacantesPage.jsx     # Recruiter: manage vacantes
│   └── AdminPostulacionesPage.jsx# Recruiter: view applications
│
├── layouts/
│   ├── MainLayout.jsx
│   └── PublicLayout.jsx
│
├── utils/
│   └── vacanteHelpers.js
│
├── App.jsx                       # Router setup
└── main.jsx                      # React entry point


REQUEST FLOW
─────────────────────────────────────────────────────────────────

[React form] → api/*.js → HTTP request
                                  │
                                  ▼
                          Controller (receives request)
                                  │
                                  ▼
                          Service (validates, maps DTO → Entity)
                                  │
                                  ▼
                          Repository (reads/writes PostgreSQL)
                                  │
                                  ▼
                          Returns DTO back up the chain → UI


DATABASE SCHEMA
─────────────────────────────────────────────────────────────────

┌──────────────────────────┐         ┌──────────────────────────┐
│         vacantes         │         │        requisitos         │
├──────────────────────────┤         ├──────────────────────────┤
│ Id (PK, UUID)            │────┐    │ Id (PK, UUID)            │
│ Titulo (varchar 200)     │    └───>│ VacanteId (FK → vacantes)│
│ Descripcion (text)       │         │ Descripcion (varchar 500)│
│ Ubicacion (varchar 200)  │         │ CreatedAt (timestamptz)  │
│ TipoContrato (varchar)   │         └──────────────────────────┘
│ SalarioMin (decimal?)    │
│ SalarioMax (decimal?)    │         ┌──────────────────────────┐
│ EstaActiva (bool)        │         │      postulaciones        │
│ CreatedAt (timestamptz)  │         ├──────────────────────────┤
│ UpdatedAt (timestamptz)  │────┐    │ Id (PK, UUID)            │
└──────────────────────────┘    └───>│ VacanteId (FK → vacantes)│
                                     │ NombreCandidato (varchar)│
                                     │ Email (varchar 200)      │
                                     │ Telefono (varchar 20)    │
                                     │ CvFileName (varchar 300) │
                                     │ CvFilePath (varchar 500) │
                                     │ CreatedAt (timestamptz)  │
                                     └──────────────────────────┘

 vacantes ──< requisitos      ON DELETE CASCADE
 vacantes ──< postulaciones   ON DELETE CASCADE

 Indexes: IX_requisitos_VacanteId, IX_postulaciones_VacanteId


MIGRATIONS APPLIED
─────────────────────────────────────────────────────────────────
 20260221213705_InitialCreate      → vacantes, requisitos
 20260302103713_AddPostulaciones   → postulaciones
