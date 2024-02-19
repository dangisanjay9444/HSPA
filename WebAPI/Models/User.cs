using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class User
    {
        public int ID { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        //public string Password { get; set; }

        // create the password field as byte array 
        //to store the password in binary form to protect the password using the hashing and salting.
        public byte[] Password { get; set; }
        public byte[] PasswordKey { get; set; }
    }
}