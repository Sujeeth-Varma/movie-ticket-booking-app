package in.sujeeth.backend.dtos;

import in.sujeeth.backend.entities.Show;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowResponse {
    private Long id;
    private String hallName;
    private String location;
    private LocalDateTime startTime;
    private Double price;

    public static ShowResponse fromEntity(Show show) {
        return ShowResponse.builder()
                .id(show.getId())
                .hallName(show.getHall().getName())
                .location(show.getHall().getLocation())
                .startTime(show.getStartTime())
                .price(show.getPrice())
                .build();
    }
}
