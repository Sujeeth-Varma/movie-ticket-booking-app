package in.sujeeth.backend.controllers;

import in.sujeeth.backend.dtos.TicketBookingRequest;
import in.sujeeth.backend.dtos.TicketBookingResponse;
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
    public ResponseEntity<?> getAllBookingsByUser(Authentication auth) {
        try {
            var response = bookingService.getBookingsByUser(auth.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> bookSeats(@RequestBody TicketBookingRequest ticketRequest, Authentication auth){
        try {
            var user = userService.getUserByEmail(auth.getName());
            var response = bookingService.bookSeats(user, ticketRequest.getShowId(), ticketRequest.getSeatIds());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingDetail(@PathVariable Long bookingId, Authentication auth) {
        try {
            TicketBookingResponse response = bookingService.getBookingDetails(bookingId, auth.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long bookingId, Authentication auth) {
        try {
            boolean isDeleted = bookingService.deleteBookingById(bookingId, auth.getName());
            if (!isDeleted) return ResponseEntity.ok("failed to delete booking try again!");
            return ResponseEntity.ok("Successfully deleted booking");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
