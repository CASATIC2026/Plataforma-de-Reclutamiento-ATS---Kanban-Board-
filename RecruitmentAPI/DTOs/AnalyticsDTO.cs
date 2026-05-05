namespace RecruitmentAPI.DTOs;

public class PipelineStageDTO
{
    public string Nombre { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Porcentaje { get; set; }
}

public class AnalyticsPipelineDTO
{
    public List<PipelineStageDTO> Stages { get; set; } = new();
}

public class TimeToHireItemDTO
{
    public string Ubicacion { get; set; } = string.Empty;
    public double PromedioDias { get; set; }
    public int TotalContratados { get; set; }
}

public class AnalyticsTimeToHireDTO
{
    public List<TimeToHireItemDTO> Items { get; set; } = new();
    public double PromedioGlobal { get; set; }
}

public class SourceStatsItemDTO
{
    public Guid VacanteId { get; set; }
    public string VacanteTitulo { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public int TotalPostulaciones { get; set; }
    public int Contratados { get; set; }
    public double TasaConversion { get; set; }
}

public class AnalyticsSourceDTO
{
    public List<SourceStatsItemDTO> Items { get; set; } = new();
}

public class TeamActivityItemDTO
{
    public Guid UsuarioId { get; set; }
    public string RecruiterNombre { get; set; } = string.Empty;
    public string RecruiterEmail { get; set; } = string.Empty;
    public int VacantesPublicadas { get; set; }
    public int PostulacionesRecibidas { get; set; }
    public int Contratados { get; set; }
}

public class AnalyticsTeamDTO
{
    public List<TeamActivityItemDTO> Items { get; set; } = new();
}

public class PlatformOverviewDTO
{
    public int TotalEmpresas { get; set; }
    public int TotalUsuarios { get; set; }
    public int TotalVacantes { get; set; }
    public int TotalPostulaciones { get; set; }
    public bool SistemaOk { get; set; } = true;
    public List<EmpresaResponseDTO> RecentEmpresas { get; set; } = new();
}
