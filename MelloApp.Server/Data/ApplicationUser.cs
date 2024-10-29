using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Data;
using MelloApp.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace MelloApp.Server.Data;

public class ApplicationUser : IdentityUser
{
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; }

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; }

    public virtual ICollection<ScoreAfterSubCompetition> Scores { get; set; }
    public virtual Leaderboard Leaderboard { get; set; }
    public virtual ICollection<Prediction> Predictions { get; set; }
}