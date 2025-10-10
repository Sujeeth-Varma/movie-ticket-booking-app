package in.sujeeth.backend.repositories;

import in.sujeeth.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String mail);
}
