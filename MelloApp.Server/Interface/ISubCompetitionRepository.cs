using MelloApp.Server.Models;
using MelloApp.Server.Models.Dto;

namespace MelloApp.Server.Interface;

public interface ISubCompetitionRepository : IRepository<SubCompetition>
{
    Task<List<SubCompetition>> GetSubCompetitionsWithArtistsAsync();

    Task<SubCompetition> GetSubCompetitionWithArtistAsync(string id);

    Task<List<SubCompetition>> GetSubCompetitionWithResultAsync();

    Task<SubCompetition> GetSubCompetitionWithResultAsync(string id);

    Task<List<SubCompetition>> GetSubCompetitionsWithArtistsAndPredictionsAsync();

    Task<SubCompetition> GetSubCompetitionWithArtistsAndPredictionsAsync(string id);

    Task<SubCompetition> GetSubCompetitionsWithArtistsAndPredictionsAndResultsAsync(string id);

}