using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class ArtistRepository : IRepository<Artist>
{
    private readonly ApplicationDbContext _context;

    public ArtistRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Artist>> GetAllAsync()
    {
        return await _context.Artists.ToListAsync();
    }

    public async Task<Artist?> GetByIdAsync(string id)
    {
        return await _context.Artists.FindAsync(id);
    }

    public async Task<Artist> CreateAsync(Artist model)
    {
        await _context.Artists.AddAsync(model);
        await _context.SaveChangesAsync();
        return model;
    }

    public async Task<Artist?> UpdateAsync(string id, Artist model)
    {
        var existingArtist = await _context.Artists.FindAsync(id);

        if (existingArtist == null)
        {
            return existingArtist;
        }

        existingArtist.Name = model.Name;
        existingArtist.Song = model.Song;
        existingArtist.StartingNumber = model.StartingNumber;
        existingArtist.SubCompetitionId = model.SubCompetitionId;

        await _context.SaveChangesAsync();

        return existingArtist;
    }

    public async Task<Artist?> DeleteAsync(string id)
    {
        var existingArtist = await _context.Artists.FindAsync(id);
        if(existingArtist == null)
        {
            return existingArtist;
        }

        _context.Artists.Remove(existingArtist);
        await _context.SaveChangesAsync();

        return existingArtist;
    }
}