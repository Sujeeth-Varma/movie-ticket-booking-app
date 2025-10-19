package in.sujeeth.backend.services;

import in.sujeeth.backend.entities.Show;
import in.sujeeth.backend.repositories.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShowService {

    @Autowired
    private ShowRepository showRepository;

    public boolean isShowAvailable(Long showId) {
        return showRepository.existsById(showId);
    }

    public Show getShowById(Long showId) {
        return showRepository.findById(showId).orElseThrow(() -> new RuntimeException("Show not found"));
    }
}
