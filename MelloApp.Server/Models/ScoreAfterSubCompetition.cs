using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Data;
using MelloApp.Server.Models;

namespace MelloApp.Server.Models;

public class ScoreAfterSubCompetition
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public int Points { get; set; }

    [Required]
    public string? UserId { get; set; }
    public virtual ApplicationUser? User { get; set; }

    [Required]
    public string? SubCompetitionId { get; set; }
    public virtual SubCompetition? SubCompetition { get; set; }
}