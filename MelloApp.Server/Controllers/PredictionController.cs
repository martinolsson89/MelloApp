using AutoMapper;
using MelloApp.Server.Interface;
using MelloApp.Server.Models;
using MelloApp.Server.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MelloApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PredictionController : ControllerBase
    {
        private readonly IRepository<Prediction> _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<PredictionController> _logger;

        public PredictionController(IRepository<Prediction> repository, ILogger<PredictionController> logger, IMapper mapper)
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
    }
}
