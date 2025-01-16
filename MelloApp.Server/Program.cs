
using System.Text.Json.Serialization;
using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Mappings;
using MelloApp.Server.Models;
using MelloApp.Server.Repositories;
using MelloApp.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

namespace MelloApp.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException();
            builder.Services.AddDbContext<ApplicationDbContext>(options => 
                options.UseSqlServer(connectionString));

            //Repositories
            builder.Services.AddScoped<ISubCompetitionRepository, SubCompetitionRepository>();
            builder.Services.AddScoped<IRepository<Artist>, ArtistRepository>();
            builder.Services.AddScoped<IResultOfSubCompetitionRepository, ResultOfSubCompetitionRepository>();
            builder.Services.AddScoped<IPredictionRepository, PredictionRepository>();
            builder.Services.AddScoped<IRepository<Leaderboard>, LeaderboardRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IFinalPredictionRepository, FinalPredictionRepository>();
            builder.Services.AddScoped<IScoreAfterSubCompetitionRepository, ScoreAfterSubCompetitionRepository>();
            builder.Services.AddScoped<AccountRepository>();


            //Services
            builder.Services.AddScoped<PointsCalculationService>();
            builder.Services.AddScoped<LeaderboardService>();
            builder.Services.AddTransient<IEmailSender, SendGridEmailSender>();




            builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));


            builder.Services.AddAuthorization();

            builder.Services.AddIdentityApiEndpoints<ApplicationUser>(option =>
                {
                    option.SignIn.RequireConfirmedAccount = false;

                    option.Password.RequiredLength = 6;
                    option.Password.RequireDigit = false;
                    option.Password.RequireNonAlphanumeric = false;
                    option.Password.RequireUppercase = false;
                })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            // Register SeedData service
            builder.Services.AddTransient<SeedData>();
            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });


            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Add CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("https://localhost:5173", "https://app-melloapp-001.azurewebsites.net/", "https://www.slaktkampen.se/", "https://slaktkampen.se/") // Your frontend URL
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials(); // If using cookies
                });
            });



            var app = builder.Build();

            app.UseDefaultFiles();

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Content-Type", "text/html; charset=utf-8");
                }
            });

            //// Enable serving files from the 'uploads' folder
            //app.UseStaticFiles(new StaticFileOptions
            //{
            //    FileProvider = new PhysicalFileProvider(
            //        Path.Combine(builder.Environment.ContentRootPath, "uploads", "avatars")),
            //    RequestPath = "/uploads/avatars"
            //});

            app.UseStaticFiles(); // the default static file middleware


            app.MapIdentityApi<ApplicationUser>();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(); // Enable CORS

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            // Seed data
            using (var scope = app.Services.CreateScope())
            {
                var seedData = scope.ServiceProvider.GetRequiredService<SeedData>();
                await seedData.InitializeData();
            }

            app.Run();
        }
    }
}
