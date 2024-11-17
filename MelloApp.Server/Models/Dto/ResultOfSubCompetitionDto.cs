using MelloApp.Server.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MelloApp.Server.Models.Dto;

public class AddResultOfSubCompetitionDto
{
    public ePlacement Placement { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
    
}

public class UpdateResultOfSubCompetitionDto
{
    [Required]
    public string Id { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]

    public ePlacement Placement { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
    
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
