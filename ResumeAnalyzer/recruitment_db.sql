-- ============================================================
-- RECRUITMENT KANBAN SYSTEM - MySQL Database Schema
-- Compatible with Entity Framework Core (Code-First reference)
-- ============================================================

CREATE DATABASE IF NOT EXISTS RecruitmentDB
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE RecruitmentDB;

-- ============================================================
-- 1. USERS (Reclutadores / Admins)
-- ============================================================
CREATE TABLE Users (
    Id              INT AUTO_INCREMENT PRIMARY KEY,
    FullName        VARCHAR(150)    NOT NULL,
    Email           VARCHAR(255)    NOT NULL UNIQUE,
    PasswordHash    VARCHAR(512)    NOT NULL,
    Role            ENUM('Admin', 'Recruiter', 'Viewer') NOT NULL DEFAULT 'Recruiter',
    IsActive        TINYINT(1)      NOT NULL DEFAULT 1,
    CreatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX IX_Users_Email (Email)
) ENGINE=InnoDB;

-- ============================================================
-- 2. VACANCIES (Vacantes)
-- ============================================================
CREATE TABLE Vacancies (
    Id              INT AUTO_INCREMENT PRIMARY KEY,
    Title           VARCHAR(200)    NOT NULL,
    Description     TEXT            NOT NULL,
    Location        VARCHAR(200)    NULL,
    SalaryMin       DECIMAL(12,2)   NULL,
    SalaryMax       DECIMAL(12,2)   NULL,
    ContractType    ENUM('FullTime', 'PartTime', 'Contract', 'Internship') NOT NULL DEFAULT 'FullTime',
    Status          ENUM('Draft', 'Published', 'Closed') NOT NULL DEFAULT 'Draft',
    PublishedAt     DATETIME        NULL,
    ClosedAt        DATETIME        NULL,
    CreatedByUserId INT             NOT NULL,
    CreatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX IX_Vacancies_Status (Status),
    INDEX IX_Vacancies_CreatedBy (CreatedByUserId),

    CONSTRAINT FK_Vacancies_CreatedBy
        FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 3. VACANCY REQUIREMENTS (Requisitos de la Vacante)
-- ============================================================
CREATE TABLE VacancyRequirements (
    Id              INT AUTO_INCREMENT PRIMARY KEY,
    VacancyId       INT             NOT NULL,
    Description     VARCHAR(500)    NOT NULL,
    IsRequired      TINYINT(1)      NOT NULL DEFAULT 1,  -- 1 = obligatorio, 0 = deseable
    SortOrder       INT             NOT NULL DEFAULT 0,

    INDEX IX_VacReq_VacancyId (VacancyId),

    CONSTRAINT FK_VacReq_Vacancy
        FOREIGN KEY (VacancyId) REFERENCES Vacancies(Id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. KANBAN COLUMNS (Columnas dinámicas por Vacante)
-- ============================================================
CREATE TABLE KanbanColumns (
    Id              INT AUTO_INCREMENT PRIMARY KEY,
    VacancyId       INT             NOT NULL,
    Name            VARCHAR(100)    NOT NULL,
    SortOrder       INT             NOT NULL DEFAULT 0,
    ColumnType      ENUM('Initial', 'Normal', 'Advancement', 'Rejection', 'Hired') NOT NULL DEFAULT 'Normal',
    Color           VARCHAR(7)      NULL DEFAULT '#6B7280',  -- hex color para UI
    CreatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX IX_KanbanCol_Vacancy (VacancyId, SortOrder),

    CONSTRAINT FK_KanbanCol_Vacancy
        FOREIGN KEY (VacancyId) REFERENCES Vacancies(Id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. CANDIDATES (Candidatos - datos personales)
-- ============================================================
CREATE TABLE Candidates (
    Id              INT AUTO_INCREMENT PRIMARY KEY,
    FirstName       VARCHAR(100)    NOT NULL,
    LastName        VARCHAR(100)    NOT NULL,
    Email           VARCHAR(255)    NOT NULL UNIQUE,
    Phone           VARCHAR(30)     NULL,
    LinkedInUrl     VARCHAR(500)    NULL,
    CreatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX IX_Candidates_Email (Email)
) ENGINE=InnoDB;

-- ============================================================
-- 6. APPLICATIONS (Postulaciones - une Candidato + Vacante)
-- ============================================================
CREATE TABLE Applications (
    Id                  INT AUTO_INCREMENT PRIMARY KEY,
    VacancyId           INT             NOT NULL,
    CandidateId         INT             NOT NULL,
    KanbanColumnId      INT             NOT NULL,
    SortOrderInColumn   INT             NOT NULL DEFAULT 0,  -- orden de la tarjeta dentro de la columna
    CvFileName          VARCHAR(255)    NOT NULL,
    CvFilePath          VARCHAR(500)    NOT NULL,             -- ruta en disco/blob
    CvTextContent       TEXT            NULL,                 -- texto extraído del PDF para búsqueda
    CoverLetter         TEXT            NULL,
    AppliedAt           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX IX_App_Vacancy (VacancyId),
    INDEX IX_App_Candidate (CandidateId),
    INDEX IX_App_KanbanCol (KanbanColumnId),
    INDEX IX_App_VacancyColumn (VacancyId, KanbanColumnId, SortOrderInColumn),

    -- Búsqueda full-text en el contenido del CV
    FULLTEXT IX_App_CvSearch (CvTextContent),

    -- Un candidato solo puede postular una vez a cada vacante
    CONSTRAINT UQ_App_Vacancy_Candidate UNIQUE (VacancyId, CandidateId),

    CONSTRAINT FK_App_Vacancy
        FOREIGN KEY (VacancyId) REFERENCES Vacancies(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_App_Candidate
        FOREIGN KEY (CandidateId) REFERENCES Candidates(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_App_KanbanColumn
        FOREIGN KEY (KanbanColumnId) REFERENCES KanbanColumns(Id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 7. APPLICATION STATUS HISTORY (Historial de movimientos)
--    Cada vez que se arrastra una tarjeta, queda registrado.
-- ============================================================
CREATE TABLE ApplicationStatusHistory (
    Id                  INT AUTO_INCREMENT PRIMARY KEY,
    ApplicationId       INT             NOT NULL,
    FromColumnId        INT             NULL,       -- NULL = primera asignación
    ToColumnId          INT             NOT NULL,
    MovedByUserId       INT             NULL,       -- NULL = sistema (postulación inicial)
    Notes               VARCHAR(500)    NULL,
    MovedAt             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX IX_StatusHist_App (ApplicationId),
    INDEX IX_StatusHist_Date (MovedAt),

    CONSTRAINT FK_StatusHist_App
        FOREIGN KEY (ApplicationId) REFERENCES Applications(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_StatusHist_FromCol
        FOREIGN KEY (FromColumnId) REFERENCES KanbanColumns(Id)
        ON DELETE SET NULL,

    CONSTRAINT FK_StatusHist_ToCol
        FOREIGN KEY (ToColumnId) REFERENCES KanbanColumns(Id)
        ON DELETE RESTRICT,

    CONSTRAINT FK_StatusHist_User
        FOREIGN KEY (MovedByUserId) REFERENCES Users(Id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 8. EMAIL NOTIFICATIONS LOG (Registro de correos enviados)
-- ============================================================
CREATE TABLE EmailNotifications (
    Id                  INT AUTO_INCREMENT PRIMARY KEY,
    ApplicationId       INT             NOT NULL,
    RecipientEmail      VARCHAR(255)    NOT NULL,
    Subject             VARCHAR(300)    NOT NULL,
    Body                TEXT            NOT NULL,
    EmailType           ENUM('Rejection', 'Advancement', 'Hired', 'Custom') NOT NULL,
    Status              ENUM('Pending', 'Sent', 'Failed') NOT NULL DEFAULT 'Pending',
    SentAt              DATETIME        NULL,
    ErrorMessage        VARCHAR(500)    NULL,
    CreatedAt           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX IX_EmailNotif_App (ApplicationId),
    INDEX IX_EmailNotif_Status (Status),

    CONSTRAINT FK_EmailNotif_App
        FOREIGN KEY (ApplicationId) REFERENCES Applications(Id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 9. EMAIL TEMPLATES (Plantillas configurables)
-- ============================================================
CREATE TABLE EmailTemplates (
    Id              INT AUTO_INCREMENT PRIMARY KEY,
    Name            VARCHAR(100)    NOT NULL,
    EmailType       ENUM('Rejection', 'Advancement', 'Hired', 'Custom') NOT NULL,
    Subject         VARCHAR(300)    NOT NULL,
    BodyTemplate    TEXT            NOT NULL,  -- Soporta placeholders: {{CandidateName}}, {{VacancyTitle}}, {{ColumnName}}
    IsDefault       TINYINT(1)      NOT NULL DEFAULT 0,
    CreatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX IX_EmailTpl_Type (EmailType)
) ENGINE=InnoDB;

-- ============================================================
-- 10. SEED DATA - Plantillas de email por defecto
-- ============================================================
INSERT INTO EmailTemplates (Name, EmailType, Subject, BodyTemplate, IsDefault) VALUES
(
    'Rechazo Estándar',
    'Rejection',
    'Actualización sobre tu postulación a {{VacancyTitle}}',
    'Hola {{CandidateName}},\n\nGracias por tu interés en la posición de {{VacancyTitle}}.\n\nDespués de una cuidadosa evaluación, hemos decidido avanzar con otros candidatos cuyo perfil se ajusta más a los requisitos actuales.\n\nTe animamos a seguir atento/a a futuras oportunidades.\n\nSaludos cordiales,\nEquipo de Reclutamiento',
    1
),
(
    'Avance de Etapa',
    'Advancement',
    '¡Buenas noticias! Avanzas en el proceso para {{VacancyTitle}}',
    'Hola {{CandidateName}},\n\n¡Nos complace informarte que has avanzado a la etapa de {{ColumnName}} en el proceso de selección para {{VacancyTitle}}!\n\nPronto nos pondremos en contacto contigo con los siguientes pasos.\n\nSaludos cordiales,\nEquipo de Reclutamiento',
    1
),
(
    'Oferta / Contratación',
    'Hired',
    '¡Felicidades! Oferta para {{VacancyTitle}}',
    'Hola {{CandidateName}},\n\n¡Felicidades! Nos complace informarte que has sido seleccionado/a para la posición de {{VacancyTitle}}.\n\nNos pondremos en contacto contigo para los detalles de la oferta.\n\n¡Bienvenido/a al equipo!\nEquipo de Reclutamiento',
    1
);

-- ============================================================
-- 11. SEED DATA - Usuario admin inicial
-- ============================================================
INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES
('Administrador', 'admin@recruitment.com', '<<REPLACE_WITH_BCRYPT_HASH>>', 'Admin');

-- ============================================================
-- EJEMPLO: Crear una vacante con columnas Kanban default
-- (Esto normalmente lo haría el Service en C#)
-- ============================================================

-- INSERT INTO Vacancies (Title, Description, Status, CreatedByUserId) VALUES
-- ('Desarrollador Full Stack', 'Buscamos desarrollador con experiencia en .NET y React...', 'Published', 1);

-- SET @vacId = LAST_INSERT_ID();

-- INSERT INTO KanbanColumns (VacancyId, Name, SortOrder, ColumnType, Color) VALUES
-- (@vacId, 'Nuevo',         0, 'Initial',     '#3B82F6'),
-- (@vacId, 'En Revisión',   1, 'Normal',      '#F59E0B'),
-- (@vacId, 'Entrevista',    2, 'Advancement',  '#8B5CF6'),
-- (@vacId, 'Prueba Técnica', 3, 'Advancement', '#EC4899'),
-- (@vacId, 'Oferta',        4, 'Hired',        '#10B981'),
-- (@vacId, 'Rechazado',     5, 'Rejection',    '#EF4444');

-- ============================================================
-- CONSULTAS ÚTILES DE REFERENCIA
-- ============================================================

-- Kanban board completo para una vacante:
-- SELECT kc.Id, kc.Name, kc.SortOrder, kc.ColumnType, kc.Color,
--        a.Id AS AppId, c.FirstName, c.LastName, c.Email, a.SortOrderInColumn
-- FROM KanbanColumns kc
-- LEFT JOIN Applications a ON a.KanbanColumnId = kc.Id
-- LEFT JOIN Candidates c ON c.Id = a.CandidateId
-- WHERE kc.VacancyId = @vacId
-- ORDER BY kc.SortOrder, a.SortOrderInColumn;

-- Búsqueda full-text en CVs:
-- SELECT a.Id, c.FirstName, c.LastName, 
--        MATCH(a.CvTextContent) AGAINST('python react sql' IN BOOLEAN MODE) AS Relevance
-- FROM Applications a
-- JOIN Candidates c ON c.Id = a.CandidateId
-- WHERE a.VacancyId = @vacId
--   AND MATCH(a.CvTextContent) AGAINST('python react sql' IN BOOLEAN MODE)
-- ORDER BY Relevance DESC;