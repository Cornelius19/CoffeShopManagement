using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Account;
using CoffeBarManagement.Models.IdentityModels;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly ApplicationContext _applicationContext;
        private readonly UserManager<User> _userManager;

        public ReservationsController(ApplicationContext applicationContext, UserManager<User> userManager)
        {
            this._applicationContext = applicationContext;
            this._userManager = userManager;
        }
        [HttpPost("create-reservation")]
        public async Task<IActionResult> CreateReservation(ReservationDto model)
        {
            var reservationToAdd = new Reservation
            {
                ReservationDate = model.Reservationdate,
                GuestNumber = model.GuestNumber,
                ReservationStatus = model.ReservationStatus,
                Duration = model.Duration,
                ClientId = model.ClientId,
                TableId = model.TableId,
            };
            var result = _applicationContext.AddAsync<Reservation>(reservationToAdd);
            _applicationContext.SaveChanges();
            return Ok("Reservation was added successfuly!");
        }


        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpGet("get-reservation-to-confirm")]
        public async Task<List<Reservation>> GetReservationToConfirm()
        {
            var list = new List<Reservation>();
            var emptyList = new List<Reservation>();
            var allReservations = await _applicationContext.Reservations.ToListAsync();
            foreach (var reservation in allReservations)
            {
                if (reservation.ReservationStatus == false)
                {
                    list.Add(reservation);
                }
            }
            if (allReservations.Count != 0)
            {
                return list;
            }
            else
            {
                return emptyList;
            }
        }
        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPut("confirm-reservation/{id}")]
        public async Task<IActionResult> ConfirmReservation(int id)
        {
            var result = await _applicationContext.FindAsync<Reservation>(id);
            if(result != null)
            {
                result.ReservationStatus = true;
                _applicationContext.Update<Reservation>(result);
                await _applicationContext.SaveChangesAsync();
            }
            return Ok("Reservation confirmed!");
        }
    }
}
