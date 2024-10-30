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
    [Route("[controller]")]
    [ApiController]
    public class SubCompetitionController : ControllerBase
    {
        private readonly IRepository<SubCompetition> _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<SubCompetitionController> _logger;

        public SubCompetitionController(IRepository<SubCompetition> repository, ILogger<SubCompetitionController> logger, IMapper mapper)
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
        public async Task<IActionResult> UpdateSubCompetition(string id, [FromBody] SubCompetition model)
        {
            if (ModelState.IsValid)
            {
                var subCompetition = await _repository.UpdateAsync(id, model);

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
    }
}
