using System;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class City
    {
        public int Id { get; set; }
    
        public string Name { get; set; }
        [Required]
        public int CountryID { get; set; }

        public string UserModified{get;set;}

        public DateTime DateModified { get; set; }
    }
}