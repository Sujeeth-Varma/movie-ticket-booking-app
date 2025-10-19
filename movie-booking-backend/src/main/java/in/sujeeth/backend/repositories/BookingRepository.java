package in.sujeeth.backend.repositories;

import in.sujeeth.backend.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> getByUser_Id(Long userId);
}
