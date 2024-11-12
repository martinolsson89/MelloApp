using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Data;
using MelloApp.Server.Enums;

namespace MelloApp.Server.Models;

public class FinalPrediction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string UserId { get; set; } = Guid.NewGuid().ToString();
    public virtual ApplicationUser User { get; set; }

    [Required]
    public string ArtistId { get; set; } = Guid.NewGuid().ToString();
    public virtual Artist Artist { get; set; }

    public eFinalPlacement FinalPlacement { get; set; }

}