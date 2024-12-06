using Azure.Core;
using MelloApp.Server.Data;
using MelloApp.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Services;

public class SeedData
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public SeedData(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _context = context;
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
        string firstName = "AdminMartin";
        string lastName = "AdminOlsson";
        string email = "admin@admin.com";
        string password = "asdf12";

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
                    AvatarImageUrl = "/uploads/avatars/default-avatar.png"
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
            "Linnea Henriksson", "Meira Omar", "Maja Ivarsson", "Albin Johnsén feat. Pa", "John Lundvik", "Adrian Macéus",
            "SCHLAGERZ", "Nomi Tales", "Klara Hammarström", "Kaliffa", "Erik Segerstedt", "Fredrik Lundman",
            "Malou Prytz", "Greczula", "Annika Wickihalder", "Björn Holmgren", "Angelino", "Dolly Style",
            "KAJ", "Ella Tiritiello", "AmenA", "Måns Zelmerlöw", "Andreas Lundstedt", "Tennessee Tears",
            "Saga Ludvigsson", "Vilhelm Buchaus", "Victoria Silvstedt", "Arvingarna", "SCARLET", "Arwin"
        };

        string[] songNames = {
            "Den känslan", "Hush Hush", "Kamikaze Life", "Upp i luften", "Voice of the Silent", "Vår första gång",
            "Don Juan", "Funniest Thing", "On and On and On", "Salute", "Show Me What Love Is", "The Heart of a Swedish Cowboy",
            "24K Gold", "Believe Me", "Life Again", "Rädda mig", "Teardrops", "YIHAA",
            "Bara bada bastu", "Bara du är där", "De Good Be Better", "Revolution", "Vicious", "Yours",
            "Hate You So Much", "I'm Yours", "Love It!", "Ring baby ring", "Sweet N' Psycho", "This Dream of Mine"
        };


        if (_context.Artists.Any())
        {
            return;
        }


        var subCompetitions = await _context.SubCompetitions.ToListAsync();

        int startingNumber = 1;

        // Add starting number 1-5 to each artist that are part of a subcompetition

        for (int i = 0; i < artistNames.Length; i++)
        {
            string artistName = $"{artistNames[i]}";
            string songName = $"{songNames[i]}";

            var artist = new Artist
            {
                Name = artistName,
                Song = songName,
                StartingNumber = startingNumber,
                SubCompetitionId = subCompetitions[i % subCompetitions.Count].Id

            };

            await _context.AddAsync(artist);
            await _context.SaveChangesAsync();

            startingNumber++;
            if(startingNumber > 6)
            {
                startingNumber = 1;
            }
        }
    }
}

