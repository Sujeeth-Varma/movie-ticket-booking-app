package in.sujeeth.backend.dtos;

import in.sujeeth.backend.entities.BookingSeatStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatStatusResponse {
    private Long seatId;
    private String label;
    private BookingSeatStatus status;
    private Integer row;
    private Integer col;
}

//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class BookingSeatStatus {
//    private Long seatId;
//    private String status;
//}
