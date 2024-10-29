using System.ComponentModel.DataAnnotations;

namespace MelloApp.Server.Models;

public class Artist
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [MaxLength(100)]
    public string Song { get; set; }

    public int StartingNumber { get; set; }

    [Required]
    public string SubCompetitionId { get; set; } = Guid.NewGuid().ToString();
    public virtual SubCompetition SubCompetition { get; set; }

    public virtual ICollection<Prediction> Predictions { get; set; }
    public virtual ICollection<ResultOfSubCompetition> Results { get; set; }
}