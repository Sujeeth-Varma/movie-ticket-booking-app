package in.sujeeth.backend.services;

import in.sujeeth.backend.dtos.SeatStatusResponse;
import in.sujeeth.backend.entities.Seat;
import in.sujeeth.backend.entities.Show;
import in.sujeeth.backend.repositories.BookingSeatRepository;
import in.sujeeth.backend.repositories.SeatRepository;
import in.sujeeth.backend.repositories.ShowRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SeatService {

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    @Transactional
    public List<SeatStatusResponse> getSeatsByShowId(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        List<Seat> seats = seatRepository.findByHall_Id(show.getHall().getId());

        List<Object[]> results = bookingSeatRepository.findSeatIdAndStatusByShowId(showId);

        Map<Long, String> seatStatusMap = results.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (String) row[1]
                ));

        return seats.stream()
                .map(seat -> new SeatStatusResponse(
                        seat.getId(),
                        seat.getLabel(),
                        seatStatusMap.getOrDefault(seat.getId(), "AVAILABLE"),
                        seat.getRowNum(),
                        seat.getColNum()
                ))
                .collect(Collectors.toList());
    }
}
