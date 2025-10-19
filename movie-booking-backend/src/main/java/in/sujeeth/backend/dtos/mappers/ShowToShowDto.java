package in.sujeeth.backend.dtos.mappers;

import in.sujeeth.backend.dtos.ShowDto;
import in.sujeeth.backend.entities.Show;

public class ShowToShowDto {

    public static ShowDto ShowToShowDtoMapper(Show show) {
        return ShowDto.builder()
                .hall(show.getHall().getName())
                .showId(show.getId())
                .movieTitle(show.getMovie().getTitle())
                .startTime(show.getStartTime())
                .build();
    }
}
