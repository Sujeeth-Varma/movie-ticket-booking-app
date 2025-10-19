package in.sujeeth.backend.controllers;

import in.sujeeth.backend.dtos.TicketBookingRequest;
import in.sujeeth.backend.repositories.BookingRepository;
import in.sujeeth.backend.repositories.BookingSeatRepository;
import in.sujeeth.backend.services.BookingService;
import in.sujeeth.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public ResponseEntity<?> getSeatsByUser(Authentication auth) {
        try {
            var response = bookingService.getBookingsByUser(auth.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> holdSeats(@RequestBody TicketBookingRequest ticketRequest, Authentication auth){
        try {
            var user = userService.getUserByEmail(auth.getName());
            var response = bookingService.bookSeats(user, ticketRequest.getShowId(), ticketRequest.getSeatIds());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
