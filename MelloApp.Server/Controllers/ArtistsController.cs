using MelloApp.Server.Data;
using MelloApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ArtistsController> _logger;

        public ArtistsController(ApplicationDbContext context, ILogger<ArtistsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: /Artists
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetArtists()
        {
            var artists = await _context.Artists.ToListAsync();
            return Ok(artists);
        }

        // GET: /Artists/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArtist(int id)
        {
            var artist = await _context.Artists.FindAsync(id);
            if (artist == null)
            {
                return NotFound();
            }
            return Ok(artist);
        }

        // POST: /Artists
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateArtist([FromBody] Artist model)
        {
            var artist = new Artist
            {
                Name = model.Name,
                Song = model.Song,
                StartingNumber = model.StartingNumber,
                SubCompetitionId = model.SubCompetitionId
            };

            _context.Artists.AddAsync(artist);
            await _context.SaveChangesAsync();

            return Ok(artist);

        }

        // PUT: /Artists/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArtist(int id, [FromBody] Artist model)
        {
            var artist = await _context.Artists.FindAsync(id);

            if (artist == null)
            {
                return NotFound();
            }

            artist.Name = model.Name;
            artist.Song = model.Song;
            artist.StartingNumber = model.StartingNumber;
            artist.SubCompetitionId = model.SubCompetitionId;
            await _context.SaveChangesAsync();

            return Ok(artist);
        }

        // DELETE: /Artists/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtist(int id)
        {
            var artist = await _context.Artists.FindAsync(id);

            if (artist == null)
            {
                return NotFound();
            }

            _context.Artists.Remove(artist);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
