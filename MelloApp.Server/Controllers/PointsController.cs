using AutoMapper;
using MelloApp.Server.Data;
using MelloApp.Server.Models.Dto;
using MelloApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MelloApp.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PointsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly PointsCalculationService _pointsCalculationService;
        private readonly IMapper _mapper;

        public PointsController(ApplicationDbContext context, PointsCalculationService pointsCalculationService, IMapper mapper)
        {
            _context = context;
            _pointsCalculationService = pointsCalculationService;
            _mapper = mapper;
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

    }
}
