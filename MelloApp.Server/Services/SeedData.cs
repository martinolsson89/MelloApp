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
        string[] firstNames = { "Frida", "Lena", "Joakim", "Bjorn", "Eva", "Ove", "Rebecka" };

        for (int i = 0; i < 6; i++)
        {
            string firstName = $"{firstNames[i]}";
            string lastName = "User" + i;
            string email = $"{firstNames[i]}" + "@user.com";
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

                await _userManager.AddToRoleAsync(user, "User");
            }
        }
    }

    private async Task CreateRandomSubcompetitions()
    {
        // Add code here to create random subcompetitions
        string[] competitionNames = { "Deltävling 1", "Deltävling 2", "Deltävling 3"};
        string[] locationNames = { "Stockholm", "Göteborg", "Malmö"};

        for (int i = 0; i < competitionNames.Length; i++)
        {
            string competitionName = $"{competitionNames[i]}";
            //Generate random date between 2024-03-01 and 2024-04-01
            Random random = new Random();
            DateTime start = new DateTime(2024, 3, 1);
            int range = (new DateTime(2024, 4, 1) - start).Days;
            DateTime competitionDate = start.AddDays(random.Next(range));
            string competitionLocation = $"{locationNames[i]}";

            
                var subCompetition = new SubCompetition
                {
                    Name = competitionName,
                    Date = competitionDate,
                    Location = competitionLocation
                };

                await _context.AddAsync(subCompetition);
                await _context.SaveChangesAsync();
        }
    }

    private async Task CreateRandomArtists()
    {
        // Add code here to create 15 random artists with names of swedish artists

        string[] artistNames = { "Abba", "Avicii", "Zara Larsson", "Tove Lo", "Robyn", "Lykke Li", "First Aid Kit", "Icona Pop", "The Hives", "The Cardigans", "The Sounds", "The Knife", "Miike Snow", "Little Dragon", "Peter Bjorn and John", "The Tallest" };
        string[] songNames =
        {
            "Dancing Queen", "Wake Me Up", "Lush Life", "Habits", "Dancing On My Own", "I Follow Rivers",
            "My Silver Lining", "I Love It", "Hate To Say I Told You So", "Lovefool", "Living In America", "Heartbeats",
            "Animal", "Ritual Union", "Young Folks"
        };

        var subCompetitions = await _context.SubCompetitions.ToListAsync();

        int startingNumber = 1;

        // Add starting number 1-5 to each artist that are part of a subcompetition

        for (int i = 0; i < 15; i++)
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
            if(startingNumber > 5)
            {
                startingNumber = 1;
            }
        }
    }
}

