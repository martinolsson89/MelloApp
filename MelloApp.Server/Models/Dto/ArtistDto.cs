using System.ComponentModel.DataAnnotations;

namespace MelloApp.Server.Models.Dto;

public class AddArtistDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [MaxLength(100)]
    public string Song { get; set; }

    public int StartingNumber { get; set; }

    [Required]
    public string? SubCompetitionId { get; set; }
}

public class UpdateArtistDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [MaxLength(100)]
    public string Song { get; set; }

    public int StartingNumber { get; set; }

    [Required]
    public string? SubCompetitionId { get; set; }
}

public class GetArtistDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Song { get; set; }
    public int StartingNumber { get; set; }
    public string? SubCompetitionId { get; set; }
    //public GetSubCompetitionDto? SubCompetition { get; set; }
}

public class ArtistDto
{
    public string Name { get; set; }
    public string Song { get; set; }
    public int StartingNumber { get; set; }
}

public class ArtistWithPredictionsDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Song { get; set; }
    public int StartingNumber { get; set; }

    public List<PredictionWithUserDto> Predictions { get; set; }
}
