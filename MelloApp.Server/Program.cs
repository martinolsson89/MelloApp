
using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Mappings;
using MelloApp.Server.Models;
using MelloApp.Server.Repositories;
using MelloApp.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

            builder.Services.AddScoped<ISubCompetitionRepository, SubCompetitionRepository>();
            builder.Services.AddScoped<IRepository<Artist>, ArtistRepository>();
            builder.Services.AddScoped<IRepository<ScoreAfterSubCompetition>, ScoreAfterSubCompetitionRepository>();
            builder.Services.AddScoped<IRepository<ResultOfSubCompetition>, ResultOfSubCompetitionRepository>();
            builder.Services.AddScoped<IPredictionRepository, PredictionRepository>();
            builder.Services.AddScoped<IRepository<Leaderboard>, LeaderboardRepository>();
            builder.Services.AddScoped<IRepository<ApplicationUser>, UserRepository>();
            builder.Services.AddScoped<IFinalPredictionRepository, FinalPredictionRepository>();


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


            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Content-Type", "text/html; charset=utf-8");
                }
            });

            app.MapIdentityApi<ApplicationUser>();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

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
