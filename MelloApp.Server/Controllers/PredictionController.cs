using System.Security.Claims;
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
    public class PredictionController : ControllerBase
    {
        private readonly IPredictionRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<PredictionController> _logger;

        public PredictionController(IPredictionRepository repository, ILogger<PredictionController> logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: /Prediction
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetPredictions()
        {
            var predictions = await _repository.GetAllAsync();

            var predictionsDto = _mapper.Map<List<GetPredictionDto>>(predictions);

            return Ok(predictionsDto);
        }

        // GET: /Prediction/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPrediction(string id)
        {
            var prediction = await _repository.GetByIdAsync(id);

            if (prediction == null)
            {
                return NotFound();
            }

            var predictionDto = _mapper.Map<GetPredictionDto>(prediction);

            return Ok(predictionDto);
        }

        // POST: /Prediction
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePrediction([FromBody] AddPredictionDto predictionDto)
        {
            if (ModelState.IsValid)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the user ID of the logged-in user

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User ID could not be determined. Please log in again.");
                }

                predictionDto.UserId = userId; // Assign the user ID to the predictionDto

                var prediction = _mapper.Map<Prediction>(predictionDto);

                prediction = await _repository.CreateAsync(prediction);

                var predictionResponse = _mapper.Map<GetPredictionDto>(prediction);

                return CreatedAtAction(nameof(GetPrediction), new { id = prediction.Id }, predictionResponse);
            }

            return BadRequest(ModelState);
        }

        // PUT: /Prediction/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrediction(string id, [FromBody] UpdatePredictionDto predictionDto)
        {
            if (ModelState.IsValid)
            {
                var prediction = _mapper.Map<Prediction>(predictionDto);

                prediction = await _repository.UpdateAsync(id, prediction);

                if (prediction == null)
                {
                    return NotFound();
                }

                var predictionResponse = _mapper.Map<GetPredictionDto>(prediction);

                return Ok(predictionResponse);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        // DELETE: /Prediction/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrediction(string id)
        {
            var prediction = await _repository.GetByIdAsync(id);

            if (prediction == null)
            {
                return NotFound();
            }

            var predictionResponse = _mapper.Map<DeletePredictionDto>(prediction);

            return Ok(predictionResponse);
        }

        [Authorize]
        [HttpPost("batch")]
        public async Task<IActionResult> CreateBatchPredictions([FromBody] AddBatchPredictionDto batchPredictionDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID could not be determined. Please log in again.");
            }

            if (batchPredictionDto.Predictions == null || !batchPredictionDto.Predictions.Any())
            {
                return BadRequest("No predictions provided.");
            }

            var predictions = new List<Prediction>();
            foreach (var predictionDto in batchPredictionDto.Predictions)
            {
                predictionDto.UserId = userId;
                var prediction = _mapper.Map<Prediction>(predictionDto);
                predictions.Add(prediction);
            }

            try
            {
                // Assuming your repository has a method for batch insert
                await _repository.CreateBatchAsync(predictions);

                var predictionResponses = predictions.Select(p => _mapper.Map<GetPredictionDto>(p)).ToList();
                return Ok(predictionResponses);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the predictions.");
            }
        }

    }
}
