using Azure.Core;
using MelloApp.Server.Data;
using MelloApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using EnvironmentName = Microsoft.AspNetCore.Hosting.EnvironmentName;

namespace MelloApp.Server.Services;

public class SeedData
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;  // store environment

    public SeedData(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager, ApplicationDbContext context, IWebHostEnvironment env)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _context = context;
        _env = env;
    }

    public async Task InitializeData()
    {
        await CreateRoles();
        await CreateAdminUser();
        //await CreateRandomUsers();
        //await CreateRandomSubcompetitions();
        //await CreateRandomArtists();
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
        string firstName = "Mello";
        string lastName = "Admin";
        string email = "admin@slaktkampen.se";
        string password = "sadiomane123";

        if (await _userManager.FindByEmailAsync(email) == null)
        {
            var user = new ApplicationUser
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

        
        var defaultAvatarBlobUrl = "https://melloappstorage.blob.core.windows.net/profile-pictures/default-avatar.png";

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
        string[] competitionNames = { "Deltävling 1", "Deltävling 2", "Deltävling 3", "Deltävling 4", "Deltävling 5"};
        string[] locationNames = { "Luleå", "Göteborg", "Västerås", "Malmö", "Jönköping"};

        // Dates for the subcompetitions
        DateTime[] competitionDates = { new DateTime(2025, 2, 1), new DateTime(2025, 2, 8), new DateTime(2025, 2, 15), new DateTime(2025, 2, 22), new DateTime(2025, 3, 1) };

        // Time for the subcompetitions
        TimeSpan competitionTime = new TimeSpan(20, 0, 0); // 8 PM

        // Add subcompetitions with names, dates and locations to the database if subcompetitions entity is empty
        if (_context.SubCompetitions.Any())
        {
            return;
        }



        for (int i = 0; i < competitionNames.Length; i++)
        {
            string competitionName = $"{competitionNames[i]}";
            DateTime competitionDateTime = competitionDates[i].Date + competitionTime;
            string competitionLocation = $"{locationNames[i]}";

            var subCompetition = new SubCompetition
            {
                Name = competitionName,
                Date = competitionDateTime,
                Location = competitionLocation
            };

            await _context.AddAsync(subCompetition);
            await _context.SaveChangesAsync();
        }
    }

    private async Task CreateRandomArtists()
    {
        // Add code here to create 30 random artists with names

        string[] artistNames = {
            "Albin Johnsén feat. Pa", "Maja Ivarsson", "John Lundvik", "Meira Omar", "Adrian Macéus", "Linnea Henriksson",
            "Nomi Tales", "SCHLAGERZ", "Erik Segerstedt", "Klara Hammarström", "Fredrik Lundman", "Kaliffa",
            "Greczula", "Malou Prytz", "Björn Holmgren", "Dolly Style", "Angelino", "Annika Wickihalder",
            "Andreas Lundstedt", "Ella Tiritiello", "Tennessee Tears", "KAJ", "AmenA", "Måns Zelmerlöw", 
            "Arvingarna", "Arwin", "Saga Ludvigsson", "Victoria Silvstedt", "Vilhelm Buchaus", "SCARLET"
        };

        string[] songNames = {
            "Upp i luften", "Kamikaze Life", "Voice of the Silent", "Hush Hush", "Vår första gång", "Den känslan",
            "Funniest Thing", "Don Juan", "Show Me What Love Is", "On and On and On", "The Heart of a Swedish Cowboy", "Salute",
            "Believe Me", "24K Gold", "Rädda mig", "YIHAA", "Teardrops", "Life Again",
            "Vicious", "Bara du är där", "Yours", "Bara bada bastu", "Do Good Be Better", "Revolution",
            "Ring baby ring", "This Dream of Mine", "Hate You So Much", "Love It!", "I'm Yours", "Sweet N' Psycho"
        };


        if (_context.Artists.Any())
        {
            return;
        }


        var subCompetitions = await _context.SubCompetitions
            .OrderBy(sc => sc.Date)
            .ToListAsync();



        int startingNumber = 1;
        int subCompetitionIndex = 0;

        for (int i = 0; i < artistNames.Length; i++)
        {
            string artistName = $"{artistNames[i]}";
            string songName = $"{songNames[i]}";

            var artist = new Artist
            {
                Name = artistName,
                Song = songName,
                StartingNumber = startingNumber,
                SubCompetitionId = subCompetitions[subCompetitionIndex].Id

            };

            await _context.AddAsync(artist);
            await _context.SaveChangesAsync();

            startingNumber++;
            if(startingNumber > 6)
            {
                startingNumber = 1;
                subCompetitionIndex++;
            }
        }
    }
}

