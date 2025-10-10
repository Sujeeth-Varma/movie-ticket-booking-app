package in.sujeeth.backend.repositories;

import in.sujeeth.backend.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {}
