using MelloApp.Server.Models;
using MelloApp.Server.Models.Dto;

namespace MelloApp.Server.Interface;

public interface IScoreAfterSubCompetitionRepository : IRepository<ScoreAfterSubCompetition>
{
    Task<List<SubCompetition>> GetScoresGroupedBySubCompetitionAsync();

    Task<List<ScoreAfterSubCompetition>> GetUserScoresAsync();


}