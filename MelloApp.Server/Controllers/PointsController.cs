using AutoMapper;
using MelloApp.Server.Data;
using MelloApp.Server.Models.Dto;
using MelloApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PointsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly PointsCalculationService _pointsCalculationService;
        private readonly IMapper _mapper;
        private readonly LeaderboardService _leaderboardService;

        public PointsController(ApplicationDbContext context, PointsCalculationService pointsCalculationService, IMapper mapper, LeaderboardService leaderboardService)
        {
            _context = context;
            _pointsCalculationService = pointsCalculationService;
            _mapper = mapper;
            _leaderboardService = leaderboardService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{subCompetitionId}")]
        public async Task<IActionResult> CalculatePoints(string subCompetitionId)
        {
            try
            {
              var userScoreDtos =  await _pointsCalculationService.CalculateAndStorePointsAsync(subCompetitionId);

              if (userScoreDtos == null || userScoreDtos.Count == 0)
              {
                  return NotFound();
              } 
              
              var orderedList = userScoreDtos.OrderByDescending(u => u.Points).ToList();

                return Ok(orderedList);


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("update-points-by-details")]
        public async Task<IActionResult> UpdatePointsByDetails([FromBody] UpdatePointsByDetailsDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find the user based on FirstName and LastName
            var userId = await _context.Users
                .Where(u => u.FirstName == dto.FirstName && u.LastName == dto.LastName)
                .Select(u => u.Id)
                .FirstOrDefaultAsync();

            if (userId == null)
                return NotFound(new { Message = "User not found." });

            // Find the sub-competition based on Name
            var subCompetitionId = await _context.SubCompetitions
                .Where(sc => sc.Name == dto.SubCompetitionName)
                .Select(sc => sc.Id)
                .FirstOrDefaultAsync();

            if (subCompetitionId == null)
                return NotFound(new { Message = "SubCompetition not found." });

            // Find the score entry
            var existingScoreEntry = await _context.ScoresAfterSubCompetitions
                .FirstOrDefaultAsync(s => s.UserId == userId && s.SubCompetitionId == subCompetitionId);

            if (existingScoreEntry == null)
                return NotFound(new { Message = "Sub competition Score entry not found." });


            // Update points in SubCompetition
            existingScoreEntry.Points = dto.Points;
            await _context.SaveChangesAsync();


            var result = await _leaderboardService.CalculateLeaderboard(userId, subCompetitionId);

            if (result is NotFoundResult)
            {
                return NotFound(new { Message = "Leaderboard entry not found." });
            }


            return Ok(new { Success = true });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("CalculatePointsFinal")]
        public async Task<IActionResult> CalculatePointsFinal()
        {
            try
            {
                var result = await _leaderboardService.CalculateAndStoreFinalPoints();

                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }


}
