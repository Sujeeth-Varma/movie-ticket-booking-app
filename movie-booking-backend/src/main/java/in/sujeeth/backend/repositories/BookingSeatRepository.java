package in.sujeeth.backend.repositories;

import in.sujeeth.backend.entities.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {}
