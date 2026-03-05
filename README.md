# Kanban Board
Repository: casatic2026/plataforma-de-reclutamiento-ats---kanban-board-
Branch: development-BM
Files analyzed: 104

Directory structure:
└── casatic2026-plataforma-de-reclutamiento-ats---kanban-board-/
    ├── README.md
    ├── arquitectura.txt
    ├── Nuevo Documento de texto.txt
    ├── Plataforma-de-Reclutamiento-ATS---Kanban-Board-.sln
    ├── recruitment-frontend/
    │   ├── README.md
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── vite.config.js
    │   ├── .gitignore
    │   ├── files/
    │   │   ├── app.js
    │   │   ├── index.html
    │   │   ├── styles.css
    │   │   └── .vs/
    │   │       ├── slnx.sqlite
    │   │       ├── VSWorkspaceState.json
    │   │       └── files/
    │   │           ├── FileContentIndex/
    │   │           │   └── 8135b275-d2a3-4c9c-86b3-be45f389f935.vsidx
    │   │           └── v17/
    │   │               ├── DocumentLayout.json
    │   │               └── .wsuo
    │   ├── public/
    │   └── src/
    │       ├── App.jsx
    │       ├── index.css
    │       ├── main.jsx
    │       ├── api/
    │       │   ├── postulacionesApi.js
    │       │   └── vacantesApi.js
    │       ├── components/
    │       │   ├── common/
    │       │   │   ├── Button.jsx
    │       │   │   ├── Input.jsx
    │       │   │   └── Modal.jsx
    │       │   ├── postulaciones/
    │       │   │   ├── ApplyModal.jsx
    │       │   │   ├── PostulacionCard.jsx
    │       │   │   ├── PostulacionForm.jsx
    │       │   │   └── PostulacionList.jsx
    │       │   └── vacantes/
    │       │       ├── JobCard.jsx
    │       │       ├── JobDetailModal.jsx
    │       │       ├── VacanteCard.jsx
    │       │       ├── VacanteForm.jsx
    │       │       └── VacanteList.jsx
    │       ├── layouts/
    │       │   ├── MainLayout.jsx
    │       │   └── PublicLayout.jsx
    │       ├── pages/
    │       │   ├── AdminPostulacionesPage.jsx
    │       │   ├── AdminVacantesPage.jsx
    │       │   └── PublicVacantesPage.jsx
    │       ├── styles/
    │       │   └── talentbridge.css
    │       └── utils/
    │           └── vacanteHelpers.js
    └── RecruitmentAPI/
        ├── appsettings.Development.json
        ├── appsettings.json
        ├── Program.cs
        ├── RecruitmentAPI.csproj
        ├── RecruitmentAPI.http
        ├── bin/
        │   └── Debug/
        │       └── net8.0/
        │           ├── appsettings.Development.json
        │           ├── appsettings.json
        │           ├── RecruitmentAPI
        │           ├── RecruitmentAPI.deps.json
        │           ├── RecruitmentAPI.runtimeconfig.json
        │           ├── cs/
        │           ├── de/
        │           ├── es/
        │           ├── fr/
        │           ├── it/
        │           ├── ja/
        │           ├── ko/
        │           ├── pl/
        │           ├── pt-BR/
        │           ├── ru/
        │           ├── tr/
        │           ├── zh-Hans/
        │           └── zh-Hant/
        ├── Controllers/
        │   ├── PostulacionesController.cs
        │   └── VacantesController.cs
        ├── Data/
        │   ├── AppDbContext.cs
        │   └── Configurations/
        │       ├── PostulacionConfiguration.cs
        │       ├── RequisitoConfiguration.cs
        │       └── VacanteConfiguration.cs
        ├── DTOs/
        │   ├── CreatePostulacionDTO.cs
        │   ├── CreateVacanteDTO.cs
        │   ├── PostulacionResponseDTO.cs
        │   ├── UpdateVacanteDTO.cs
        │   └── VacanteResponseDTO.cs
        ├── Migrations/
        │   ├── 20260221213705_InitialCreate.cs
        │   ├── 20260221213705_InitialCreate.Designer.cs
        │   ├── 20260302103713_AddPostulaciones.cs
        │   ├── 20260302103713_AddPostulaciones.Designer.cs
        │   └── AppDbContextModelSnapshot.cs
        ├── Models/
        │   ├── Postulacion.cs
        │   ├── Requisito.cs
        │   └── Vacante.cs
        ├── obj/
        │   ├── project.assets.json
        │   ├── project.nuget.cache
        │   ├── RecruitmentAPI.csproj.nuget.dgspec.json
        │   ├── RecruitmentAPI.csproj.nuget.g.props
        │   ├── RecruitmentAPI.csproj.nuget.g.targets
        │   └── Debug/
        │       └── net8.0/
        │           ├── apphost
        │           ├── Recruitm.E6D0A455.Up2Date
        │           ├── RecruitmentAPI.AssemblyInfo.cs
        │           ├── RecruitmentAPI.AssemblyInfoInputs.cache
        │           ├── RecruitmentAPI.assets.cache
        │           ├── RecruitmentAPI.csproj.AssemblyReference.cache
        │           ├── RecruitmentAPI.csproj.CoreCompileInputs.cache
        │           ├── RecruitmentAPI.csproj.FileListAbsolute.txt
        │           ├── RecruitmentAPI.GeneratedMSBuildEditorConfig.editorconfig
        │           ├── RecruitmentAPI.genruntimeconfig.cache
        │           ├── RecruitmentAPI.GlobalUsings.g.cs
        │           ├── RecruitmentAPI.MvcApplicationPartsAssemblyInfo.cache
        │           ├── RecruitmentAPI.MvcApplicationPartsAssemblyInfo.cs
        │           ├── staticwebassets.build.json
        │           ├── .NETCoreApp,Version=v8.0.AssemblyAttributes.cs
        │           ├── ref/
        │           ├── refint/
        │           └── staticwebassets/
        │               ├── msbuild.build.RecruitmentAPI.props
        │               ├── msbuild.buildMultiTargeting.RecruitmentAPI.props
        │               └── msbuild.buildTransitive.RecruitmentAPI.props
        ├── Properties/
        │   └── launchSettings.json
        ├── Repositories/
        │   ├── PostulacionRepository.cs
        │   ├── VacanteRepository.cs
        │   └── Interfaces/
        │       ├── IPostulacionRepository.cs
        │       └── IVacanteRepository.cs
        ├── Services/
        │   ├── PostulacionService.cs
        │   ├── VacanteService.cs
        │   └── Interfaces/
        │       ├── IPostulacionService.cs
        │       └── IVacanteService.cs
        └── Storage/
            └── CVs/


================================================
FILE: README.md
================================================
# Kanban Board



================================================
FILE: arquitectura.txt
================================================
RecruitmentAPI/
│
├── Controllers/                  # 🎯 Entry point — receives HTTP requests
│   └── VacantesController.cs     #    POST /api/vacantes, GET /api/vacantes, etc.
│
├── Services/                     # 🧠 Business logic lives HERE
│   ├── Interfaces/
│   │   └── IVacanteService.cs    #    Contract: "what can we DO with vacantes?"
│   └── VacanteService.cs         #    Implementation: the actual logic
│
├── Repositories/                 # 💾 Talks to the database, nothing else
│   ├── Interfaces/
│   │   └── IVacanteRepository.cs
│   └── VacanteRepository.cs
│
├── Models/                       # 📦 Our domain entities (tables in DB)
│   ├── Vacante.cs                #    The job posting itself
│   └── Requisito.cs              #    Requirements/tags for each vacante
│
├── DTOs/                         # 📬 What we SEND and RECEIVE (not raw entities)
│   ├── CreateVacanteDTO.cs       #    What the frontend sends to create one
│   └── VacanteResponseDTO.cs     #    What we send back to the frontend
│
├── Data/                         # 🔌 EF Core database context & config
│   ├── AppDbContext.cs
│   └── Configurations/
│       ├── VacanteConfiguration.cs    # Fluent API config for Vacante table
│       └── RequisitoConfiguration.cs
│
├── Mappings/                     # 🔄 Entity ↔ DTO conversion
│   └── VacanteMappingProfile.cs  #    (we can use AutoMapper or manual)
│
├── Migrations/                   # 🏗️ EF Core auto-generated migrations
│
├── Storage/                      # 📂 Where uploaded CVs will live (local)
│   └── (CVs go here later)
│
├── Program.cs                    # 🚀 App entry point + DI registration
├── appsettings.json              # ⚙️ Connection strings, config
└── RecruitmentAPI.csproj


recruitment-frontend/
│
├── public/
│   └── index.html
│
├── src/
│   ├── api/                      # 🌐 All HTTP calls to backend
│   │   └── vacantesApi.js        #    createVacante(), getVacantes(), etc.
│   │
│   ├── components/               # 🧩 Reusable UI pieces
│   │   ├── common/               #    Buttons, Inputs, Modals, etc.
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   └── vacantes/             #    Vacante-specific components
│   │       ├── VacanteCard.jsx   #    One job posting card
│   │       ├── VacanteForm.jsx   #    Form to create/edit vacante
│   │       └── VacanteList.jsx   #    Grid/list of all vacantes
│   │
│   ├── pages/                    # 📄 Full page views (routes)
│   │   ├── AdminVacantesPage.jsx #    Recruiter: manage vacantes
│   │   └── PublicVacantesPage.jsx#    Candidates: see & apply
│   │
│   ├── hooks/                    # 🪝 Custom React hooks
│   │   └── useVacantes.js        #    Fetch, create, delete logic
│   │
│   ├── context/                  # 🌍 Global state (later: auth, etc.)
│   │
│   ├── layouts/                  # 📐 Page wrappers (navbar, footer)
│   │   └── MainLayout.jsx
│   │
│   ├── App.jsx                   # 🛣️ Router setup
│   ├── main.jsx                  # 🚀 React entry point
│   └── index.css                 # 🎨 Tailwind imports
│
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js                # ⚡ Using Vite (fast dev server)
└── package.json


[Recruiter fills form in React]
        │
        ▼
  VacanteForm.jsx  →  vacantesApi.js  →  POST /api/vacantes
        │                                        │
        │                                        ▼
        │                              VacantesController.cs
        │                                        │
        │                                        ▼
        │                              IVacanteService.cs
        │                              VacanteService.cs
        │                                (validates, maps DTO → Entity)
        │                                        │
        │                                        ▼
        │                              IVacanteRepository.cs
        │                              VacanteRepository.cs
        │                                (saves to PostgreSQL)
        │                                        │
        │                                        ▼
        │                                  PostgreSQL 💾
        │                                        │
        ▼                                        ▼
  UI updates with                     Returns VacanteResponseDTO
  new vacante card                    back up the chain



┌──────────────────────────┐         ┌──────────────────────────┐
│         vacantes         │         │        requisitos         │
├──────────────────────────┤         ├──────────────────────────┤
│ Id (PK, UUID)            │────┐    │ Id (PK, UUID)            │
│ Titulo (varchar 200)     │    │    │ VacanteId (FK → vacantes)│
│ Descripcion (text)       │    └───>│ Descripcion (varchar 500)│
│ Ubicacion (varchar 200)  │         │ CreatedAt (timestamptz)  │
│ TipoContrato (varchar)   │         └──────────────────────────┘
│ SalarioMin (decimal?)    │
│ SalarioMax (decimal?)    │           1 vacante → N requisitos
│ EstaActiva (bool)        │
│ CreatedAt (timestamptz)  │
│ UpdatedAt (timestamptz)  │
└──────────────────────────┘


┌──────────────────────────┐         ┌──────────────────────────┐
│         vacantes         │         │      postulaciones        │
├──────────────────────────┤         ├──────────────────────────┤
│ Id (PK, UUID)            │────┐    │ Id (PK, UUID)            │
└──────────────────────────┘    │    │ VacanteId (FK → vacantes)│
                                └───>│ NombreCandidato (varchar)│
                                     │ Email (varchar 200)      │
                                     │ Telefono (varchar 20)    │
                                     │ CvFileName (varchar 300) │
                                     │ CvFilePath (varchar 500) │
                                     │ CreatedAt (timestamptz)  │
                                     └──────────────────────────┘

                                       1 vacante → N postulaciones


RELATIONSHIPS
─────────────────────────────────────────────────────────────────
 vacantes  ──< requisitos    via VacanteId   ON DELETE CASCADE
 vacantes  ──< postulaciones via VacanteId   ON DELETE CASCADE

INDEXES
─────────────────────────────────────────────────────────────────
 IX_requisitos_VacanteId       on requisitos(VacanteId)
 IX_postulaciones_VacanteId    on postulaciones(VacanteId)

MIGRATIONS APPLIED
─────────────────────────────────────────────────────────────────
 20260221213705_InitialCreate      → vacantes, requisitos
 20260225130843_AddPostulaciones   → postulaciones
