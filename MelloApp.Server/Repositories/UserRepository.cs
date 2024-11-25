using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<ApplicationUser>> GetAllAsync()
    {
        var users = await _context.Users.OrderBy(u => u.FirstName).ToListAsync();

        return users;
    }

    public async Task<ApplicationUser?> GetByIdAsync(string id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        return user;
    }


    public Task<ApplicationUser> CreateAsync(ApplicationUser model)
    {
        throw new NotImplementedException();
    }

    public async Task<ApplicationUser?> UpdateAsync(string id, ApplicationUser model)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return null;
        }

        user.AvatarImageUrl = model.AvatarImageUrl;

        await _context.SaveChangesAsync();

        return user;
    }

    public Task<ApplicationUser?> DeleteAsync(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<ApplicationUser?> GetUserWithPredictions(string id)
    {
        var user = await _context.Users
            .Include(u => u.Predictions)
            .ThenInclude(p => p.Artist)
            .Include(u => u.Predictions)
            .ThenInclude(p => p.SubCompetition)
            .Include(u => u.FinalPredictions)
            .ThenInclude(fp => fp.Artist)
            .Include(u => u.FinalPredictions)
            .ThenInclude(fp => fp.SubCompetition)
            .FirstOrDefaultAsync(u => u.Id == id);

        return user;
    }
}