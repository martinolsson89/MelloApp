using MelloApp.Server.Models;

namespace MelloApp.Server.Interface;

public interface ISubCompetitionRepository : IRepository<SubCompetition>
{
    Task<List<SubCompetition>> GetSubCompetitionsWithArtistsAsync();
}