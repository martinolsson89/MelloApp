using AutoMapper;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MelloApp.Server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class ResultOfSubCompetitionController : ControllerBase
    {
        private readonly IResultOfSubCompetitionRepository _repository;
        private readonly ILogger<ResultOfSubCompetitionController> _logger;
        private readonly IMapper _mapper;

        public ResultOfSubCompetitionController(IResultOfSubCompetitionRepository repository,
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
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateResultOfSubCompetition([FromRoute]string id,
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
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteResultOfSubCompetition([FromRoute]string id)
        {
            var resultOfSubCompetition = await _repository.DeleteAsync(id);

            if (resultOfSubCompetition == null)
            {
                return NotFound();
            }

            var resultOfSubCompetitionResponse = _mapper.Map<GetResultOfSubCompetitionDto>(resultOfSubCompetition);

            return Ok(resultOfSubCompetitionResponse);
        }

        // POST: /ResultOfSubCompetition/Batch
        [Authorize(Roles = "Admin")]
        [HttpPost("Batch")]
        public async Task<IActionResult> CreateBatchResultOfSubCompetition(
            [FromBody] AddBatchResultOfSubCompetitionDto resultOfSubCompetitionDto)
        {
            if (ModelState.IsValid)
            {

                if (resultOfSubCompetitionDto.Results == null || !resultOfSubCompetitionDto.Results.Any())
                {
                    return BadRequest("No predictions provided.");
                }

                var resultsOfSubCompetitions = _mapper.Map<IEnumerable<ResultOfSubCompetition>>(resultOfSubCompetitionDto.Results);

               resultsOfSubCompetitions = await _repository.CreateBatchAsync(resultsOfSubCompetitions);

               var resultsOfSubCompetitionsResponse = _mapper.Map<List<GetResultOfSubCompetitionDto>>(resultsOfSubCompetitions);

                return Ok(resultsOfSubCompetitionsResponse);
            }

            return BadRequest(ModelState);
        }

        // PUT: /ResultOfSubCompetition/batch
        [Authorize(Roles = "Admin")]
        [HttpPut("batch")]
        public async Task<IActionResult> UpdateResultsOfSubCompetitions(
            [FromBody] List<UpdateBatchResultOfSubCompetitionDto> resultOfSubCompetitionDtos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedResults = new List<ResultOfSubCompetition>();
            foreach (var dto in resultOfSubCompetitionDtos)
            {
                var resultOfSubCompetition = _mapper.Map<ResultOfSubCompetition>(dto);
                var updatedResult = await _repository.UpdateBatchAsync(resultOfSubCompetition);

                if (updatedResult == null)
                {
                    return NotFound($"ResultOfSubCompetition with artistId {dto.ArtistId} not found.");
                }

                updatedResults.Add(updatedResult);
            }

            var resultOfSubCompetitionResponses = _mapper.Map<List<UpdateBatchResultOfSubCompetitionDto>>(updatedResults);
            return Ok(resultOfSubCompetitionResponses);
        }

    }
}

