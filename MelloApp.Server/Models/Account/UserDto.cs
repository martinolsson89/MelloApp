using MelloApp.Server.Models.Dto;

namespace MelloApp.Server.Models.Account;

public class UserDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string? AvatarImageUrl { get; set; }
    public bool HasMadeBet { get; set; } = false;
    public List<PredictionDto> Predictions { get; set; } = new List<PredictionDto>();
    public List<FinalPredictionDto> FinalPredictions { get; set; } = new List<FinalPredictionDto>();

}


public class GetUserDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string? AvatarImageUrl { get; set; }
    public bool HasMadeBet { get; set; } = false;
    
}

public class UpdateBetUserDto
{
    public bool HasMadeBet { get; set; } = false;
}

public class UpdateUserDto
{
    public string? AvatarImageUrl { get; set; }
    public bool HasMadeBet { get; set; } = false;

}

public class UpdateUserInfoDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public bool HasMadeBet { get; set; } = false;
}

public class UpdateAvatarDto
{
    public string? AvatarImageUrl { get; set; }
}

public class UpdateUserAvatarDto
{
    public string Id { get; set; }
    public string? AvatarImageUrl { get; set; }
}

public class UserScoreDto
{
    public string UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string AvatarImageUrl { get; set; }
    public int Points { get; set; }
}

public class UserNamesDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

