using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Account;
using MelloApp.Server.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class ScoreAfterSubCompetitionRepository : IScoreAfterSubCompetitionRepository
{
    private readonly ApplicationDbContext _context;

    public ScoreAfterSubCompetitionRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<ScoreAfterSubCompetition>> GetAllAsync()
    {
       var scores = await _context.ScoresAfterSubCompetitions.OrderBy(s => s.SubCompetition)
           .Include(sc => sc.SubCompetition)
           .Include(s => s.User)
           .ToListAsync();

       return scores;
    }

    public async Task<ScoreAfterSubCompetition?> GetByIdAsync(string id)
    {
        var score = await _context.ScoresAfterSubCompetitions.FindAsync(id);

        return score;
    }

    public async Task<ScoreAfterSubCompetition> CreateAsync(ScoreAfterSubCompetition model)
    {
        await _context.ScoresAfterSubCompetitions.AddAsync(model);
        await _context.SaveChangesAsync();
        return model;
    }

    public async Task<ScoreAfterSubCompetition?> UpdateAsync(string id, ScoreAfterSubCompetition model)
    {
        var existingScoreAfterSubCompetition = await _context.ScoresAfterSubCompetitions.FindAsync(id);

        if (existingScoreAfterSubCompetition == null)
        {
            return existingScoreAfterSubCompetition;
        }

        existingScoreAfterSubCompetition.Points = model.Points;
        existingScoreAfterSubCompetition.UserId = model.UserId;

        await _context.SaveChangesAsync();

        return existingScoreAfterSubCompetition;
    }

    public async Task<ScoreAfterSubCompetition?> DeleteAsync(string id)
    {
        var existingScoreAfterSubCompetition = await _context.ScoresAfterSubCompetitions.FindAsync(id);
        if (existingScoreAfterSubCompetition == null)
        {
            return existingScoreAfterSubCompetition;
        }

        _context.ScoresAfterSubCompetitions.Remove(existingScoreAfterSubCompetition);
        await _context.SaveChangesAsync();
        return existingScoreAfterSubCompetition;
    }

    public async Task<List<SubCompetition>> GetScoresGroupedBySubCompetitionAsync()
    {
        var subCompetitions = await _context.SubCompetitions
            .Include(sc => sc.ScoresAfterSubCompetitions)
            .ThenInclude(s => s.User)
            .ToListAsync();

        return subCompetitions;
    }

    public async Task<List<ScoreAfterSubCompetition>> GetUserScoresAsync()
    {
        //Include user and subcompetition order by subcompetition date
        var scores = await _context.ScoresAfterSubCompetitions
            .Include(s => s.User)
            .Include(s => s.SubCompetition)
            .OrderBy(s => s.SubCompetition.Date)
            .ToListAsync();

        return scores;
    }
}