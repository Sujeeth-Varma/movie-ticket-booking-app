package in.sujeeth.backend.repositories;

import in.sujeeth.backend.entities.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByHall_Id(Long hallId);
}
