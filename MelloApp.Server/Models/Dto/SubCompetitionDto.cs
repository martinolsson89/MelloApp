using System.ComponentModel.DataAnnotations;

namespace MelloApp.Server.Models.Dto;

public class AddSubCompetitionDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    public DateTime Date { get; set; }

    public string? Location { get; set; }
}


public class UpdateSubCompetitionDto
{
    [Required]
    public string Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; }

    public DateTime Date { get; set; }

    public string? Location { get; set; }

    // Optionally, you can include lists to update related collections
    public List<string>? ArtistIds { get; set; }
    public List<string>? ResultIds { get; set; }
    public List<string>? PredictionIds { get; set; }
}


public class DeleteSubCompetitionDto
{
    [Required]
    public string Id { get; set; }
}


public class GetSubCompetitionDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public string? Location { get; set; }

    // Include related collections as lists of IDs or short info for reference if needed
    public List<string>? ArtistIds { get; set; }
    public List<string>? ResultIds { get; set; }
    public List<string>? PredictionIds { get; set; }
    public List<GetArtistDto>? Artists { get; set; } // Use a DTO for artist details
}


