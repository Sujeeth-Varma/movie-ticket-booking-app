package in.sujeeth.backend.services;

import in.sujeeth.backend.dtos.MovieWithShowsResponse;
import in.sujeeth.backend.dtos.ShowResponse;
import in.sujeeth.backend.entities.Movie;
import in.sujeeth.backend.entities.Show;
import in.sujeeth.backend.repositories.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private ShowRepository showRepository;

    public List<MovieWithShowsResponse> getMoviesWithShows() {
        List<Show> shows = showRepository.findAllWithMovieAndHall();
        Map<Movie, List<Show>> groupedByMovie = shows.stream()
                .collect(Collectors.groupingBy(Show::getMovie));

        return groupedByMovie.entrySet().stream()
                .map(entry -> {
                    Movie movie = entry.getKey();
                    List<ShowResponse> showResponses = entry.getValue().stream()
                            .map(ShowResponse::fromEntity)
                            .toList();

                    return MovieWithShowsResponse.builder()
                            .id(movie.getId())
                            .title(movie.getTitle())
                            .language(movie.getLanguage())
                            .genre(movie.getGenre())
                            .duration(movie.getDuration())
                            .shows(showResponses)
                            .build();
                })
                .toList();

    }
}
