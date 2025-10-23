package in.sujeeth.backend.repositories;

import in.sujeeth.backend.entities.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {
    @Query("SELECT s FROM Show s JOIN FETCH s.movie m JOIN FETCH s.hall h")
    List<Show> findAllWithMovieAndHall();
}
