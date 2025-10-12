package in.sujeeth.backend.controllers;

import in.sujeeth.backend.dtos.TicketBookingRequest;
import in.sujeeth.backend.repositories.BookingRepository;
import in.sujeeth.backend.repositories.BookingSeatRepository;
import in.sujeeth.backend.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> holdSeats(@RequestBody TicketBookingRequest ticketRequest, Authentication auth){
        var response = bookingService.holdSeats(ticketRequest, auth.getName());
        return ResponseEntity.ok(response);
    }
}
