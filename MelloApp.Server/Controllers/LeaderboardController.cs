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
    public class LeaderboardController : ControllerBase
    {
        private readonly IRepository<Leaderboard> _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<SubCompetitionController> _logger;

        public LeaderboardController(IRepository<Leaderboard> repository, ILogger<SubCompetitionController> logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Leaderboard>>> Get()
        {
            var leaderboards = await _repository.GetAllAsync();

            var leaderboardsDto = _mapper.Map<List<GetLeaderboardDto>>(leaderboards);

            return Ok(leaderboardsDto);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Leaderboard>> Get(string id)
        {
            var leaderboard = await _repository.GetByIdAsync(id);

            if (leaderboard == null)
            {
                return NotFound();
            }

            var leaderboardDto = _mapper.Map<Leaderboard>(leaderboard);

            return Ok(leaderboardDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Leaderboard>> Post(AddLeaderboardDto leaderboardDto)
        {
            if (ModelState.IsValid)
            {
                var leaderboard = _mapper.Map<Leaderboard>(leaderboardDto);

                var createdLeaderboard = await _repository.CreateAsync(leaderboard);

                return CreatedAtAction(nameof(Get), new { id = createdLeaderboard.Id }, createdLeaderboard);

            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Leaderboard>> Put(string id, UpdateLeaderboardDto leaderboardDto)
        {
            if (ModelState.IsValid)
            {
                var leaderboard = _mapper.Map<Leaderboard>(leaderboardDto);

                leaderboard = await _repository.UpdateAsync(id, leaderboard);

                if (leaderboard == null)
                {
                    return NotFound();
                }

                var leaderboardResponse = _mapper.Map<GetLeaderboardDto>(leaderboard);

                return Ok(leaderboardResponse);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Leaderboard>> Delete(string id)
        {
            var leaderboard = await _repository.DeleteAsync(id);

            if (leaderboard == null)
            {
                return NotFound();
            }

            var leaderboardResponse = _mapper.Map<GetLeaderboardDto>(leaderboard);

            return Ok(leaderboardResponse);
        }
    }
}
