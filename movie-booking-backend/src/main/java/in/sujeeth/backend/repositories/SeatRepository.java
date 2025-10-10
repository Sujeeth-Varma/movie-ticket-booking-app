package in.sujeeth.backend.repositories;

import in.sujeeth.backend.entities.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {}
