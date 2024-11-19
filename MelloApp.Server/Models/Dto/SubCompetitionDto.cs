using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Models.Account;

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
}

public class GetSubCompetitionNameDto
{
    public string Id { get; set; }
    public string Name { get; set; }
}


public class GetSubCompetitionAndArtistsDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public string? Location { get; set; }
    public List<GetArtistDto>? Artists { get; set; } // Use a DTO for artist details
}

public class GetSubCompetitionAndPredictionsDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public string? Location { get; set; }
    public List<PredictionWithUserAndArtistDto>? Predictions { get; set; } // Use a DTO for artist details
}

public class GetSubCompetitionAndFinalPredictionsDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public string? Location { get; set; }
    public List<GetFinalPredictionDtoWithUser>? FinalPredictions { get; set; } // Use a DTO for artist details
}

public class GetSubCompetitionAndResultsDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public string? Location { get; set; }
    public List<ResultOfSubCompetitionDto>? Results { get; set; } // Use a DTO for artist details
}

public class SubCompetitionDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public string? Location { get; set; }
}

public class SubCompetitionWithScoresDto
{
    public string SubCompetitionId { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public List<UserScoreDto> UserScores { get; set; }
}

public class GetSubCompetitionWithArtistsAndPredictionsDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public string? Location { get; set; }
    public List<ArtistWithPredictionsDto> Artists { get; set; }
}



