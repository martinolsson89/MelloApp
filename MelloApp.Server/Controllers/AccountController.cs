using System.IdentityModel.Tokens.Jwt;
using MelloApp.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MelloApp.Server.Models.Account;
using MelloApp.Server.Repositories;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace MelloApp.Server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly AccountRepository _repository;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IMapper mapper,
            AccountRepository repository,
            IConfiguration configuration,
            IWebHostEnvironment environment,
            IEmailSender emailSender)

        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _repository = repository;
            _configuration = configuration;
            _environment = environment;
            _emailSender = emailSender;
        }

        // POST: /Account/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // if email is already in use
            if (await _userManager.FindByEmailAsync(model.Email) != null)
            {
                return BadRequest(new { message = $"En användare med {model.Email} är redan registrerad" });
            }

            var defaultAvatarBlobUrl = "https://melloappstorage.blob.core.windows.net/profile-pictures/default-avatar.png";

            var user = new ApplicationUser
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.Email,
                Email = model.Email,
                AvatarImageUrl = defaultAvatarBlobUrl

            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                // Assign the "User" role to the new user
                await _userManager.AddToRoleAsync(user, "User");

                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        // POST: /Account/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized();

            // Sign in the user and issue a session cookie
            await _signInManager.SignInAsync(user, isPersistent: model.RememberMe);

            // Return success with user info
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                email = user.Email,
                role = roles.FirstOrDefault()
            });
        }


        // Helper method to generate JWT
        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
            };

            // Add roles as claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
            }

            return Convert.ToBase64String(randomNumber);
        }



        // GET: /Account/pingauth
        [HttpGet("pingauth")]
        [Authorize]
        public IActionResult PingAuth()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var role = User.FindFirstValue(ClaimTypes.Role);

            return Ok(new
            {

                Email = email,
                Role = role

            });
        }

        // GET: /Account/pingauthadmin
        [HttpGet("pingauthadmin")]
        [Authorize]
        public IActionResult PingAuthAdmin()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);

            // Check if the user is an admin
            if (role != "Admin")
            {
                return Unauthorized();
            }

            return Ok(new { Role = role });
        }

        // GET: /Account/pingauthme
        [Authorize]
        [HttpGet("pingauthme")]
        public async Task<IActionResult> PingAuthMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Get the user from the database
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            // Return the user information (excluding sensitive data)
            return Ok(new
            {
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                HasMadeBet = user.HasMadeBet,
                AvatarImageUrl = user.AvatarImageUrl
                // Include other non-sensitive user properties as needed
            });
        }

        // PUT: /Account/updateBet
        [HttpPut("updateBet")]
        [Authorize]
        public async Task<IActionResult> UpdateBet([FromBody] UpdateBetUserDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Get the user from the database
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            user.HasMadeBet = model.HasMadeBet;

            // Save the changes
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        // PUT: /Account/updateBet
        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto model)
        {
            // Validate the model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get the user from the database
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            // Map only the allowed properties from the model to the user entity
            user.AvatarImageUrl = model.AvatarImageUrl;
            user.HasMadeBet = model.HasMadeBet;
            // Add other properties as needed, ensuring they are safe to update

            // Save the changes
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                // Return validation errors to the client
                return BadRequest(result.Errors);
            }
        }

        // PUT: /Account/updateAvatar
        [HttpPut("updateAvatar")]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] UpdateAvatarDto model)
        {
            // 1. Get the current user
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // 2. If the user already has a custom avatar (not the default), delete it from Blob Storage
            //    - We assume "default-avatar.png" is part of the URL for the default image.
            if (!string.IsNullOrEmpty(user.AvatarImageUrl) &&
                !user.AvatarImageUrl.Contains("default-avatar.png", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    // Parse the old avatar URL to get the blob name
                    var oldAvatarUri = new Uri(user.AvatarImageUrl);
                    var oldBlobName = Path.GetFileName(oldAvatarUri.LocalPath);
                    // e.g., "abc12345.png"

                    // Prepare Blob container client
                    var connectionString = _configuration["AzureStorage:ConnectionString"];
                    var containerName = _configuration["AzureStorage:ContainerName"];
                    var containerClient = new BlobContainerClient(connectionString, containerName);

                    // Delete the old blob if it exists
                    var oldBlobClient = containerClient.GetBlobClient(oldBlobName);
                    await oldBlobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);

                    Console.WriteLine($"Deleted old avatar from Azure Blob Storage: {oldBlobName}");
                }
                catch (Exception ex)
                {
                    // Log the exception
                    Console.WriteLine($"Error deleting old avatar from Blob: {ex.Message}");

                    // Optionally, return an error response or continue
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new { message = "Error deleting the old avatar from Azure Blob Storage." });
                }
            }

            // 3. Update the user's AvatarImageUrl to the *new* blob URL
            //    The new URL should already be an Azure Blob URL
            user.AvatarImageUrl = model.AvatarImageUrl;

            // 4. Save changes to the database
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to update user avatar." });
            }

            return Ok(new { message = "Avatar updated successfully.", newAvatarUrl = user.AvatarImageUrl });
        }

        // DELETE: /Account/AllByUserId/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("AllByUserId/{id}")]
        public async Task<IActionResult> DeleteAllPredictionsByUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            // Delete all predictions
            await _repository.DeleteAllPredictionsByUserIdAsync(id);
            await _repository.DeleteAllFinalPredictionsByUserIdAsync(id);

            // Update the user's HasMadeBet property
            user.HasMadeBet = false;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update user.");
            }

            return Ok();
        }

        /// <summary>
        /// Uploads the avatar image.
        /// </summary>
        /// <param name="avatar">The avatar image file.</param>
        /// <returns>The URL of the uploaded avatar.</returns>
        [Authorize]
        [HttpPost("uploadAvatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile avatar)
        {
            if (avatar == null || avatar.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif" };
            var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || Array.IndexOf(allowedExtensions, extension) < 0)
            {
                return BadRequest(new { message = "Invalid file type. Only JPG, PNG, WEBP, HEIC, HEIF and GIF are allowed." });
            }

            // Validate file size (e.g., max 5MB)
            const long maxFileSize = 5 * 1024 * 1024; // 5 MB
            if (avatar.Length > maxFileSize)
            {
                return BadRequest(new { message = "File size exceeds the 5MB limit." });
            }

            // Generate a unique filename
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";

            // Get Azure Storage connection string & container name from configuration
            var connectionString = _configuration["AzureStorage:ConnectionString"];
            var containerName = _configuration["AzureStorage:ContainerName"];

            try
            {
                // Create the blob service client
                BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

                // Get the container client
                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

                // Ensure the container exists (creates it if it doesn't)
                await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

                // Get a reference to a blob
                BlobClient blobClient = containerClient.GetBlobClient(uniqueFileName);

                // Upload the file stream
                using (var stream = avatar.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobUploadOptions
                    {
                        HttpHeaders = new BlobHttpHeaders
                        {
                            ContentType = avatar.ContentType
                        }
                    });
                }

                // Construct the blob URI (this will be publicly accessible if the container is set to PublicAccessType.Blob)
                var avatarUrl = blobClient.Uri.ToString();

                return Ok(new { avatarImageUrl = avatarUrl });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error uploading avatar to Blob: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error uploading the file to Azure Blob Storage." });
            }
        }

        // POST: /Account/UploadUserAvatar
        [Authorize(Roles = "Admin")]
        [HttpPost("UploadUserAvatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile avatar, [FromForm] string userId)
        {
            if (avatar == null || avatar.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            if (string.IsNullOrEmpty(userId))
                return BadRequest(new { message = "User ID is required." });

            // Get the user from the database
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif"  };
            var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Invalid file type. Only JPG, PNG, WEBP, HEIC, HEIF and GIF are allowed." });
            }

            // Validate file size (e.g., max 5MB)
            const long maxFileSize = 5 * 1024 * 1024; // 5 MB
            if (avatar.Length > maxFileSize)
            {
                return BadRequest(new { message = "File size exceeds the 5MB limit." });
            }

            // Generate a unique filename
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";

            // Get Azure Storage connection string & container name from configuration
            var connectionString = _configuration["AzureStorage:ConnectionString"];
            var containerName = _configuration["AzureStorage:ContainerName"];
            // Example: containerName might be "profile-pictures"

            try
            {
                // Create the blob service client
                var blobServiceClient = new BlobServiceClient(connectionString);

                // Get the container client
                var containerClient = blobServiceClient.GetBlobContainerClient(containerName);

                // Ensure the container exists (creates it if it doesn't)
                await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

                // Get a reference to a new blob
                var blobClient = containerClient.GetBlobClient(uniqueFileName);

                // Upload the file stream to Blob
                using (var stream = avatar.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobUploadOptions
                    {
                        HttpHeaders = new BlobHttpHeaders
                        {
                            ContentType = avatar.ContentType
                        }
                    });
                }

                // Construct the blob URI (this will be publicly accessible 
                // if the container is set to PublicAccessType.Blob)
                var avatarUrl = blobClient.Uri.ToString();

                // Optionally: Delete the old avatar from Blob Storage (if desired)
                // Only if user has an existing avatar that is *not* the default
                if (!string.IsNullOrEmpty(user.AvatarImageUrl) &&
                    !user.AvatarImageUrl.Contains("default-avatar.png"))
                {
                    try
                    {
                        // The old avatar URL is something like:
                        // https://<StorageAccount>.blob.core.windows.net/<containerName>/<oldFilename>
                        var oldAvatarUri = new Uri(user.AvatarImageUrl);

                        // Extract the blob name from the old avatar URL
                        var oldBlobName = Path.GetFileName(oldAvatarUri.LocalPath);

                        // Get a reference to the old blob
                        var oldBlobClient = containerClient.GetBlobClient(oldBlobName);

                        // Delete if it exists
                        await oldBlobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
                    }
                    catch (Exception ex)
                    {
                        // Log the exception, but don't fail the entire request
                        Console.WriteLine($"Error deleting old avatar from Blob: {ex.Message}");
                    }
                }

                // Update the user's AvatarImageUrl to the new blob URL
                user.AvatarImageUrl = avatarUrl;

                // Save changes to the database
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Failed to update user's avatar." });
                }

                return Ok(new { avatarImageUrl = avatarUrl });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error uploading avatar to Blob: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error uploading the file to Azure Blob Storage." });
            }
        }



        // PUT: /Account/UpdateUserAvatarUrl
        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateUserAvatarUrl")]
        public async Task<IActionResult> UpdateAvatarUrl([FromBody] UpdateUserAvatarDto model)
        {
            if (string.IsNullOrEmpty(model.Id))
                return BadRequest(new { message = "User ID is required." });

            if (string.IsNullOrEmpty(model.AvatarImageUrl))
                return BadRequest(new { message = "Avatar image URL is required." });

            // 1. Get the user from the database
            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            // 2. If the user already has a custom avatar (not default), delete it from Blob Storage
            if (!string.IsNullOrEmpty(user.AvatarImageUrl) &&
                !user.AvatarImageUrl.Contains("default-avatar.png", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    // Parse the old avatar URL to get the blob name
                    // e.g., https://<STORAGE_ACCOUNT>.blob.core.windows.net/<CONTAINER>/<FILENAME>
                    var oldAvatarUri = new Uri(user.AvatarImageUrl);
                    var oldBlobName = Path.GetFileName(oldAvatarUri.LocalPath);
                    // e.g., "abc12345.png"

                    // Prepare Blob container client
                    var connectionString = _configuration["AzureStorage:ConnectionString"];
                    var containerName = _configuration["AzureStorage:ContainerName"];
                    var containerClient = new BlobContainerClient(connectionString, containerName);

                    // Attempt to delete the old blob if it exists
                    var oldBlobClient = containerClient.GetBlobClient(oldBlobName);
                    await oldBlobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);

                    Console.WriteLine($"Deleted old avatar from Azure Blob Storage: {oldBlobName}");
                }
                catch (Exception ex)
                {
                    // Log the exception
                    Console.WriteLine($"Error deleting old avatar from Blob: {ex.Message}");
                    // You can decide if you want to fail or continue if deletion fails.
                    // For demonstration, let's continue without failing the entire request.
                }
            }

            // 3. Update the user's AvatarImageUrl with the new blob URL
            user.AvatarImageUrl = model.AvatarImageUrl;

            // 4. Save changes to the database
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to update user's avatar." });
            }

            return Ok(new
            {
                message = "User avatar updated successfully.",
                newAvatarUrl = user.AvatarImageUrl
            });
        }


        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // To prevent account enumeration, return the same response.
                return Ok(new { Message = "Om email-adressen är registrerad, skickas en länk ut." });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var callbackUrl =
                $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";


            await _emailSender.SendEmailAsync(
                user.Email,
                "Reset Password",
                $"Återställ ditt lösenord genom att <a href='{callbackUrl}'>klicka här</a>.");

            return Ok(new { Message = "Om email-adressen är registrerad, skickas en länk ut." });
        }

        [HttpGet]
        [Route("reset-password")]
        public IActionResult ResetPassword(string token, string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return BadRequest(new { Message = "Invalid password reset token or email." });
            }

            // Token and email are valid
            return Ok(new { Token = token, Email = email });
        }

        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid input data." });
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest(new { Message = "Användre ej funnen." });
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Lösenordet är nu ändrat" });
            }

            // Collect and return errors
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { Message = "Något gick fel.", Errors = errors });
        }

        // PUT: /Account/user/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("user/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserInfoDto model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.UserName = model.Email;
            user.HasMadeBet = model.HasMadeBet;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }


        // DELETE: /Account/user/{id}

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("user/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }
    }
}

