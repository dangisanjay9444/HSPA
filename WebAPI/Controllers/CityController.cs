using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Data;
using WebAPI.Data.Repo;
using WebAPI.DTOs;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{    
    [Authorize]
    public class CityController : BaseController
    {       
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public CityController(IUnitOfWork _uow, IMapper _mapper)
        {
            uow = _uow;
            mapper = _mapper;
        }
        
        //api/city
        [HttpGet("cities")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCities()
        {
            //throw new UnauthorizedAccessException();
            var cities = await uow.cityRepository.GetCitiesAsync();
            //AutoMapper will automatically map both the destination and source  
            var citiesDto = mapper.Map<IEnumerable<CityDto>>(cities);
            //Manual Mapping
            // var citiesDto = from c in cities
            //     select new CityDto
            //     {
            //         Id = c.Id,
            //         Name = c.Name
            //     };
            return Ok(citiesDto); 
            //new string[] { "Ram", "Shyam" };
        }

        // //Post api/city/add?cityName=Ambala
        // [HttpPost("add")]
        // //Post api/city/add/Ambala
        // [HttpPost("add/{cityName}")]
        // // To post the data in bulk as a json file
        // [HttpPost("post")]
        // public async Task<IActionResult> AddCity(string cityName)
        // {
        //     City city = new City();
        //     city.Name = cityName;
        //     await dc.Cities.AddAsync(city);
        //     await dc.SaveChangesAsync();
        //     return Ok(city); 
        // }

        
        // To post the data in bulk as a json file
        [HttpPost("post")]
        public async Task<IActionResult> AddCity(CityDto cityDto)
        {
             //AutoMapper will automatically map both the destination and source 
             var city = mapper.Map<City>(cityDto);
             city.UserModified = "Sanjay Dangi";
             city.DateModified = DateTime.Now;
            //Manual Mapping
            // var city = new City{
            //     Name = cityDto.Name,
            //     UserModified = "SD",
            //     DateModified = DateTime.Now
            // };
            uow.cityRepository.AddCity(city);
            await uow.SaveAsync();
            return StatusCode(201); 
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            uow.cityRepository.DeleteCity(id);
            await uow.SaveAsync();            
            return Ok(id); 
        }   

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityDto cityDto)
        {
            try
            {
                if (id != cityDto.Id)
                {
                    return BadRequest("Update not allowed as ID doesn't exist");
                }
                var cityFromDb = await uow.cityRepository.FindCity(id);

                if (cityFromDb == null)
                {
                    return BadRequest("Update not allowed");
                }
                cityFromDb.DateModified = DateTime.Now;
                cityFromDb.UserModified = "SD";
                mapper.Map(cityDto, cityFromDb);

                throw new Exception("Some unknown error occured.");

                await uow.SaveAsync();
                return Ok(id);
            } catch
            {
                return StatusCode(500, "Some unknown error occured");
            }
            
        }    

        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateCityPatch(int id, JsonPatchDocument<City> cityToPatch)
        {
            var cityFromDb = await uow.cityRepository.FindCity(id);
            cityFromDb.DateModified = DateTime.Now;
            cityFromDb.UserModified = "SD";
            cityToPatch.ApplyTo(cityFromDb, ModelState);
            await uow.SaveAsync();            
            return Ok(id); 
        }   

        // Use HttpPut for Partial Updates e.g. Name Update
        [HttpPut("updateCityName/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityUpdateDto cityUpdateDto)
        {
            var cityFromDb = await uow.cityRepository.FindCity(id);
            cityFromDb.DateModified = DateTime.Now;
            cityFromDb.UserModified = "SD";
            mapper.Map(cityUpdateDto, cityFromDb);
            await uow.SaveAsync();            
            return Ok(id); 
        }       
    }
}
