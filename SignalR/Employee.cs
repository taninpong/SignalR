using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalR
{
    public class Employee : Hub
    {
        public async Task AddEmployee(string fristname, string lastname, string email, string phonenumber)
        {
            var c = fristname + lastname + email + phonenumber;
        }
    }
}
