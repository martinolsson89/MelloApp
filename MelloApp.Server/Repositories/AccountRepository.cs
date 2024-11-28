using MelloApp.Server.Data;

namespace MelloApp.Server.Repositories;

public class AccountRepository
{
    private readonly ApplicationDbContext _context;

    public AccountRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task DeleteAllPredictionsByUserIdAsync(string userId)
    {
        var predictions = _context.Predictions.Where(p => p.UserId == userId);
        _context.Predictions.RemoveRange(predictions);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAllFinalPredictionsByUserIdAsync(string userId)
    {
        var finalPredictions = _context.FinalPredictions.Where(fp => fp.UserId == userId);
        _context.FinalPredictions.RemoveRange(finalPredictions);
        await _context.SaveChangesAsync();
    }
}