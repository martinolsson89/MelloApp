
using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Mappings;
using MelloApp.Server.Models;
using MelloApp.Server.Repositories;
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

            builder.Services.AddScoped<IRepository<SubCompetition>, SubCompetitionRepository>();
            builder.Services.AddScoped<IRepository<Artist>, ArtistRepository>();
            builder.Services.AddScoped<IRepository<ScoreAfterSubCompetition>, ScoreAfterSubCompetitionRepository>();
            builder.Services.AddScoped<IRepository<ResultOfSubCompetition>, ResultOfSubCompetitionRepository>();
            builder.Services.AddScoped<IRepository<Prediction>, PredictionRepository>();
            builder.Services.AddScoped<IRepository<Leaderboard>, LeaderboardRepository>();
            builder.Services.AddScoped<IRepository<ApplicationUser>, UserRepository>();


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

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();
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
            // Create roles
            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                var roles = new[] { "Admin", "User" };

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }

            // Create admin user
            using (var scope = app.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

                string firstName = "AdminMartin";
                string lastName = "AdminOlsson";
                string email = "admin@admin.com";
                string password = "asdf12";

                if (await userManager.FindByEmailAsync(email) == null)
                {
                    var user = new ApplicationUser
                    {
                        FirstName = firstName,
                        LastName = lastName,
                        Email = email,
                        UserName = email
                    };

                    await userManager.CreateAsync(user, password);

                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }

            // Create six random users // POST: /Account/register

            using (var scope = app.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

                string[] firstNames = ["Frida", "Lena", "Joakim", "Bjorn", "Eva", "Ove", "Rebecka"];

                for (int i = 0; i < 6; i++)
                {
                    string firstName =$"{firstNames[i]}";
                    string lastName = "User" + i;
                    string email = $"{firstNames[i]}" + "@user.com";
                    string password = "asdf12";

                    if (await userManager.FindByEmailAsync(email) == null)
                    {
                        var user = new ApplicationUser
                        {
                            FirstName = firstName,
                            LastName = lastName,
                            Email = email,
                            UserName = email
                        };

                        await userManager.CreateAsync(user, password);

                        await userManager.AddToRoleAsync(user, "User");
                    }
                }
            }


            app.Run();
        }
    }
}
