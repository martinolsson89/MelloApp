using MelloApp.Server.Data;
using MelloApp.Server.Enums;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Account;
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


    public async Task<List<UserScoreDto>> CalculateAndStoreFinalPoints()
    {
        var users = new List<UserScoreDto>();

        var winnerArtistId = await _context.ResultsOfSubCompetitions
            .Where(r => r.FinalPlacement == eFinalPlacement.Vinnare)
            .Select(r => r.ArtistId)
            .FirstOrDefaultAsync();

        var secondPlaceArtistId = await _context.ResultsOfSubCompetitions
            .Where(r => r.FinalPlacement == eFinalPlacement.Tvåa)
            .Select(r => r.ArtistId)
            .FirstOrDefaultAsync();

        if (winnerArtistId == null)
        {
            return null;
        }

        if (secondPlaceArtistId == null)
        {
            return null;
        }

        var finalPredictions = await _context.FinalPredictions
            .Include(fp => fp.User)
            .Include(fp => fp.Artist)
            .ToListAsync();

        foreach (var finalPrediction in finalPredictions)
        {
            var userId = finalPrediction.UserId;

            if (userId == null)
            {
                continue;
            }
            
            var user = new UserScoreDto
            {
                UserId = userId,
                FirstName = finalPrediction.User.FirstName,
                LastName = finalPrediction.User.LastName,
                AvatarImageUrl = finalPrediction.User.AvatarImageUrl,
                Points = 0
            };

            if (finalPrediction.ArtistId == winnerArtistId && finalPrediction.FinalPredictedPlacement == eFinalPlacement.Vinnare)
            {
                // Award 10 points for correctly predicting the winner
                var result = await UpdateLeaderBoardPoints(userId, 10);
                user.Points += 10;
            }
            else if (finalPrediction.ArtistId == secondPlaceArtistId && finalPrediction.FinalPredictedPlacement == eFinalPlacement.Tvåa)
            {
                // Award 5 points for correctly predicting the second place
                var result = await UpdateLeaderBoardPoints(userId, 8);
                user.Points += 8;
            }
            
            // Check if the user already exists in the list
            var existingUser = users.FirstOrDefault(u => u.UserId == user.UserId);

            if (existingUser != null)
            {
                // Update the existing user's points
                existingUser.Points += user.Points;
            }
            else
            {
                // Add new user to the list
                users.Add(user);
            }
        }

        return users ;
    }



    private async Task<ActionResult> UpdateLeaderBoardPoints(string userId, int points)
    {
        var existingLeaderBoardEntry = _context.Leaderboards
            .FirstOrDefault(l => l.UserId == userId);
    
        if (existingLeaderBoardEntry == null)
        {
            return new NotFoundResult();
        }

        existingLeaderBoardEntry.Points += points;

        await _context.SaveChangesAsync();

        return new OkResult();
    }


}