using SendGrid;
using SendGrid.Helpers.Mail;

namespace MelloApp.Server.Services;

public class TestEmail
{
    public async Task SendEmail()
    {
        var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress("melloapp25@gmail.com", "Example User");
        var subject = "Sending with SendGrid is Fun";
        var to = new EmailAddress("martinolsson89@gmail.com", "Example User");
        var plainTextContent = "and easy to do anywhere, even with C#";
        var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
        var response = await client.SendEmailAsync(msg);

        Console.WriteLine($"Response code: {response.StatusCode}, Response: {response}");
    }

}