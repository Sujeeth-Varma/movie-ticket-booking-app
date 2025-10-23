package in.sujeeth.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieWithShowsResponse {
    private Long id;
    private String title;
    private String language;
    private String genre;
    private Integer duration;
    private List<ShowResponse> shows;
}
