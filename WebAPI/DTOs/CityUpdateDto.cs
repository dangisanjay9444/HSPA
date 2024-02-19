using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class CityUpdateDto
    {
        [Required(ErrorMessage = "Name is Required")]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; }       

    }
}