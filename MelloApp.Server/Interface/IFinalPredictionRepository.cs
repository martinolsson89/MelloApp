using MelloApp.Server.Models;

namespace MelloApp.Server.Interface;

public interface IFinalPredictionRepository : IRepository<FinalPrediction>
{
    Task CreateBatchAsync(IEnumerable<FinalPrediction> finalPredictions);
}