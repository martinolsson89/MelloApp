using AutoMapper;
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
    public class ResultOfSubCompetitionController : ControllerBase
    {
        private readonly IRepository<ResultOfSubCompetition> _repository;
        private readonly ILogger<ResultOfSubCompetitionController> _logger;
        private readonly IMapper _mapper;

        public ResultOfSubCompetitionController(IRepository<ResultOfSubCompetition> repository,
            ILogger<ResultOfSubCompetitionController> logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: /ResultOfSubCompetition
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetResultsOfSubCompetitions()
        {
            var resultsOfSubCompetitions = await _repository.GetAllAsync();

            var resultsOfSubCompetitionsDto = _mapper.Map<List<GetResultOfSubCompetitionDto>>(resultsOfSubCompetitions);

            return Ok(resultsOfSubCompetitionsDto);
        }

        // GET: /ResultOfSubCompetition/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetResultOfSubCompetition(string id)
        {
            var resultOfSubCompetition = await _repository.GetByIdAsync(id);

            var resultOfSubCompetitionDto = _mapper.Map<GetResultOfSubCompetitionDto>(resultOfSubCompetition);

            return Ok(resultOfSubCompetitionDto);
        }

        // POST: /ResultOfSubCompetition
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateResultOfSubCompetition(
            [FromBody] AddResultOfSubCompetitionDto resultOfSubCompetitionDto)
        {
            if (ModelState.IsValid)
            {
                var resultOfSubCompetition = _mapper.Map<ResultOfSubCompetition>(resultOfSubCompetitionDto);

                resultOfSubCompetition = await _repository.CreateAsync(resultOfSubCompetition);

                var resultOfSubCompetitionResponse = _mapper.Map<GetResultOfSubCompetitionDto>(resultOfSubCompetition);

                return CreatedAtAction(nameof(GetResultOfSubCompetition), new { id = resultOfSubCompetition.Id },
                    resultOfSubCompetitionResponse);
            }

            return BadRequest(ModelState);
        }

        // PUT: /ResultOfSubCompetition/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResultOfSubCompetition(string id,
            [FromBody] UpdateResultOfSubCompetitionDto resultOfSubCompetitionDto)
        {
            if (ModelState.IsValid)
            {
                var resultOfSubCompetition = _mapper.Map<ResultOfSubCompetition>(resultOfSubCompetitionDto);

                resultOfSubCompetition = await _repository.UpdateAsync(id, resultOfSubCompetition);

                if (resultOfSubCompetition == null)
                {
                    return NotFound();
                }

                var resultOfSubCompetitionResponse = _mapper.Map<GetResultOfSubCompetitionDto>(resultOfSubCompetition);

                return Ok(resultOfSubCompetitionResponse);

            }

            return BadRequest(ModelState);
        }

        // DELETE: /ResultOfSubCompetition/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResultOfSubCompetition(string id)
        {
            var resultOfSubCompetition = await _repository.DeleteAsync(id);

            if (resultOfSubCompetition == null)
            {
                return NotFound();
            }

            var resultOfSubCompetitionResponse = _mapper.Map<GetResultOfSubCompetitionDto>(resultOfSubCompetition);

            return Ok(resultOfSubCompetitionResponse);
        }
    }
}

