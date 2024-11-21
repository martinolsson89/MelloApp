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
        var users = await _context.Users.OrderBy(u => u.FirstName).ToListAsync();

        return users;
    }

    public async Task<ApplicationUser?> GetUserByIdAsync(string id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        return user;
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
}