namespace MelloApp.Tests;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MelloApp.Server.Data;
using MelloApp.Server.Enums;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Account;
using MelloApp.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class LeaderboardServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly LeaderboardService _service;

    public LeaderboardServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _context = new ApplicationDbContext(options);
        _service = new LeaderboardService(_context);

        SeedDatabase();
    }

    private void SeedDatabase()
    {
        // Add sample leaderboard entries
        _context.Leaderboards.Add(new Leaderboard { Id = "lead1", UserId = "user1", Points = 10 });
        _context.Leaderboards.Add(new Leaderboard { Id = "lead2", UserId = "user2", Points = 5 });

        // Add sample sub-competitions
        _context.SubCompetitions.Add(new SubCompetition { Id = "sub1", Name = "Sub Competition 1", Date = DateTime.Today, Location = "Stockholm"});
        _context.SaveChanges();

        // Add sample scores
        _context.ScoresAfterSubCompetitions.Add(new ScoreAfterSubCompetition
        {
            Id = "score1",
            UserId = "user1",
            Points = 20,
            SubCompetitionId = "sub1" // Ensure this is set
        });
        _context.ScoresAfterSubCompetitions.Add(new ScoreAfterSubCompetition
        {
            Id = "score2",
            UserId = "user2",
            Points = 15,
            SubCompetitionId = "sub1" // Ensure this is set
        });

        // Add sample results
        _context.ResultsOfSubCompetitions.Add(new ResultOfSubCompetition
        {
            Id = "result1",
            ArtistId = "artist1",
            Placement = ePlacement.Final,
            FinalPlacement = eFinalPlacement.Vinnare,
            SubCompetitionId = "sub1" // Ensure this is set
        });
        _context.ResultsOfSubCompetitions.Add(new ResultOfSubCompetition
        {
            Id = "result2",
            ArtistId = "artist2",
            Placement = ePlacement.FinalKval,
            FinalPlacement = eFinalPlacement.Tvåa,
            SubCompetitionId = "sub1" // Ensure this is set
        });

        // Add final predictions
        _context.FinalPredictions.Add(new FinalPrediction
        {
            Id = "final1",
            UserId = "user1",
            ArtistId = "artist1",
            FinalPredictedPlacement = eFinalPlacement.Vinnare,
            User = new ApplicationUser { FirstName = "John", LastName = "Doe", AvatarImageUrl = "avatar1.jpg" },
            SubCompetitionId = "sub1" // Ensure this is set
        });

        _context.SaveChanges();
    }

    [Fact]
    public async Task CalculateAndStoreFinalPoints_NoWinner_ReturnsNull()
    {
        // Arrange
        _context.ResultsOfSubCompetitions.RemoveRange(_context.ResultsOfSubCompetitions);
        await _context.SaveChangesAsync();

        // Act
        var result = await _service.CalculateAndStoreFinalPoints();

        // Assert
        Assert.Null(result);
    }
}
