using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class PredictionRepository : IRepository<Prediction>
{
    private readonly ApplicationDbContext _context;

    public PredictionRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<Prediction>> GetAllAsync()
    {
        var predictions = await _context.Predictions.ToListAsync();
        return predictions;
    }

    public async Task<Prediction?> GetByIdAsync(string id)
    {
        var prediction = await _context.Predictions.FindAsync(id);
        return prediction;
    }

    public async Task<Prediction> CreateAsync(Prediction model)
    {
        await _context.Predictions.AddAsync(model);
        await _context.SaveChangesAsync();
        return model;

    }

    public async Task<Prediction?> UpdateAsync(string id, Prediction model)
    {
        var existingPrediction = await _context.Predictions.FindAsync(id);

        if (existingPrediction == null)
        {
            return existingPrediction;
        }

        existingPrediction.UserId = model.UserId;
        existingPrediction.ArtistId = model.ArtistId;
        existingPrediction.SubCompetitionId = model.SubCompetitionId;
        existingPrediction.PredictedPlacement = model.PredictedPlacement;

        await _context.SaveChangesAsync();

        return existingPrediction;

    }

    public async Task<Prediction?> DeleteAsync(string id)
    {
        var existingPrediction = await _context.Predictions.FindAsync(id);
        if (existingPrediction == null)
        {
            return existingPrediction;
        }

        _context.Predictions.Remove(existingPrediction);
        await _context.SaveChangesAsync();

        return existingPrediction;

    }
}