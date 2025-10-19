package in.sujeeth.backend.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowDto {
    private Long showId;
    private String movieTitle;
    private LocalDateTime startTime;
    private String hall;
}
