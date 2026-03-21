
using LearningPlanner.Application.Abstractions;
using LearningPlanner.Application.Services;
using LearningPlanner.DataAccess;
using LearningPlanner.DataAccess.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<ILearningGoalRepository, LearningGoalRepository>();
builder.Services.AddScoped<ILearningTaskRepository, LearningTaskRepository>();
builder.Services.AddScoped<IGoalProgressService, GoalProgressService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();        
    app.UseSwaggerUI();     
}
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();


