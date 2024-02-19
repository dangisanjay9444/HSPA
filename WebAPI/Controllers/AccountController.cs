using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WebAPI.DTOs;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class AccountController : BaseController
    {
        public IUnitOfWork Uow { get; }
        public IConfiguration Configuration { get; }

        public AccountController(IUnitOfWork uow, IConfiguration configuration)
        {            
            this.Uow = uow;      
            this.Configuration = configuration;      
        }
        //api/account/login
        [HttpPost("login")]
        public async Task<IActionResult> Login (LoginReqDTO loginReqDTO)
        {
            var user = await Uow.userRepository.Authenticate(loginReqDTO.UserName, loginReqDTO.Password);

            if (user == null)
            {
                return Unauthorized();
            }
            else
            {
                var loginRes = new LoginResDto();
                loginRes.UserName = user.UserName;
                loginRes.Token = CreateJWT(user); //"Token needs to be generated";
                return Ok(loginRes);
            }
        }

        //api/account/register
        [HttpPost("register")]
        public async Task<IActionResult> Register (LoginReqDTO loginReqDTO)
        {
            if(await Uow.userRepository.UserAlreadyExists(loginReqDTO.UserName))
            {
                return BadRequest("UserName already exists please use another one");
            }
            else
            {
                Uow.userRepository.Register(loginReqDTO.UserName, loginReqDTO.Password);
                await Uow.SaveAsync();
                return StatusCode(201);
            }

        }

        private string CreateJWT(User user)
        {
            var secretkey = Configuration.GetSection("AppSettings:Key").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretkey));

            var claims = new Claim[]{
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier,user.ID.ToString())
            };

            var singingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(15),
                SigningCredentials = singingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }
    }
}