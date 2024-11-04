using System.ComponentModel.DataAnnotations;

namespace MelloApp.Server.Models.Dto;

public class AddResultOfSubCompetitionDto
{
    public int Placement { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
    
}

public class UpdateResultOfSubCompetitionDto
{
    [Required]
    public string Id { get; set; }
    public int Placement { get; set; }
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
    public int Placement { get; set; }
    public string? ArtistId { get; set; }
    public string? SubCompetitionId { get; set; }
    
}