using AutoMapper;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MelloApp.Server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class ScoreAfterSubCompetitionController : ControllerBase
    {
        private readonly ILogger<ScoreAfterSubCompetition> _logger;
        private readonly IMapper _mapper;
        private readonly IRepository<ScoreAfterSubCompetition> _repository;

        public ScoreAfterSubCompetitionController(ILogger<ScoreAfterSubCompetition> logger, IMapper mapper, IRepository<ScoreAfterSubCompetition> repository)
        {
            _logger = logger;
            _mapper = mapper;
            _repository = repository;
        }

        // GET: /ScoreAfterSubCompetition
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetScoreAfterSubCompetitions()
        {
            var scoreAfterSubCompetitions = await _repository.GetAllAsync();

            var scoreAfterSubCompetitionsDto = _mapper.Map<List<GetScoreAfterSubCompetitionDto>>(scoreAfterSubCompetitions);

            return Ok(scoreAfterSubCompetitionsDto);
        }

        // GET: /ScoreAfterSubCompetition/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetScoreAfterSubCompetition(string id)
        {
            var scoreAfterSubCompetition = await _repository.GetByIdAsync(id);

            var scoreAfterSubCompetitionDto = _mapper.Map<GetScoreAfterSubCompetitionDto>(scoreAfterSubCompetition);

            return Ok(scoreAfterSubCompetitionDto);
        }

        // POST: /ScoreAfterSubCompetition
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateScoreAfterSubCompetition([FromBody] AddScoreAfterSubCompetitionDto scoreAfterSubCompetitionDto)
        {
            if (ModelState.IsValid)
            {
                var scoreAfterSubCompetition = _mapper.Map<ScoreAfterSubCompetition>(scoreAfterSubCompetitionDto);

                await _repository.CreateAsync(scoreAfterSubCompetition);

                var scoreAfterSubCompetitionResponseDto = _mapper.Map<GetScoreAfterSubCompetitionDto>(scoreAfterSubCompetition);

                return CreatedAtAction(nameof(GetScoreAfterSubCompetition), new { id = scoreAfterSubCompetitionResponseDto.Id }, scoreAfterSubCompetitionResponseDto);
            }

            return BadRequest(ModelState);
        }

        // PUT: /ScoreAfterSubCompetition/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScoreAfterSubCompetition(string id, [FromBody] AddScoreAfterSubCompetitionDto scoreAfterSubCompetitionDto)
        {
            if (ModelState.IsValid)
            {
                var scoreAfterSubCompetition = _mapper.Map<ScoreAfterSubCompetition>(scoreAfterSubCompetitionDto);

                var updatedScoreAfterSubCompetition = await _repository.UpdateAsync(id, scoreAfterSubCompetition);

                if (updatedScoreAfterSubCompetition == null)
                {
                    return NotFound();
                }

                var updatedScoreAfterSubCompetitionDto = _mapper.Map<GetScoreAfterSubCompetitionDto>(updatedScoreAfterSubCompetition);

                return Ok(updatedScoreAfterSubCompetitionDto);
            }

            return BadRequest(ModelState);
        }

        // DELETE: /ScoreAfterSubCompetition/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScoreAfterSubCompetition(string id)
        {
            var deletedScoreAfterSubCompetition = await _repository.DeleteAsync(id);

            if (deletedScoreAfterSubCompetition == null)
            {
                return NotFound();
            }

            var deletedScoreAfterSubCompetitionDto = _mapper.Map<GetScoreAfterSubCompetitionDto>(deletedScoreAfterSubCompetition);

            return Ok(deletedScoreAfterSubCompetitionDto);
        }
    }
}
