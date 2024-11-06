using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Models.Account;

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

public class AddBatchPredictionDto
{
    public List<AddPredictionDto> Predictions { get; set; }
}

public class PredictionDto
{
    public int PredictedPlacement { get; set; }

    public string? ArtistId { get; set; }
    public ArtistDto? Artist { get; set; }

    public string? SubCompetitionId { get; set; }

    public SubCompetitionDto? SubCompetition { get; set; }

}

public class PredictionWithUserDto
{
    public string Id { get; set; }

    public UserDto? User { get; set; }

    public ArtistDto? Artist { get; set; }

    public int PredictedPlacement { get; set; }
    
}