using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class ResultOfSubCompetitionRepository : IResultOfSubCompetitionRepository
{
    private readonly ApplicationDbContext _context;

    public ResultOfSubCompetitionRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<ResultOfSubCompetition>> GetAllAsync()
    {
        return await _context.ResultsOfSubCompetitions.ToListAsync();
    }

    public async Task<ResultOfSubCompetition?> GetByIdAsync(string id)
    {
        return await _context.ResultsOfSubCompetitions.FindAsync(id);
    }

    public async Task<ResultOfSubCompetition> CreateAsync(ResultOfSubCompetition model)
    {
        await _context.ResultsOfSubCompetitions.AddAsync(model);
        await _context.SaveChangesAsync();
        return model;
    }

    public async Task<ResultOfSubCompetition?> UpdateAsync(string id, ResultOfSubCompetition model)
    {
        var existingResultOfSubCompetition = await _context.ResultsOfSubCompetitions.FindAsync(id);

        if (existingResultOfSubCompetition == null)
        {
            return existingResultOfSubCompetition;
        }

        existingResultOfSubCompetition.Placement = model.Placement;
        existingResultOfSubCompetition.ArtistId = model.ArtistId;
        existingResultOfSubCompetition.SubCompetitionId = model.SubCompetitionId;

        await _context.SaveChangesAsync();

        return existingResultOfSubCompetition;
    }

    public async Task<ResultOfSubCompetition?> DeleteAsync(string id)
    {
        var existingResultOfSubCompetition = await _context.ResultsOfSubCompetitions.FindAsync(id);
        if (existingResultOfSubCompetition == null)
        {
            return existingResultOfSubCompetition;
        }

        _context.ResultsOfSubCompetitions.Remove(existingResultOfSubCompetition);
        await _context.SaveChangesAsync();

        return existingResultOfSubCompetition;
    }

    public async Task<IEnumerable<ResultOfSubCompetition>> CreateBatchAsync(IEnumerable<ResultOfSubCompetition> resultOfSub)
    {
        await _context.ResultsOfSubCompetitions.AddRangeAsync(resultOfSub);
        await _context.SaveChangesAsync();

        return resultOfSub;
    }
}