package in.sujeeth.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "seats")
@Data
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label; // A1, B2, etc.
    private Integer rowNum;
    private Integer colNum;

    @ManyToOne
    @JoinColumn(name = "hall_id")
    private Hall hall;
}
