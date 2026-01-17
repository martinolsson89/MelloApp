using SendGrid;
using SendGrid.Helpers.Mail;

namespace MelloApp.Server.Services;

public class TestEmail
{
    private readonly ILogger<TestEmail> _logger;

    public TestEmail(ILogger<TestEmail> logger)
    {
        _logger = logger;
    }

    public async Task SendEmail()
    {
        var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("SENDGRID_API_KEY is not set.");

        // EU Data Residency version (use this if you have an EU-pinned subuser):
        var options = new SendGridClientOptions { ApiKey = apiKey };
        options.SetDataResidency("eu");
        var client = new SendGridClient(options);

        var from = new EmailAddress("melloboss26@gmail.com", "MelloApp");
        var to = new EmailAddress("martinolsson89@gmail.com", "Martin");
        var subject = "SendGrid test";
        var plainTextContent = "Hello! This is a SendGrid test from MelloApp.";
        var htmlContent = "<strong>Hello!</strong> This is a SendGrid test from MelloApp.";

        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        var response = await client.SendEmailAsync(msg);

        var body = await response.Body.ReadAsStringAsync();
        _logger.LogInformation("SendGrid Status: {StatusCode}. Body: {Body}", response.StatusCode, body);

        if ((int)response.StatusCode >= 400)
            throw new InvalidOperationException($"SendGrid failed: {(int)response.StatusCode} - {body}");
    }
}
