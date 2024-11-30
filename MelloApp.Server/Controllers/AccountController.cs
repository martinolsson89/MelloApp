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
using MelloApp.Server.Models.Account;
using MelloApp.Server.Repositories;
using Microsoft.IdentityModel.Tokens;

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

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IMapper mapper,
            AccountRepository repository,
            IConfiguration configuration,
            IWebHostEnvironment environment)
            
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _repository = repository;
            _configuration = configuration;
            _environment = environment;
        }

        // POST: /Account/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var user = new ApplicationUser
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.Email,
                Email = model.Email
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

            return Ok(new { Role = role});
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Get the user from the database
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            // Delete existing avatar file if it exists and is not the default
            if (!string.IsNullOrEmpty(user.AvatarImageUrl) && user.AvatarImageUrl != "/uploads/avatars/default-avatar.png")
            {
                try
                {
                    var existingFileName = Path.GetFileName(user.AvatarImageUrl);
                    var existingFilePath = Path.Combine(_environment.ContentRootPath, "uploads", "avatars", existingFileName);

                    if (System.IO.File.Exists(existingFilePath))
                    {
                        System.IO.File.Delete(existingFilePath);
                        Console.WriteLine($"Deleted old avatar: {existingFilePath}");
                    }
                }
                catch (Exception ex)
                {
                    // Log the exception
                    Console.WriteLine($"Error deleting old avatar: {ex.Message}");
                    // Optionally, return an error response or continue
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting the old avatar." });
                }
            }

            // Map only the allowed properties from the model to the user entity
            user.AvatarImageUrl = model.AvatarImageUrl;
            // Add other properties as needed, ensuring they are safe to update


            // Save changes to the database
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to update user profile." });
            }

            return Ok();
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
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || Array.IndexOf(allowedExtensions, extension) < 0)
            {
                return BadRequest(new { message = "Invalid file type. Only JPG, PNG, and GIF are allowed." });
            }

            // Validate file size (e.g., max 5MB)
            const long maxFileSize = 5 * 1024 * 1024; // 5 MB
            if (avatar.Length > maxFileSize)
            {
                return BadRequest(new { message = "File size exceeds the 5MB limit." });
            }

            // Generate a unique filename
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";

            // Define the path to save the image
            var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads", "avatars");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            try
            {
                // Save the file to the server
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await avatar.CopyToAsync(stream);
                }

                // Construct the URL to access the uploaded image
                var avatarUrl = $"{Request.Scheme}://{Request.Host}/uploads/avatars/{uniqueFileName}";

                return Ok(new { avatarImageUrl = avatarUrl });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error uploading avatar: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error uploading the file." });
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
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Invalid file type. Only JPG, PNG, and GIF are allowed." });
        }

        // Validate file size (e.g., max 5MB)
        const long maxFileSize = 5 * 1024 * 1024; // 5 MB
        if (avatar.Length > maxFileSize)
        {
            return BadRequest(new { message = "File size exceeds the 5MB limit." });
        }

        // Generate a unique filename
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";

        // Define the path to save the image
        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads", "avatars");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        try
        {
            // Save the file to the server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(stream);
            }

            // Delete existing avatar file if it exists and is not the default
            if (!string.IsNullOrEmpty(user.AvatarImageUrl) && !user.AvatarImageUrl.Contains("default-avatar.png"))
            {
                try
                {
                    var existingFileName = Path.GetFileName(user.AvatarImageUrl);
                    var existingFilePath = Path.Combine(uploadsFolder, existingFileName);

                    if (System.IO.File.Exists(existingFilePath))
                    {
                        System.IO.File.Delete(existingFilePath);
                    }
                }
                catch (Exception ex)
                {
                    // Log the exception
                    Console.WriteLine($"Error deleting old avatar: {ex.Message}");
                }
            }

            // Construct the URL to access the uploaded image
            var avatarUrl = $"{Request.Scheme}://{Request.Host}/uploads/avatars/{uniqueFileName}";

            // Update the user's AvatarImageUrl
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
            Console.WriteLine($"Error uploading avatar: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error uploading the file." });
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

        // Get the user from the database
        var user = await _userManager.FindByIdAsync(model.Id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        // Delete existing avatar file if it exists and is not the default
        if (!string.IsNullOrEmpty(user.AvatarImageUrl) && !user.AvatarImageUrl.Contains("default-avatar.png"))
        {
            try
            {
                var existingFileName = Path.GetFileName(user.AvatarImageUrl);
                var existingFilePath = Path.Combine(_environment.ContentRootPath, "uploads", "avatars", existingFileName);

                if (System.IO.File.Exists(existingFilePath))
                {
                    System.IO.File.Delete(existingFilePath);
                    Console.WriteLine($"Deleted old avatar: {existingFilePath}");
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error deleting old avatar: {ex.Message}");
            }
        }

        // Update the user's AvatarImageUrl
        user.AvatarImageUrl = model.AvatarImageUrl;

        // Save changes to the database
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Failed to update user's avatar." });
        }

        return Ok();
    }



    }
}

