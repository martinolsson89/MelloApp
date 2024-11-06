using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class UserRepository : IRepository<ApplicationUser>
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<ApplicationUser>> GetAllAsync()
    {
        var users = await _context.Users
            .Include(u => u.Predictions)!
            .ThenInclude(p => p.Artist)
            .Include(u => u.Predictions)!
            .ThenInclude(p => p.SubCompetition)
            .ToListAsync();

        return users;
    }

    public async Task<ApplicationUser?> GetByIdAsync(string id)
    {
        var user = await _context.Users
            .Include(u => u.Predictions)!
            .ThenInclude(p => p.Artist)
            .Include(u => u.Predictions)!
            .ThenInclude(p => p.SubCompetition)
            .FirstOrDefaultAsync(u => u.Id == id);

        return user;
    }

    public Task<ApplicationUser> CreateAsync(ApplicationUser model)
    {
        throw new NotImplementedException();
    }

    public Task<ApplicationUser?> UpdateAsync(string id, ApplicationUser model)
    {
        throw new NotImplementedException();
    }

    public Task<ApplicationUser?> DeleteAsync(string id)
    {
        throw new NotImplementedException();
    }
}