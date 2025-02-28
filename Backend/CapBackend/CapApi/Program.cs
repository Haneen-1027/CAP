using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CapApi.Data;
using CapApi.Services;
using CapApi.Models;
using Microsoft.OpenApi.Models;
using CapApi.Services.User;
using CapApi.Services.Question;
using CapApi.Services.Assessment;

var builder = WebApplication.CreateBuilder(args);

// Load JWT settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.SecretKey))
{
    throw new InvalidOperationException("JWT SecretKey is missing in configuration.");
}

// Database Connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddSwaggerGen(options =>

{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Add security definition and requirement for JWT authentication
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme

    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});


// Register user services
builder.Services.AddScoped<GetAllUsersService>();
builder.Services.AddScoped<GetUserByIdService>();
builder.Services.AddScoped<CreateUserService>();
builder.Services.AddScoped<UpdateUserService>();
builder.Services.AddScoped<DeleteUserService>();

// Register Question services
builder.Services.AddScoped<AddQuestionRequestService>();
builder.Services.AddScoped<DeleteQuestionService>();
builder.Services.AddScoped<PreviewByCategoryService>();
builder.Services.AddScoped<PreviewByIdService>();
builder.Services.AddScoped<UpdateQuestionService>();

// Register Question services
builder.Services.AddScoped<AddAssessmentService>();
builder.Services.AddScoped<DeleteAssessmentService>();
builder.Services.AddScoped<GetAssessmentByIdService>();
builder.Services.AddScoped<UpdateAssessmentService>();
builder.Services.AddScoped<GetAllAssessmentService>();


// JWT Authentication
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
        };
    });

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", corsPolicyBuilder =>
    {
        corsPolicyBuilder.WithOrigins("*") // Replace with actual frontend URL
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// Register Services
builder.Services.AddScoped<JwtTokenGenerator>();
builder.Services.AddControllers();
// new by haneen
builder.Services.AddHttpClient<Judge0Service>(); // Register Judge0Service

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowAll");
app.MapControllers();

app.Run();