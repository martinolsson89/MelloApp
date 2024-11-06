using MelloApp.Server.Models.Dto;

namespace MelloApp.Server.Models.Account;

public class UserDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    public List<PredictionDto> Predictions { get; set; } = new List<PredictionDto>();

}