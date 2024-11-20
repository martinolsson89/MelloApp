using MelloApp.Server.Data;
using MelloApp.Server.Enums;
using MelloApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Services;

public class PointsCalculationService
{
    private readonly ApplicationDbContext _context;

    public PointsCalculationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CalculateAndStorePointsAsync(string subCompetitionId)
    {
        var subCompetition = await _context.SubCompetitions
            .Include(sc => sc.Predictions)
            .ThenInclude(p => p.User)
            .Include(sc => sc.Predictions)
            .ThenInclude(p => p.Artist)
            .Include(sc => sc.Results)
            .ThenInclude(r => r.Artist)
            .FirstOrDefaultAsync(sc => sc.Id == subCompetitionId);

        if (subCompetition == null)
        {
            throw new Exception("SubCompetition not found");
        }

        // Create a lookup for artist results
        var artistResults = subCompetition.Results.ToDictionary(r => r.ArtistId, r => r.Placement);

        var userPoints = new Dictionary<string, int>();

        foreach (var prediction in subCompetition.Predictions)
        {
            var userId = prediction.UserId;
            if (!userPoints.ContainsKey(userId))
            {
                userPoints[userId] = 0;
            }

            if (artistResults.TryGetValue(prediction.Artist.Id, out var actualPlacement)) ;
            {
                int points = GetPointsForPrediction(prediction.PredictedPlacement, actualPlacement);
                userPoints[userId] += points;
            }
        }

        // Store points in ScoreAfterSubCompetition

        foreach (var kvp in userPoints)
        {
            var existingScore = await _context.ScoresAfterSubCompetitions
                .FirstOrDefaultAsync(s => s.UserId == kvp.Key && s.SubCompetitionId == subCompetitionId);

            if (existingScore == null)
            {
                existingScore.Points = kvp.Value;
            }
            else
            {
                var score = new ScoreAfterSubCompetition
                {
                    UserId = kvp.Key,
                    SubCompetitionId = subCompetitionId,
                    Points = kvp.Value
                };
                _context.ScoresAfterSubCompetitions.Add(score);
            }
        }

        await _context.SaveChangesAsync();

        // Update leaderboard

        await UpdateLeaderboardAsync(userPoints);
    }

    private int GetPointsForPrediction(ePlacement predictedPlacement, ePlacement actualPlacement)
    {
        if (predictedPlacement == actualPlacement)
        {
            return predictedPlacement switch
            {
                ePlacement.Final => 5,
                ePlacement.FinalKval => 3,
                ePlacement.ÅkerUt => 1,
                _ => 0
            };
        }

        return 0;
    }

    private async Task UpdateLeaderboardAsync(Dictionary<string, int> userPoints)
    {
        foreach (var kvp in userPoints)
        {
            var userId = kvp.Key;
            var points = kvp.Value;

            var existingLeaderboardEntry = await _context.Leaderboards
                .FirstOrDefaultAsync(l => l.UserId == userId);

            if (existingLeaderboardEntry != null)
            {
                existingLeaderboardEntry.Points += points;
            }
            else
            {
                var leaderboardEntry = new Leaderboard
                {
                    UserId = userId,
                    Points = points
                };
                _context.Leaderboards.Add(leaderboardEntry);
            }
        }

        await _context.SaveChangesAsync();
    }
}