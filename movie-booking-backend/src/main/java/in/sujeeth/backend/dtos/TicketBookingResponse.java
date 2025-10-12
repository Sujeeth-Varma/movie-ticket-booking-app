package in.sujeeth.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TicketBookingResponse extends TicketBookingRequest {
    private boolean isSuccess;
    private String message;
}
