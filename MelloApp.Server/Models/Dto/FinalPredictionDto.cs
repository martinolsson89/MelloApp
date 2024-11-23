using MelloApp.Server.Data;
using MelloApp.Server.Enums;
using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Models.Account;
using System.Text.Json.Serialization;

namespace MelloApp.Server.Models.Dto;

public class AddFinalPredictionDto
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement FinalPredictedPlacement { get; set; }
    public string? UserId { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
}

public class UpdateFinalPredictionDto
{
    [Required]
    public string Id { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement FinalPredictedPlacement { get; set; }
    public string? UserId { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
}

public class DeleteFinalPredictionDto
{
    [Required]
    public string Id { get; set; }
}

public class GetFinalPredictionDto
{
    public string Id { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement FinalPredictedPlacement { get; set; }
    public string? UserId { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }

}
public class AddBatchFinalPredictionDto
{
    public List<AddFinalPredictionDto> Predictions { get; set; }
}

public class FinalPredictionDto
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement FinalPredictedPlacement { get; set; }
    public string? ArtistId { get; set; }
    public ArtistDto? Artist { get; set; }

    public string? SubCompetitionId { get; set; }
    public SubCompetitionDto? SubCompetition { get; set; }
}

public class GetFinalPredictionDtoWithUser
{
    public string Id { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement FinalPredictedPlacement { get; set; }
    public UserDto? User { get; set; }
    public ArtistDto? Artist { get; set; }
}
