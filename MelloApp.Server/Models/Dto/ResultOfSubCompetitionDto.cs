using MelloApp.Server.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MelloApp.Server.Models.Dto;

public class AddResultOfSubCompetitionDto
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ePlacement Placement { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement? FinalPlacement { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
    
}

public class AddBatchResultOfSubCompetitionDto
{
    public List<AddResultOfSubCompetitionDto> Results { get; set; }
}

public class UpdateResultOfSubCompetitionDto
{
    [Required]
    public string Id { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ePlacement? Placement { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement? FinalPlacement { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
    
}

public class UpdateBatchResultOfSubCompetitionDto
{
    public string? ArtistId { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement? FinalPlacement { get; set; }
    
}

public class DeleteResultOfSubCompetitionDto
{
    [Required]
    public string Id { get; set; }
    
}

public class GetResultOfSubCompetitionDto
{
    public string Id { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ePlacement Placement { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public eFinalPlacement? FinalPlacement { get; set; }

    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
    
}

public class ResultOfSubCompetitionDto
{
    public string Id { get; set; }

    public ArtistDto Artist { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]

    public ePlacement Placement { get; set; }
    
}
