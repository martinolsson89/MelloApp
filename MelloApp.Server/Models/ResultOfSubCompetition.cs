using System.ComponentModel.DataAnnotations;

namespace MelloApp.Server.Models;

public class ResultOfSubCompetition
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public int Placement { get; set; }

    [Required]
    public string ArtistId { get; set; } = Guid.NewGuid().ToString();
    public virtual Artist Artist { get; set; }

    [Required]
    public string SubCompetitionId { get; set; } = Guid.NewGuid().ToString();
    public virtual SubCompetition SubCompetition { get; set; }
}