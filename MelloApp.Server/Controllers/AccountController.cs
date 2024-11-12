using MelloApp.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MelloApp.Server.Models.Account;

namespace MelloApp.Server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
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

        // GET: /Account/pingauth
        [HttpGet("pingauth")]
        [Authorize]
        public IActionResult PingAuth()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            return Ok(new
            {
                Email = email
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
        [HttpGet("pingauthme")]
        [Authorize]
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
                LastName = user.LastName
                // Include other non-sensitive user properties as needed
            });
        }
    }
}

