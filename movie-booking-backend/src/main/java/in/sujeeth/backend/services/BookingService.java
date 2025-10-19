package in.sujeeth.backend.services;

import in.sujeeth.backend.dtos.ShowDto;
import in.sujeeth.backend.dtos.TicketBookingResponse;
import in.sujeeth.backend.dtos.mappers.ShowToShowDto;
import in.sujeeth.backend.entities.*;
import in.sujeeth.backend.repositories.BookingRepository;
import in.sujeeth.backend.repositories.BookingSeatRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ShowService showService;

    @Autowired
    private SeatService seatService;


    @Transactional
    public TicketBookingResponse bookSeats(User user, Long showId, List<Long> seatIds) {
        Show show = showService.getShowById(showId);
        List<Object[]> results = bookingSeatRepository.findSeatIdAndStatusByShowId(showId);

        Map<Long, BookingSeatStatus> seatStatusMap = results.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (BookingSeatStatus) row[1]
                ));
        List<Seat> seats = seatService.getSeatsByHallId(show.getHall().getId());
        Set<Long> userSeatIds = new HashSet<>(seatIds);
        Booking currentBooking = bookingRepository.save(Booking.builder()
                .bookedAt(new Timestamp(new Date().getTime()))
                .show(show)
                .user(user)
                .status(BookingStatus.CONFIRMED)
                .build());

        List<BookingSeat> bookedSeats = seats.stream()
                .filter(seat -> userSeatIds.contains(seat.getId()))
                .map(seat -> checkStatusAndBookSeat(seat, seatStatusMap, show, user, currentBooking))
                .toList();
        List<String> labelsOfBookedSeats = getBookingSeatLabels(bookedSeats);
        return bookingShowToResponseMapper(currentBooking, show, labelsOfBookedSeats);
    }
    
    public BookingSeat checkStatusAndBookSeat(Seat seat, Map<Long, BookingSeatStatus> seatMap, Show show, User user, Booking booking) {
        BookingSeatStatus seatStatus = seatMap.get(seat.getId());
        if (seatStatus == BookingSeatStatus.TEMPORARY || seatStatus == BookingSeatStatus.CONFIRMED) {
            throw new RuntimeException("Tickets already Booked");
        }
        BookingSeat bookedSeat = BookingSeat.builder()
                .booking(booking)
                .seat(seat)
                .status(BookingSeatStatus.CONFIRMED)
                .build();
        return bookingSeatRepository.save(bookedSeat);
    }

    public Object getBookingsByUser(String email) {
        User user = userService.getUserByEmail(email);
        List<Booking> userBookings = bookingRepository.getByUser_Id(user.getId());
        return userBookings.stream()
                .map(booking -> {
                    List<BookingSeat> bookedSeats = bookingSeatRepository.getByBooking_Id(booking.getId());
                    List<String> labelsOfBookedSeats = getBookingSeatLabels(bookedSeats);
                    return bookingShowToResponseMapper(booking, booking.getShow(), labelsOfBookedSeats);
                })
                .toList();
    }

    public List<String> getBookingSeatLabels(List<BookingSeat> seats) {
        return seats.stream()
                .map(seat -> seat.getSeat().getLabel())
                .toList();
    }

    public TicketBookingResponse bookingShowToResponseMapper(Booking booking, Show show, List<String> bookedSeatLabels) {
        return TicketBookingResponse.builder()
                .bookedAt(booking.getBookedAt())
                .bookingId(booking.getId())
                .bookingStatus(booking.getStatus())
                .seats(bookedSeatLabels)
                .isSuccess(true)
                .pricePerSeat(show.getPrice())
                .totalPrice(show.getPrice() * bookedSeatLabels.size())
                .show(ShowToShowDto.ShowToShowDtoMapper(show))
                .build();
    }
}
