using System.ComponentModel.DataAnnotations;

namespace MelloApp.Server.Models.Dto;

public class AddPredictionDto
{
    public int PredictedPlacement { get; set; }
    public string? UserId { get; set; }

    public string? ArtistId { get; set; }

    public string? SubCompetitionId { get; set; }
}


public class UpdatePredictionDto
{
    [Required]
    public string Id { get; set; }
    public int PredictedPlacement { get; set; }
    public string? UserId { get; set; }

    public string? ArtistId { get; set; }

    public string? SubCompetitionId { get; set; }
}
public class DeletePredictionDto
{
    [Required]
    public string Id { get; set; }
    
}

public class GetPredictionDto
{
    public string Id { get; set; }
    public int PredictedPlacement { get; set; }
    public string? UserId { get; set; }

    public string? ArtistId { get; set; }

    public string? SubCompetitionId { get; set; }
}