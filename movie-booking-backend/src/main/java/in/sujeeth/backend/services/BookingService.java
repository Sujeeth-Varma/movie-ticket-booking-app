package in.sujeeth.backend.services;

import in.sujeeth.backend.dtos.TicketBookingRequest;
import in.sujeeth.backend.dtos.TicketBookingResponse;
import in.sujeeth.backend.entities.User;
import in.sujeeth.backend.repositories.BookingRepository;
import in.sujeeth.backend.repositories.BookingSeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    @Autowired
    private UserService userService;


    public TicketBookingResponse holdSeats(TicketBookingRequest ticketRequest, String userEmail) {
        TicketBookingResponse response = new TicketBookingResponse();
        try {
            User user = userService.getUserByEmail(userEmail);
//            for (Long id: ticketRequest.getSeatIds()) {
//
//            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        return response;
    }

}
