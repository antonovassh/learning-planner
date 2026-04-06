using LearningPlanner.API.Configuration;
using LearningPlanner.Application.Abstractions;
using LearningPlanner.Application.Services;
using LearningPlanner.Infrastructure;
using LearningPlanner.Infrastructure.Repository;
using LearningPlanner.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure to load appsettings.Development.json in development environment
builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ILearningGoalRepository, LearningGoalRepository>();
builder.Services.AddScoped<ILearningTaskRepository, LearningTaskRepository>();
builder.Services.AddScoped<IGoalProgressService, GoalProgressService>();

// Add Auth services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITokenProvider>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var secret = config["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret is not configured");
    var issuer = config["Jwt:Issuer"] ?? "LearningPlanner";
    var audience = config["Jwt:Audience"] ?? "LearningPlannerAPI";
    var expiryMinutes = config.GetValue<int>("Jwt:ExpiryMinutes", 15);
    return new TokenProvider(secret, issuer, audience, expiryMinutes);
});
builder.Services.AddScoped<IAuthService, AuthService>();

// Configure JWT authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] 
    ?? throw new InvalidOperationException("Jwt:Secret is not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LearningPlanner";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LearningPlannerAPI";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

const string corsPolicyName = "Frontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// In Development, skip HTTPS redirect so http://localhost:5189 stays HTTP.
// Otherwise the browser follows 307 → https://7072 and CORS/preflight often breaks for the SPA on :5173.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(corsPolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();