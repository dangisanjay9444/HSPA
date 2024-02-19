using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class CityDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage ="Name is Required")]
        [StringLength(50,MinimumLength =2)]
        public string Name { get; set; }
        
        [Required]
        public int CountryID { get; set; }

    }
}