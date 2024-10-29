using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Data;
using MelloApp.Server.Models;

namespace MelloApp.Server.Models;

public class Prediction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string UserId { get; set; } = Guid.NewGuid().ToString();
    public virtual ApplicationUser User { get; set; }

    [Required]
    public string ArtistId { get; set; } = Guid.NewGuid().ToString();
    public virtual Artist Artist { get; set; }

    [Required]
    public string SubCompetitionId { get; set; } = Guid.NewGuid().ToString();
    public virtual SubCompetition SubCompetition { get; set; }

    public int PredictedPlacement { get; set; }
}