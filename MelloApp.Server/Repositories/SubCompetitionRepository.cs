using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Repositories;

public class SubCompetitionRepository : ISubCompetitionRepository
{
    private readonly ApplicationDbContext _context;

    public SubCompetitionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SubCompetition>> GetAllAsync()
    {
        var subCompetitions = await _context.SubCompetitions.ToListAsync();

        return subCompetitions;
    }

    public async Task<SubCompetition?> GetByIdAsync(string id)
    {
        var subCompetition = await _context.SubCompetitions.FindAsync(id);

        return subCompetition;
    }

    public async Task<SubCompetition> CreateAsync(SubCompetition model)
    {
        await _context.SubCompetitions.AddAsync(model);
        await _context.SaveChangesAsync();

        return model;
    }

    public async Task<SubCompetition?> UpdateAsync(string id, SubCompetition model)
    {
        var existingSubCompetition = await _context.SubCompetitions.FindAsync(id);
        if (existingSubCompetition == null)
        {
            return existingSubCompetition;
        }

        existingSubCompetition.Name = model.Name;
        existingSubCompetition.Date = model.Date;
        existingSubCompetition.Location = model.Location;

        await _context.SaveChangesAsync();

        return existingSubCompetition;

    }

    public async Task<SubCompetition?> DeleteAsync(string id)
    {
        var subCompetition = await _context.SubCompetitions.FindAsync(id);
        if (subCompetition == null)
        {
            return subCompetition;
        }

        _context.SubCompetitions.Remove(subCompetition);
        await _context.SaveChangesAsync();

        return subCompetition;
    }

    public async Task<List<SubCompetition>> GetSubCompetitionsWithArtistsAsync()
    {
        var subCompetitions = await _context.SubCompetitions
            .Include(sc => sc.Artists)
            .ToListAsync();

        return subCompetitions;
    }
}