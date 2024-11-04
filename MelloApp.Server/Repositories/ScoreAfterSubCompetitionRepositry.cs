using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class ScoreAfterSubCompetitionRepositry : IRepository<ScoreAfterSubCompetition>
{
    private readonly ApplicationDbContext _context;

    public ScoreAfterSubCompetitionRepositry(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<ScoreAfterSubCompetition>> GetAllAsync()
    {
        return await _context.ScoresAfterSubCompetitions.ToListAsync();
    }

    public async Task<ScoreAfterSubCompetition?> GetByIdAsync(string id)
    {
        return await _context.ScoresAfterSubCompetitions.FindAsync(id);
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
}