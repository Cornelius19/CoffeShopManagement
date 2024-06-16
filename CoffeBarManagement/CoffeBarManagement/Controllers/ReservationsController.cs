using CoffeBarManagement.Data;
using CoffeBarManagement.DTOs.Reservation;
using CoffeBarManagement.Models.IdentityModels;
using CoffeBarManagement.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection;

namespace CoffeBarManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly Data.ApplicationContext _applicationContext;
        private readonly UserManager<User> _userManager;

        public ReservationsController(Data.ApplicationContext applicationContext, UserManager<User> userManager)
        {
            this._applicationContext = applicationContext;
            this._userManager = userManager;
        }


        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpPost("create-reservation-client/{id}")]
        public async Task<IActionResult> CreateReservation(CreateReservationDto model,int id)
        {
            var clientDetails = await _applicationContext.Clients.FindAsync(id);
            if (clientDetails == null) return NotFound();
            var reservationToAdd = new Reservation
            {
                ReservationDate = model.Reservationdate,
                GuestNumber = model.GuestNumber,
                ReservationStatus = model.ReservationStatus,
                Duration = model.Duration,
                ClientId = clientDetails.ClientId,
                TableId = model.TableId,
                FirstName = clientDetails.FirstName,
                LastName = clientDetails.LastName,
                PhoneNumber = clientDetails.PhoneNumber
            };
            if (model.Reservationdate.Hour > 20 || model.Reservationdate.Hour < 8) return BadRequest(new JsonResult(new { title = "Reservation Error",message = "You can make a reservation between 08:00 - 20:00" }));
            
            if(await CheckReservationAvailabilyty(model)){
                return BadRequest(new JsonResult(new { title="Reservation already exist!", message = "There is a reservation already for that period of time, please select another table, or another time!" }));
            }
                var checkTableExist = await _applicationContext.Tables.FindAsync(model.TableId);
            if(checkTableExist == null) return NotFound(new JsonResult(new {title = "Inexisting table",message = "Such a table does not exist!"}));
            if (!CheckReservationDate(model.Reservationdate)) return BadRequest(new JsonResult(new { title = "Date error", message = "Huston we got a reservation date that is in the past send Time Machine :)!" }));
            if (!CheckTablecapacity(model.TableId, model.GuestNumber)) { return BadRequest(new JsonResult(new { title="Guest Number to big!",message = "The guest number is bigger than the table capacity, use another table!" })); }
            await _applicationContext.AddAsync<Reservation>(reservationToAdd);
            _applicationContext.SaveChanges();
            return Ok(new JsonResult(new {title = "Reservation created!", message = "You can check your reservations in AllReservations!"}));
        }


        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpPost("create-reservation-employee")]
        public async Task<IActionResult> CreateReservationEmployee(CreateReservationDto model)
        {
            var reservationToAdd = new Reservation
            {
                ReservationDate = model.Reservationdate,
                GuestNumber = model.GuestNumber,
                ReservationStatus = true,
                Duration = model.Duration,
                TableId = model.TableId,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber
            };
            if (await CheckReservationAvailabilyty(model))
            {
                return BadRequest(new JsonResult(new { title = "Reservation already exist!", message = "There is a reservation already for that period of time, please select another table, or another time!" }));
            }
            if (!CheckReservationDate(model.Reservationdate)) return BadRequest(new JsonResult(new { title = "Invalid Date",message="Huston we got a new reservation for the past, send the time machine!!!"}));
            if (!CheckTablecapacity(model.TableId, model.GuestNumber)) { return BadRequest(new JsonResult(new { title = "Capacity error!" , message = "The guest number is bigger than the table capacity, use another table!" })); }
            try
            {
                await _applicationContext.AddAsync<Reservation>(reservationToAdd);
                _applicationContext.SaveChanges();
            }
            catch
            {
                return BadRequest("Something went wrong for adding a new reservation");
            }
            return Ok(new JsonResult(new { message = "Reservation was added successfuly!" }));
        }


        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpGet("get-reservation-to-confirm")]
        public async Task<List<Reservation>> GetReservationToConfirm()
        {
            var list = new List<Reservation>();
            var emptyList = new List<Reservation>();
            var allReservations = await _applicationContext.Reservations.Where(q => q.ReservationDate > DateTime.UtcNow).ToListAsync();
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
        [HttpGet("get-confirmed-reservations")]
        public async Task<List<GetReservationDto>> GetConfirmedReservations()
        {
            var list = new List<GetReservationDto>();
            var emptyList = new List<GetReservationDto>();
            var allReservations = await _applicationContext.Reservations.ToListAsync();
            foreach (var reservation in allReservations)
            {
                if (reservation.ReservationStatus == true)
                {
                    var reservationDto = new GetReservationDto
                    {
                        ReservationId = reservation.ReservationId,
                        Reservationdate = reservation.ReservationDate,
                        GuestNumber = reservation.GuestNumber,
                        FirstName = reservation.FirstName,
                        LastName = reservation.LastName,
                        PhoneNumber = reservation.PhoneNumber,
                        ReservationStatus = true,
                        Duration = reservation.Duration,
                        TableNumber = reservation.TableId,

                    };
                    list.Add(reservationDto);
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
        [HttpGet("get-future-reservations")]
        public async Task<List<GetReservationDto>> GetFurturedReservations()
        {
            var list = new List<GetReservationDto>();
            var emptyList = new List<GetReservationDto>();
            var allReservations = await _applicationContext.Reservations.ToListAsync();
            foreach (var reservation in allReservations)
            {
                var checkReservation = DateTime.Compare(reservation.ReservationDate, DateTime.UtcNow);
                if (checkReservation >= 0) 
                {
                    if (reservation.ReservationStatus == true)
                    {
                        var reservationDto = new GetReservationDto
                        {
                            ReservationId = reservation.ReservationId,
                            Reservationdate = reservation.ReservationDate,
                            GuestNumber = reservation.GuestNumber,
                            FirstName = reservation.FirstName,
                            LastName = reservation.LastName,
                            PhoneNumber = reservation.PhoneNumber,
                            ReservationStatus = true,
                            Duration = reservation.Duration,
                            TableNumber = reservation.TableId,

                        };
                        list.Add(reservationDto);
                    }
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
            else
            {
                return BadRequest("Such a reservation does not exist!");
            }
            return Ok(new JsonResult(new {message = $"Reservation number {id} was confirmed!"}));
        }


        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpGet("reservations-client/{id}")]
        public async Task<List<GetReservationDto>> GetConfirmedReservations(int id)
        {
            var clientReservations = await _applicationContext.Reservations.Where(q => q.ClientId == id).ToListAsync();
            if(clientReservations == null) { return new List<GetReservationDto>(); }
            var reservationList = new List<GetReservationDto>();
            foreach (var reservation in clientReservations)
            {
                var reservationDto = new GetReservationDto
                {
                    ReservationId = reservation.ReservationId,
                    Reservationdate = reservation.ReservationDate,
                    GuestNumber = reservation.GuestNumber,
                    FirstName = reservation.FirstName,
                    LastName = reservation.LastName,
                    PhoneNumber = reservation.PhoneNumber,
                    ReservationStatus = reservation.ReservationStatus,
                    Duration = reservation.Duration,
                    TableNumber = reservation.TableId
                };
                reservationList.Add(reservationDto);
            }
            return reservationList;

        }

        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpDelete("delete-reservation/{userId}/{reservationId}")]
        public async Task<IActionResult> DeleteReservation(int userId, int reservationId)
        {
            var result = await _applicationContext.Reservations.FindAsync(reservationId);
            if(result == null) { return BadRequest("Such a reservation does not exist!"); }
            var checkDate = CheckReservationDate(result.ReservationDate);
            if (!checkDate)
            {
                return BadRequest("You can't cancel reservation from the past!");
            }
            try
            {
                _applicationContext.Reservations.Remove(result);
                await _applicationContext.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("Something went wrong!");
            }

            return Ok("Reservation was succsesfully deleted!");


        }

        [Authorize(Roles = Dependencis.DEFAULT_ROLE)]
        [HttpGet("get-active-reservations-client/{userId}")]
        public async Task<List<GetReservationDto>> GetFutureReservations(int userId)
        {
            var futureReservations = new List<GetReservationDto>();
            var results = await _applicationContext.Reservations.Where(q => q.ClientId == userId).ToListAsync();
            if(results == null) return new List<GetReservationDto> { };
            foreach(var reservation in results)
            {
                if (CheckReservationDate(reservation.ReservationDate))
                {
                        var reservationDto = new GetReservationDto
                        {
                            ReservationId = reservation.ReservationId,
                            Reservationdate = reservation.ReservationDate,
                            GuestNumber = reservation.GuestNumber,
                            FirstName = reservation.FirstName,
                            LastName = reservation.LastName,
                            PhoneNumber = reservation.PhoneNumber,
                            ReservationStatus = reservation.ReservationStatus,
                            Duration = reservation.Duration,
                            TableNumber = reservation.TableId,

                        };
                        futureReservations.Add(reservationDto);   
                }
            }
            return futureReservations;
        }

        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpGet("get-all-reservations-employee")]
        public async Task<List<GetReservationDto>> GetAllReservationEmployee()
        {
            var allReservations = await _applicationContext.Reservations.ToListAsync();
            var allReservationsToShow = new List<GetReservationDto>();
            if (allReservations == null) return new List<GetReservationDto>();
            foreach(var reservation in allReservations)
            {
                var reservationToAdd = new GetReservationDto
                {
                    ReservationId = reservation.ReservationId,
                    Reservationdate = reservation.ReservationDate,
                    GuestNumber = reservation.GuestNumber,
                    FirstName = reservation.FirstName,
                    LastName = reservation.LastName,
                    PhoneNumber = reservation.PhoneNumber,
                    ReservationStatus = reservation.ReservationStatus,
                    Duration = reservation.Duration,
                    TableNumber = reservation.TableId,
                };
                allReservationsToShow.Add(reservationToAdd);
            }
            return allReservationsToShow;
        }

        [Authorize(Roles = Dependencis.EMPLOYEE_ROLE)]
        [HttpDelete("delete-reservation/{reservationId}")]
        public async Task<IActionResult> DeleteReservationById(int reservationId)
        {
            var reservation = await _applicationContext.Reservations.FindAsync(reservationId);
            if (reservation == null) { return NotFound(); }
            _applicationContext.Reservations.Remove(reservation);
            await _applicationContext.SaveChangesAsync();
            return Ok(new JsonResult(new { message = "Reservation was deleted!" }));

        }

        private bool CheckTablecapacity(int table_id, int capacity)
        {
            if (table_id == 0) return true;
            var result = _applicationContext.Tables.Find(table_id);
            if(result == null) { return false;}
            if(result.Capacity < capacity)
            {
                return false;
            }
            return true;
        }
        private bool CheckReservationDate(DateTime reservationDate)
        {
            var now = DateTime.Now;
            int result = DateTime.Compare(reservationDate, now);
            if(result <= 0 ) return false;
            return true;
        }

        private async Task<bool> CheckReservationAvailabilyty(CreateReservationDto reservation)
        {
            var reservationsToCheck = await _applicationContext.Reservations.Where(r => r.TableId == reservation.TableId).ToListAsync();
            foreach (var rez in reservationsToCheck) 
            {     
                int checkStart = DateTime.Compare(reservation.Reservationdate, rez.ReservationDate.AddMinutes(-5));
                int checkEnd = DateTime.Compare(reservation.Reservationdate, rez.ReservationDate.AddHours((int)rez.Duration).AddMinutes(5)); 
                int checkBeforeStart = DateTime.Compare(reservation.Reservationdate.AddHours(reservation.Duration),rez.ReservationDate.AddMinutes(-5));
                int checkBeforeEnd = DateTime.Compare(reservation.Reservationdate.AddHours(reservation.Duration),rez.ReservationDate.AddHours((int)rez.Duration).AddMinutes(5));

                if (checkStart != -1 && checkEnd == -1)
                {
                    return true;
                }
                if (checkBeforeStart == 1 && checkBeforeEnd == -1)
                {
                    return true ;
                }
                
            }
            return false;
        }


    }   

}
