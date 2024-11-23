using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class FinalPredictionRepository : IFinalPredictionRepository
{
    private readonly ApplicationDbContext _context;

    public FinalPredictionRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<FinalPrediction>> GetAllAsync()
    {
        var finalPredictions = await _context.FinalPredictions.ToListAsync();


        return finalPredictions;
    }

    public async Task<FinalPrediction?> GetByIdAsync(string id)
    {
        var finalPrediction = await _context.FinalPredictions.FindAsync(id);
        return finalPrediction;
    }

    public async Task<FinalPrediction> CreateAsync(FinalPrediction model)
    {
        await _context.FinalPredictions.AddAsync(model);
        await _context.SaveChangesAsync();
        return model;
    }

    public async Task<FinalPrediction?> UpdateAsync(string id, FinalPrediction model)
    {
        var existingFinalPrediction = await _context.FinalPredictions.FindAsync(id);

        if (existingFinalPrediction == null)
        {
            return existingFinalPrediction;
        }

        existingFinalPrediction.UserId = model.UserId;
        existingFinalPrediction.ArtistId = model.ArtistId;
        existingFinalPrediction.SubCompetitionId = model.SubCompetitionId;
        existingFinalPrediction.FinalPredictedPlacement = model.FinalPredictedPlacement;

        await _context.SaveChangesAsync();

        return existingFinalPrediction;
    }

    public async Task<FinalPrediction?> DeleteAsync(string id)
    {
        var existingFinalPrediction = await _context.FinalPredictions.FindAsync(id);
        if (existingFinalPrediction == null)
        {
            return existingFinalPrediction;
        }

        _context.FinalPredictions.Remove(existingFinalPrediction);
        await _context.SaveChangesAsync();

        return existingFinalPrediction;
    }

    public async Task CreateBatchAsync(IEnumerable<FinalPrediction> finalPredictions)
    {
        await _context.FinalPredictions.AddRangeAsync(finalPredictions);
        await _context.SaveChangesAsync();
    }
}