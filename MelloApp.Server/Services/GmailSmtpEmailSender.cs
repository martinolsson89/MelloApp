using Microsoft.AspNetCore.Identity.UI.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace MelloApp.Server.Services;

public class GmailSmtpEmailSender : IEmailSender
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<GmailSmtpEmailSender> _logger;

    public GmailSmtpEmailSender(IConfiguration configuration, ILogger<GmailSmtpEmailSender> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        try
        {
            var smtpHost = _configuration["Smtp:Host"];
            var smtpPort = int.Parse(_configuration["Smtp:Port"] ?? "587");
            var smtpUsername = _configuration["Smtp:Username"];
            var smtpPassword = _configuration["Smtp:Password"];
            var senderEmail = _configuration["Smtp:SenderEmail"];
            var senderName = _configuration["Smtp:SenderName"];

            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) ||
                string.IsNullOrEmpty(smtpPassword) || string.IsNullOrEmpty(senderEmail))
            {
                throw new InvalidOperationException("SMTP configuration is incomplete.");
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName ?? "MelloApp", senderEmail));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlMessage
            };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            // Connect to Gmail SMTP server
            await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);

            // Authenticate
            await client.AuthenticateAsync(smtpUsername, smtpPassword);

            // Send the email
            await client.SendAsync(message);

            // Disconnect
            await client.DisconnectAsync(true);

            _logger.LogInformation("Email sent successfully to {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", email);
            throw;
        }
    }
}
