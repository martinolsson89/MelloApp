using System.ComponentModel.DataAnnotations;
using MelloApp.Server.Data;

namespace MelloApp.Server.Models.Dto;

public class GetLeaderboardDto
{
    public string Id { get; set; }
    public int Points { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; } // Include User details if needed
}

public class AddLeaderboardDto
{
    [Required]
    public int Points { get; set; }

    [Required]
    public string UserId { get; set; }
}

public class UpdateLeaderboardDto
{
    [Required]
    public string Id { get; set; }

    [Required]
    public int Points { get; set; }

    public string UserId { get; set; } // Optional, depending on update needs
}


public class DeleteLeaderboardDto
{
    public string Id { get; set; }
    
}