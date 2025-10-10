package in.sujeeth.backend.config;

import in.sujeeth.backend.entities.*;
import in.sujeeth.backend.repositories.*;
import in.sujeeth.backend.repositories.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final HallRepository hallRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;

    public DataSeeder(UserRepository userRepository,
                      MovieRepository movieRepository,
                      HallRepository hallRepository,
                      SeatRepository seatRepository,
                      ShowRepository showRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.hallRepository = hallRepository;
        this.seatRepository = seatRepository;
        this.showRepository = showRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.existsByEmail("admin@gmail.com")) {
            log.info("Admin already exists. Skipping data seeding");
            return;
        }

        // ==============================
        // USERS
        // ==============================
        User admin = new User();
        admin.setName("admin");
        admin.setEmail("admin@gmail.com");
        userRepository.save(admin);

        // ==============================
        // MOVIES
        // ==============================
        Movie inception = new Movie();
        inception.setTitle("Inception");
        inception.setLanguage("English");
        inception.setGenre("Sci-Fi");
        inception.setDuration(148);
        movieRepository.save(inception);

        // ==============================
        // HALLS
        // ==============================
        Hall hall = new Hall();
        hall.setName("PVR Screen 1");
        hall.setLocation("Hyderabad");
        hallRepository.save(hall);

        // ==============================
        // SEATS (10×10)
        // ==============================
        List<Seat> seats = new ArrayList<>();
        String rows = "ABCDEFGHIJ";
        for (int i = 0; i < 10; i++) {
            char rowChar = rows.charAt(i);
            for (int j = 1; j <= 10; j++) {
                Seat seat = new Seat();
                seat.setLabel(rowChar + String.valueOf(j));
                seat.setRowNum(i + 1);
                seat.setColNum(j);
                seat.setHall(hall);
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);

        // ==============================
        // SHOWS (4 Timings)
        // ==============================
        List<LocalDateTime> showTimes = List.of(
            LocalDateTime.of(2025, 10, 8, 10, 0),
            LocalDateTime.of(2025, 10, 8, 14, 0),
            LocalDateTime.of(2025, 10, 8, 18, 0),
            LocalDateTime.of(2025, 10, 8, 21, 0)
        );

        for (LocalDateTime time : showTimes) {
            Show show = new Show();
            show.setMovie(inception);
            show.setHall(hall);
            show.setStartTime(time);
            show.setPrice(250.0);
            showRepository.save(show);
        }

        log.info("Initial data seeded successfully.");
    }
}
