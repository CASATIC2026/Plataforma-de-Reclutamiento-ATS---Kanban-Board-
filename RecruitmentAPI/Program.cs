using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.Repositories;
using RecruitmentAPI.Repositories.Interfaces;
using RecruitmentAPI.Services;
using RecruitmentAPI.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// --- SERVICES REGISTRATION ---

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository layer
builder.Services.AddScoped<IVacanteRepository, VacanteRepository>();
builder.Services.AddScoped<IPostulacionRepository, PostulacionRepository>();

// Service layer
builder.Services.AddScoped<IVacanteService, VacanteService>();
builder.Services.AddScoped<IPostulacionService, PostulacionService>();

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- MIDDLEWARE PIPELINE ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();