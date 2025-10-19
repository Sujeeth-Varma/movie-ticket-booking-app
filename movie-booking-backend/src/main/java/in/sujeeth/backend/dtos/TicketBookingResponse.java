package in.sujeeth.backend.dtos;

import in.sujeeth.backend.entities.BookingStatus;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketBookingResponse {
    private Long bookingId;
    private BookingStatus bookingStatus;
    private Timestamp bookedAt;
    private ShowDto show;
    private List<String> seats;
    private double pricePerSeat;
    private double totalPrice;
    private boolean isSuccess;
}
