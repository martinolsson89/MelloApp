using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Data;

namespace MelloApp.Server.Models;

public class SubCompetition
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    public DateTime Date { get; set; }
    public string Location { get; set; }

    public virtual ICollection<Artist> Artists { get; set; }
    public virtual ICollection<ResultOfSubCompetition> Results { get; set; }
    public virtual ICollection<Prediction> Predictions { get; set; }
}