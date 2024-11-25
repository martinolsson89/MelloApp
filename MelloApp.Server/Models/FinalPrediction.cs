using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Data;
using MelloApp.Server.Enums;

namespace MelloApp.Server.Models;

public class FinalPrediction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string UserId { get; set; }
    public virtual ApplicationUser User { get; set; }

    [Required]
    public string ArtistId { get; set; }
    public virtual Artist Artist { get; set; }

    [Required]
    public string SubCompetitionId { get; set; }
    public virtual SubCompetition SubCompetition { get; set; }

    public eFinalPlacement FinalPredictedPlacement { get; set; }

}