package in.sujeeth.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketBookingRequest {

    private Long showId;
    private List<Long> seatIds;
}
