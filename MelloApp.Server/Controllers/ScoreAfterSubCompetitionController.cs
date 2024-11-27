using AutoMapper;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Account;
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
        private readonly IScoreAfterSubCompetitionRepository _repository;

        public ScoreAfterSubCompetitionController(ILogger<ScoreAfterSubCompetition> logger, IMapper mapper, IScoreAfterSubCompetitionRepository repository)
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

        [Authorize]
        [HttpGet("GetUserScores")]
        public async Task<IActionResult> GetUserScores()
        {
            var userScores = await _repository.GetUserScoresAsync();

            var userScoresDto = _mapper.Map<List<GetUserScoreDto>>(userScores);

            return Ok(userScoresDto);
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
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateScoreAfterSubCompetition([FromRoute] string id, [FromBody] AddScoreAfterSubCompetitionDto scoreAfterSubCompetitionDto)
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
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteScoreAfterSubCompetition([FromRoute] string id)
        {
            var deletedScoreAfterSubCompetition = await _repository.DeleteAsync(id);

            if (deletedScoreAfterSubCompetition == null)
            {
                return NotFound();
            }

            var deletedScoreAfterSubCompetitionDto = _mapper.Map<GetScoreAfterSubCompetitionDto>(deletedScoreAfterSubCompetition);

            return Ok(deletedScoreAfterSubCompetitionDto);
        }

        //GET: ScoreAfterSubCompetition/GetLeaderboardBySubCompetition

        [Authorize]
        [HttpGet("GetLeaderboardBySubCompetition")]
        public async Task<IActionResult> GetLeaderboardBySubCompetition()
        {
            var subCompetitions = await _repository.GetScoresGroupedBySubCompetitionAsync();

            var subCompetitionLeaderboards = _mapper.Map<List<SubCompetitionWithScoresDto>>(subCompetitions);

            // Order the SubCompetitions by Date
            subCompetitionLeaderboards = subCompetitionLeaderboards.OrderBy(sc => sc.Date).ToList();

            return Ok(subCompetitionLeaderboards);
        }


    }
}
