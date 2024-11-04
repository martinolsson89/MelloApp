using AutoMapper;
using MelloApp.Server.Data;
using MelloApp.Server.Interface;
using MelloApp.Server.Models.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MelloApp.Server.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IRepository<ApplicationUser> _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<ApplicationUser> _logger;

        public UsersController(IRepository<ApplicationUser> repository, ILogger<ApplicationUser> logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: /User
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repository.GetAllAsync();

            var usersDto = _mapper.Map<List<UserDto>>(users);

            return Ok(usersDto);
        }

        // GET: /User/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _repository.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var userDto = _mapper.Map<UserDto>(user);

            return Ok(userDto);
        }
    }
}
