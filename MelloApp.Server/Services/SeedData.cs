using Azure.Core;
using MelloApp.Server.Data;
using MelloApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json;


namespace MelloApp.Server.Services;

public class SeedData
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;  // store environment
    private readonly IConfiguration _config;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public SeedData(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager,
        ApplicationDbContext context, IWebHostEnvironment env, IConfiguration config)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _context = context;
        _env = env;
        _config = config;
    }

    public async Task InitializeData()
    {
        await CreateRoles();
        await CreateAdminUser();
        await CreateRandomUsers();
        await CreateRandomSubcompetitions();
        await CreateRandomArtists();
    }

    private async Task CreateRoles()
    {
        var roles = new[] { "Admin", "User" };

        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private async Task CreateAdminUser()
    {

        var email = _config["SeedAdmin:Email"];
        var password = _config["SeedAdmin:Password"];
        string firstName = "Mello";
        string lastName = "Admin";

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return;

       var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            user = new ApplicationUser
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                UserName = email
            };

            await _userManager.CreateAsync(user, password);

            await _userManager.AddToRoleAsync(user, "Admin");
        }
    }

    private async Task CreateRandomUsers()
    {
        string[] firstNames = { "Frida", "Lena", "Eva", "Ove"};
        string[] lastNames = { "Schylström", "Schylström", "Viberg", "Viberg" };


        var defaultAvatarBlobUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

        for (int i = 0; i < firstNames.Length; i++)
        {
            string firstName = $"{firstNames[i]}";
            string lastName = $"{lastNames[i]}";
            string email = $"{firstNames[i]}" + "@user.com";
            string password = "asdf12";

            if (await _userManager.FindByEmailAsync(email) == null)
            {
                var user = new ApplicationUser
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    UserName = email,
                    AvatarImageUrl = defaultAvatarBlobUrl
                    //AvatarImageUrl = "/uploads/avatars/default-avatar.png"
                };

                await _userManager.CreateAsync(user, password);

                await _userManager.AddToRoleAsync(user, "User");
            }
        }
    }

    private async Task CreateRandomSubcompetitions()
    {
        // Add subcompetitions with names, dates and locations to the database if subcompetitions entity is empty
        if (_context.SubCompetitions.Any())
        {
            return;
        }

        var items = await LoadSeedAsync<SubCompetitionSeedDto>(
        "Data/Seed/subcompetitions.json"
    );

        var entities = items.Select(x => new SubCompetition
        {
            Name = x.Name,
            Location = x.Location,
            Date = x.Date
        });

        await _context.SubCompetitions.AddRangeAsync(entities);
        await _context.SaveChangesAsync();
    }

    private async Task CreateRandomArtists()
    {
        if (_context.Artists.Any())
        {
            return;
        }

        var artistDtos = await LoadSeedAsync<ArtistSeedDto>(
        "Data/Seed/artists.json"
        );

        // Make sure subcompetitions exist
        var subCompetitions = await _context.SubCompetitions.ToListAsync();
        if (subCompetitions.Count == 0)
            throw new InvalidOperationException("No SubCompetitions found. Seed subcompetitions before artists.");

        // Map by name (case-insensitive)
        var subCompetitionByName = subCompetitions
            .GroupBy(sc => sc.Name.Trim(), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => g.First(), StringComparer.OrdinalIgnoreCase);

        var entities = new List<Artist>();

        foreach (var dto in artistDtos)
        {
            if (!subCompetitionByName.TryGetValue(dto.SubCompetitionName.Trim(), out var sc))
            {
                throw new InvalidOperationException(
                    $"Artist '{dto.Name}' references unknown subCompetitionName '{dto.SubCompetitionName}'. " +
                    "Check artists.json vs subcompetitions.json names."
                );
            }

            entities.Add(new Artist
            {
                Name = dto.Name,
                Song = dto.Song,
                ImageUrl = dto.ImageUrl,
                StartingNumber = dto.StartingNumber,
                SubCompetitionId = sc.Id
            });
        }

        await _context.Artists.AddRangeAsync(entities);
        await _context.SaveChangesAsync();
    }
    private async Task<List<T>> LoadSeedAsync<T>(string relativePath)
    {
        // relativePath example: "Data/Seed/artists.json"
        var fullPath = Path.Combine(_env.ContentRootPath, relativePath);

        if (!File.Exists(fullPath))
            throw new FileNotFoundException($"Seed file not found: {fullPath}");

        var json = await File.ReadAllTextAsync(fullPath);
        var data = JsonSerializer.Deserialize<List<T>>(json, _jsonOptions);

        return data ?? new List<T>();
    }
}

