package in.sujeeth.backend.controllers;

import in.sujeeth.backend.dtos.SeatStatusResponse;
import in.sujeeth.backend.services.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/show")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/{showId}/seats")
    public ResponseEntity<List<SeatStatusResponse>> getSeatsByShowId(@PathVariable Long showId) {
        List<SeatStatusResponse> resopnse = seatService.getSeatsByShowId(showId);
        return ResponseEntity.ok().body(resopnse);
    }
}
