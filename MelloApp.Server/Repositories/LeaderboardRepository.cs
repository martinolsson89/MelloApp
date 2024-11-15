using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class LeaderboardRepository : IRepository<Leaderboard>
{
    private readonly ApplicationDbContext _context;

    public LeaderboardRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<Leaderboard>> GetAllAsync()
    {
        var leaderboards = await _context.Leaderboards
            .Include(l => l.User)
            .OrderByDescending(l => l.Points) // Assuming you want the highest points first
            .ToListAsync();

        return leaderboards;
    }

    public async Task<Leaderboard?> GetByIdAsync(string id)
    {
        var user = await _context.Leaderboards.FindAsync(id);

        return user;
    }

    public async Task<Leaderboard> CreateAsync(Leaderboard model)
    {
        await _context.Leaderboards.AddAsync(model);
        await _context.SaveChangesAsync();

        return model;

    }

    public async Task<Leaderboard?> UpdateAsync(string id, Leaderboard model)
    {
        var existingUser = await _context.Leaderboards.FindAsync(id);
        if (existingUser == null)
        {
            return existingUser;
        }

        existingUser.Points = model.Points;
        existingUser.UserId = model.UserId;

        await _context.SaveChangesAsync();

        return existingUser;
    }

    public async Task<Leaderboard?> DeleteAsync(string id)
    {
        var user = await _context.Leaderboards.FindAsync(id);
        if (user == null)
        {
            return user;
        }

        _context.Leaderboards.Remove(user);
        await _context.SaveChangesAsync();

        return user;
    }
}