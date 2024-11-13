using AutoMapper;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MelloApp.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FinalPredictionController : ControllerBase
    {
        private readonly IFinalPredictionRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<FinalPredictionController> _logger;

        public FinalPredictionController(IFinalPredictionRepository repository, ILogger<FinalPredictionController> logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: /FinalPrediction
        [HttpGet]
        public async Task<IActionResult> GetFinalPredictions()
        {
            var predictions = await _repository.GetAllAsync();

            var predictionsDto = _mapper.Map<List<GetFinalPredictionDto>>(predictions);

            return Ok(predictionsDto);
        }

        // GET: /FinalPrediction/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFinalPrediction(string id)
        {
            var prediction = await _repository.GetByIdAsync(id);

            if (prediction == null)
            {
                return NotFound();
            }

            var predictionDto = _mapper.Map<GetFinalPredictionDto>(prediction);

            return Ok(predictionDto);
        }

        // POST: /FinalPrediction
        [HttpPost]
        public async Task<IActionResult> CreateFinalPrediction([FromBody] AddFinalPredictionDto predictionDto)
        {
            if (ModelState.IsValid)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the user ID of the logged-in user

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User ID could not be determined. Please log in again.");
                }

                predictionDto.UserId = userId;
                
                var prediction = _mapper.Map<FinalPrediction>(predictionDto);

                prediction = await _repository.CreateAsync(prediction);

                var predictionResponse = _mapper.Map<GetFinalPredictionDto>(prediction);

                return CreatedAtAction(nameof(GetFinalPrediction), new { id = prediction.Id }, prediction);
            }

            return BadRequest();
        }

        // PUT: /FinalPrediction
        [HttpPut]
        public async Task<IActionResult> UpdateFinalPrediction(string id, [FromBody] UpdateFinalPredictionDto predictionDto)
        {
            if (ModelState.IsValid)
            {
                var prediction =  _mapper.Map<FinalPrediction>(predictionDto);

                prediction = await _repository.UpdateAsync(id, prediction);

                if (prediction == null)
                {
                    return NotFound();
                }

                var predictionResponse = _mapper.Map<GetFinalPredictionDto>(prediction);

                return Ok(predictionResponse);

            }

            return BadRequest();
        }

        // DELETE: /FinalPrediction

        [HttpDelete]
        public async Task<IActionResult> DeleteFinalPrediction(string id)
        {

           var finalPrediction = await _repository.DeleteAsync(id);

            if (finalPrediction == null)
            {
                return NotFound();
            }

            var finalPredictionDto = _mapper.Map<GetFinalPredictionDto>(finalPrediction);

            return Ok(finalPredictionDto);
        }

        // POST: /FinalPrediction/Batch
        [HttpPost("batch")]
        public async Task<IActionResult> CreateBatchFinalPrediction([FromBody] AddBatchFinalPredictionDto batchFinalPredictionDto)
        {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the user ID of the logged-in user

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User ID could not be determined. Please log in again.");
                }

                if (batchFinalPredictionDto.Predictions == null || !batchFinalPredictionDto.Predictions.Any())
                {
                    return BadRequest("No predictions provided.");
                }

                var finalPredictions = new List<FinalPrediction>();

                foreach (var predictionDto in batchFinalPredictionDto.Predictions)
                {
                    predictionDto.UserId = userId;
                    var prediction = _mapper.Map<FinalPrediction>(predictionDto);
                    finalPredictions.Add(prediction);
                }

                try
                {
                    await _repository.CreateBatchAsync(finalPredictions);
                    var finalPredictionResponse = finalPredictions.Select(p => _mapper.Map<GetFinalPredictionDto>(p)).ToList();
                    return Ok(finalPredictionResponse);

                }
                catch (Exception e)
                {
                    // Log the exception
                    return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the finalPredictions.");
                }
            
        }

    }
}
