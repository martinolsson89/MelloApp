using MelloApp.Server.Models;

namespace MelloApp.Server.Interface;

public interface ISubCompetitionRepository : IRepository<SubCompetition>
{
    Task<List<SubCompetition>> GetSubCompetitionsWithArtistsAsync();

    Task<SubCompetition> GetSubCompetitionWithArtistAsync(string id);

    Task<List<SubCompetition>> GetSubCompetitionWitPredictionAsync();

    Task<SubCompetition> GetSubCompetitionWitPredictionAsync(string id);

    Task<List<SubCompetition>> GetSubCompetitionWithResultAsync();

    Task<SubCompetition> GetSubCompetitionWithResultAsync(string id);
}