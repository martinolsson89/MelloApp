using System.Text.Json.Serialization;

namespace MelloApp.Server.Models;

public class HomeContent
{
    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("linkUrl")]
    public string LinkUrl { get; set; }

    [JsonPropertyName("linkText")]
    public string LinkText { get; set; }

    [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; }
}

public class RegisterDto
{
    [JsonPropertyName("isRegistrationEnabled")]
    public bool IsRegistrationEnabled { get; set; } = true;

}