using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Enums;

namespace MelloApp.Server.Models;

public class ResultOfSubCompetition
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public ePlacement Placement { get; set; }

    [Required]
    public string ArtistId { get; set; }
    public virtual Artist Artist { get; set; }

    [Required]
    public string SubCompetitionId { get; set; }
    public virtual SubCompetition SubCompetition { get; set; }
}