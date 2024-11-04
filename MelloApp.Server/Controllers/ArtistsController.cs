using AutoMapper;
using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        private readonly IRepository<Artist> _repository;
        private readonly ILogger<ArtistsController> _logger;
        private readonly IMapper _mapper;

        public ArtistsController(IRepository<Artist> repository, ILogger<ArtistsController> logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: /Artists
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetArtists()
        {
            var artists = await _repository.GetAllAsync();

            var artistsDto = _mapper.Map<List<GetArtistDto>>(artists);

            return Ok(artistsDto);
        }

        // GET: /Artists/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArtist(string id)
        {
            var artist = await _repository.GetByIdAsync(id);

            var artistDto = _mapper.Map<GetArtistDto>(artist);

            return Ok(artistDto);
        }

        // POST: /Artists
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateArtist([FromBody] AddArtistDto artistDto)
        {
            if (ModelState.IsValid)
            {
                var artist = _mapper.Map<Artist>(artistDto);

                artist = await _repository.CreateAsync(artist);

                var artistResponse = _mapper.Map<GetArtistDto>(artist);

                return CreatedAtAction(nameof(GetArtist), new { id = artist.Id }, artistResponse);
            }
            else
            {
                return BadRequest(ModelState);
            }

        }

        // PUT: /Artists/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArtist(string id, [FromBody] UpdateArtistDto artistDto)
        {
            if(ModelState.IsValid)
            {
                var artist = _mapper.Map<Artist>(artistDto);

                artist = await _repository.UpdateAsync(id, artist);

                if (artist == null)
                {
                    return NotFound();
                }

                var artistResponse = _mapper.Map<GetArtistDto>(artist);

                return Ok(artistResponse);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        // DELETE: /Artists/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtist(string id)
        {
            var artist = await _repository.DeleteAsync(id);

            if (artist == null)
            {
                return NotFound();
            }

            var artistResponse = _mapper.Map<GetArtistDto>(artist);

            return Ok(artistResponse);
        }
    }
}
