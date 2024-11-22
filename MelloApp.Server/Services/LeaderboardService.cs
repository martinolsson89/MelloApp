using MelloApp.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Services;

public class LeaderboardService
{
    private readonly ApplicationDbContext _context;

    public LeaderboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ActionResult> CalculateLeaderboard(string userId, string subCompetitionId)
    {
        var existingLeaderBoardEntry = await _context.Leaderboards
            .FirstOrDefaultAsync(l => l.UserId == userId);

        if (existingLeaderBoardEntry == null)
        {
            return new NotFoundResult();
        }

        // Calculate points for the user based on points in ScoreAfterSubCompetition
        var points = await _context.ScoresAfterSubCompetitions
            .Where(s => s.UserId == userId)
            .SumAsync(s => s.Points);


        // Update points in Leaderboard
        existingLeaderBoardEntry.Points = points;
        await _context.SaveChangesAsync();

        return new OkResult();
    }
}