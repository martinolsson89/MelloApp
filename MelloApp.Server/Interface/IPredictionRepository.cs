using MelloApp.Server.Models;
using System.Threading.Tasks;

namespace MelloApp.Server.Interface;

public interface IPredictionRepository : IRepository<Prediction>
{
    Task CreateBatchAsync(IEnumerable<Prediction> predictions);
}