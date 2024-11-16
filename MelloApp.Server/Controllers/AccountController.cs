using MelloApp.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
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

            // Map only the allowed properties from the model to the user entity
            user.AvatarImageUrl = model.AvatarImageUrl;
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
    }
}

