using MelloApp.Server.Models;
using MelloApp.Server.Repositories;

namespace MelloApp.Server.Interface;

public interface IResultOfSubCompetitionRepository : IRepository<ResultOfSubCompetition>
{
    Task<IEnumerable<ResultOfSubCompetition>> CreateBatchAsync(IEnumerable<ResultOfSubCompetition> resultOfSub);
    Task<ResultOfSubCompetition> UpdateBatchAsync(ResultOfSubCompetition resultOfSub);

}