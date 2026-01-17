# Gmail SMTP Email Setup Guide

This application now uses Gmail SMTP (free) instead of SendGrid for sending password reset emails.

## Setup Instructions

### 1. Enable 2-Factor Authentication on Your Gmail Account
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled

### 2. Generate an App Password
1. Go to: https://myaccount.google.com/apppasswords
   - Or navigate to: Google Account ? Security ? 2-Step Verification ? App passwords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** ? Enter "MelloApp"
4. Click **Generate**
5. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

### 3. Configure Your Application

#### Option A: Using appsettings.json (Development only - NOT for production)
Update `appsettings.json`:
```json
"Smtp": {
  "Host": "smtp.gmail.com",
  "Port": "587",
  "Username": "your-email@gmail.com",
  "Password": "your-16-char-app-password",
  "SenderEmail": "your-email@gmail.com",
  "SenderName": "MelloApp"
}
```

#### Option B: Using User Secrets (Recommended for development)
```bash
dotnet user-secrets set "Smtp:Host" "smtp.gmail.com"
dotnet user-secrets set "Smtp:Port" "587"
dotnet user-secrets set "Smtp:Username" "your-email@gmail.com"
dotnet user-secrets set "Smtp:Password" "your-16-char-app-password"
dotnet user-secrets set "Smtp:SenderEmail" "your-email@gmail.com"
dotnet user-secrets set "Smtp:SenderName" "MelloApp"
```

#### Option C: Using Environment Variables (Recommended for production)
Set these environment variables:
- `Smtp__Host=smtp.gmail.com`
- `Smtp__Port=587`
- `Smtp__Username=your-email@gmail.com`
- `Smtp__Password=your-16-char-app-password`
- `Smtp__SenderEmail=your-email@gmail.com`
- `Smtp__SenderName=MelloApp`

### 4. Gmail Sending Limits
- **Free Gmail accounts**: Up to 500 emails per day
- **Google Workspace accounts**: Up to 2,000 emails per day

This is typically sufficient for password reset emails in most applications.

## Testing

After configuration, test the email functionality by:
1. Running the application
2. Using the "Forgot Password" feature
3. Checking that the email arrives in the recipient's inbox

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Make sure you're using an App Password, not your regular Gmail password
   - Verify 2-Factor Authentication is enabled

2. **"Access denied"**
   - Check that "Less secure app access" is NOT needed (App Passwords work with 2FA)
   - Verify the app password is correctly copied (no spaces)

3. **Emails not arriving**
   - Check spam/junk folder
   - Verify the sender email is correct
   - Check Gmail's sent folder to confirm the email was sent

4. **"Daily sending quota exceeded"**
   - You've hit Gmail's daily limit (500 emails)
   - Wait 24 hours or consider using Google Workspace for higher limits

## Alternative SMTP Providers (Also Free)

If you need alternatives to Gmail:
- **Outlook/Hotmail**: smtp-mail.outlook.com, Port 587
- **Yahoo Mail**: smtp.mail.yahoo.com, Port 587
- **Zoho Mail**: smtp.zoho.com, Port 587

All require similar app password setup.
