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

    }
}
