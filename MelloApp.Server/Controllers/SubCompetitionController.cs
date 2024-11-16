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
    public class SubCompetitionController : ControllerBase
    {
        private readonly ISubCompetitionRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<SubCompetitionController> _logger;

        public SubCompetitionController(ISubCompetitionRepository repository, ILogger<SubCompetitionController> logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: /SubCompetition
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetSubAllCompetitions()
        {
            var subCompetitions = await _repository.GetAllAsync();

            var subCompetitionsDto = _mapper.Map<List<GetSubCompetitionDto>>(subCompetitions);

            return Ok(subCompetitionsDto);
        }

        // GET: /SubCompetition/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubCompetition(string id)
        {
            var subCompetition = await _repository.GetByIdAsync(id);

            if (subCompetition == null)
            {
                return NotFound();
            }

            var subCompetitionDto = _mapper.Map<GetSubCompetitionDto>(subCompetition);

            return Ok(subCompetitionDto);
        }

        // POST: /SubCompetition
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateSubCompetition([FromBody] AddSubCompetitionDto subCompetitionDto)
        {
            if (ModelState.IsValid)
            {
                var subCompetition = _mapper.Map<SubCompetition>(subCompetitionDto);
                
                subCompetition = await _repository.CreateAsync(subCompetition);

                var subCompetitionResponse = _mapper.Map<GetSubCompetitionDto>(subCompetition);

                return CreatedAtAction(nameof(GetSubCompetition), new { id = subCompetition.Id }, subCompetitionResponse);
            }
            else
            {
                return BadRequest(ModelState);
            }

        }

        // PUT: /SubCompetition/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubCompetition(string id, [FromBody] UpdateSubCompetitionDto subCompetitionDto)
        {
            if (ModelState.IsValid)
            {
                var subCompetition = _mapper.Map<SubCompetition>(subCompetitionDto);

                subCompetition = await _repository.UpdateAsync(id, subCompetition);

                if (subCompetition == null)
                {
                    return NotFound();
                }

                var subCompetitionResponse = _mapper.Map<GetSubCompetitionDto>(subCompetition);

                return Ok(subCompetitionResponse);
            }
            else
            {
                return BadRequest(ModelState);
            }

        }

        // DELETE: /SubCompetition/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubCompetition(string id)
        {
            var subCompetition = await _repository.DeleteAsync(id);

            if (subCompetition == null)
            {
                return NotFound();
            }

            var subCompetitionResponse = _mapper.Map<GetSubCompetitionDto>(subCompetition);

            return Ok(subCompetitionResponse);
        }

        // GET: /SubCompetition/GetSubCompetitionsWithArtists
        [Authorize]
        [HttpGet("GetSubCompetitionsWithArtists")]
        public async Task<IActionResult> GetSubCompetitionsWithArtists()
        {
            var subCompetitions = await _repository.GetSubCompetitionsWithArtistsAsync();

            var subCompetitionsDto = _mapper.Map<List<GetSubCompetitionAndArtistsDto>>(subCompetitions);

            return Ok(subCompetitionsDto);
        }

        [Authorize]
        [HttpGet("GetSubCompetitionWithArtist/{id}")]
        public async Task<IActionResult> GetSubCompetitionWithArtist(string id)
        {
            var subCompetition = await _repository.GetSubCompetitionWithArtistAsync(id);

            if (subCompetition == null)
            {
                return NotFound();
            }

            var subCompetitionDto = _mapper.Map<GetSubCompetitionAndArtistsDto>(subCompetition);

            return Ok(subCompetitionDto);
        }

        // GET: /SubCompetition/GetSubCompetitionWithResult
        [Authorize]
        [HttpGet("GetSubCompetitionWithResult")]
        public async Task<IActionResult> GetSubCompetitionWithResult()
        {
            var subCompetitions = await _repository.GetSubCompetitionWithResultAsync();

            var subCompetitionsDto = _mapper.Map<List<GetSubCompetitionAndResultsDto>>(subCompetitions);

            return Ok(subCompetitionsDto);
        }

        [Authorize]
        [HttpGet("GetSubCompetitionWithResult/{id}")]
        public async Task<IActionResult> GetSubCompetitionWithResult(string id)
        {
            var subCompetition = await _repository.GetSubCompetitionWithResultAsync(id);

            if (subCompetition == null)
            {
                return NotFound();
            }

            var subCompetitionDto = _mapper.Map<GetSubCompetitionAndResultsDto>(subCompetition);

            return Ok(subCompetitionDto);
        }

        [Authorize]
        [HttpGet("GetSubCompetitionsWithArtistsAndPredictions")]
        public async Task<IActionResult> GetSubCompetitionsWithArtistsAndPredictions()
        {
            var subCompetitions = await _repository.GetSubCompetitionsWithArtistsAndPredictionsAsync();

            var subCompetitionsDto = new List<GetSubCompetitionWithArtistsAndPredictionsDto>();

            foreach (var subCompetition in subCompetitions)
            {
                // Map SubCompetition to DTO
                var subCompetitionDto = _mapper.Map<GetSubCompetitionWithArtistsAndPredictionsDto>(subCompetition);

                // Group predictions by artist ID
                var predictionsByArtist = subCompetition.Predictions
                    .GroupBy(p => p.Artist.Id)
                    .ToDictionary(g => g.Key, g => g.ToList());

                // Map Artists and their Predictions
                subCompetitionDto.Artists = subCompetition.Artists.Select(artist =>
                {
                    var artistDto = _mapper.Map<ArtistWithPredictionsDto>(artist);

                    // Get predictions for this artist
                    if (predictionsByArtist.TryGetValue(artist.Id, out var artistPredictions))
                    {
                        // Map Predictions to DTOs
                        artistDto.Predictions = _mapper.Map<List<PredictionWithUserDto>>(artistPredictions);
                    }
                    else
                    {
                        artistDto.Predictions = new List<PredictionWithUserDto>();
                    }

                    return artistDto;
                }).ToList();

                subCompetitionsDto.Add(subCompetitionDto);
            }

            // Order subcompetitions by date
            var orderedSubCompetitionsDto = subCompetitionsDto.OrderBy(sc => sc.Date).ToList();

            return Ok(orderedSubCompetitionsDto);
        }

    }
}
