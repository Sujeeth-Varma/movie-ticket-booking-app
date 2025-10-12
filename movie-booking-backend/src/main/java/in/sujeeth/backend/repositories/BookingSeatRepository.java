package in.sujeeth.backend.repositories;

import in.sujeeth.backend.entities.BookingSeat;
import in.sujeeth.backend.entities.BookingSeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    @Query("""
        SELECT bs.seat.id, bs.status
        FROM BookingSeat bs
        JOIN bs.booking b
        WHERE b.show.id = :showId
    """)
    List<Object[]> findSeatIdAndStatusByShowId(@Param("showId") Long showId);
}
