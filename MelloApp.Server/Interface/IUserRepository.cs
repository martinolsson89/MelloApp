using MelloApp.Server.Data;

namespace MelloApp.Server.Interface;

public interface IUserRepository : IRepository<ApplicationUser>
{
    Task<ApplicationUser?> GetUserWithPredictions(string id);

}