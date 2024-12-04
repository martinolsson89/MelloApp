using System.Text.Json;
using MelloApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MelloApp.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HomeContentController : ControllerBase
    {
        private readonly string _filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "homeContent.json");
        private readonly string _registerFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "settings.json");

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetHomeContent()
        {
            if (!System.IO.File.Exists(_filePath))
            {
                return NotFound("Home content file not found.");
            }

            var json = await System.IO.File.ReadAllTextAsync(_filePath);
            var homeContent = JsonSerializer.Deserialize<HomeContent>(json);
            return Ok(homeContent);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> UpdateHomeContent([FromBody] HomeContent updatedContent)
        {
            if (updatedContent == null) return BadRequest("Content is null.");

            var json = JsonSerializer.Serialize(updatedContent, new JsonSerializerOptions { WriteIndented = true });
            await System.IO.File.WriteAllTextAsync(_filePath, json);

            return Ok(updatedContent);
        }

        
        [HttpGet ("register")]
        public async Task<IActionResult> GetRegister()
        {
            if (!System.IO.File.Exists(_registerFilePath))
            {
                return NotFound("Register file not found.");
            }

            var json = await System.IO.File.ReadAllTextAsync(_registerFilePath);
            var registerDto = JsonSerializer.Deserialize<RegisterDto>(json);
            return Ok(registerDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost ("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var json = JsonSerializer.Serialize(registerDto, new JsonSerializerOptions { WriteIndented = true });
            await System.IO.File.WriteAllTextAsync(_registerFilePath, json);

            return Ok(registerDto);
        }

    }
}
