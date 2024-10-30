using MelloApp.Server.Models;

namespace MelloApp.Server.Interface;

public interface IRepository<T>
{
    Task<List<T>> GetAllAsync();
    Task<T?> GetByIdAsync(string id);
    Task<T> CreateAsync(T model);
    Task<T?> UpdateAsync(string id, T model);
    Task<T?> DeleteAsync(string id);
}