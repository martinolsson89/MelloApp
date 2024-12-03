using System.ComponentModel.DataAnnotations;

namespace MelloApp.Server.Models.Account;

public class LoginModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } // User's email address

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; } // User's password

    public bool RememberMe { get; set; } // Optional: "Remember me" functionality
}