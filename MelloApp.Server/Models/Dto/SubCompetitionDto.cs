using System.ComponentModel.DataAnnotations;

namespace MelloApp.Server.Models.Dto;

public class AddSubCompetitionDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    public DateTime Date { get; set; }
    public string? Location { get; set; }
}

public class UpdateSubCompetitionDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    public DateTime Date { get; set; }
    public string? Location { get; set; }
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