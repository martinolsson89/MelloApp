using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Data;
using MelloApp.Server.Models;

namespace MelloApp.Server.Models;

public class Leaderboard
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public int Points { get; set; }

    [Required]
    public string UserId { get; set; } = Guid.NewGuid().ToString(); 
    public virtual ApplicationUser User { get; set; }
}