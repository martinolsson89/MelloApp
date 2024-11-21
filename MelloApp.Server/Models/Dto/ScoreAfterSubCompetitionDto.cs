using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Models.Account;

namespace MelloApp.Server.Models.Dto;

public class AddScoreAfterSubCompetitionDto
{
    public int Points { get; set; }
    public string? UserId { get; set; }
    public string? SubCompetitionId { get; set; }
}

public class UpdateScoreAfterSubCompetitionDto
{
    [Required]
    public string Id { get; set; }
    public int Points { get; set; }
    public string? UserId { get; set; }
}


public class DeleteScoreAfterSubCompetitionDto
{
    [Required]
    public string Id { get; set; }
    
}
public class GetScoreAfterSubCompetitionDto
{
    public string Id { get; set; }
    public int Points { get; set; }
    public string? UserId { get; set; }
    //public GetUserDto User { get; set; }
    public string? SubCompetitionId { get; set; }
    //public GetSubCompetitionNameDto SubCompetitionName { get; set; }
}
    
