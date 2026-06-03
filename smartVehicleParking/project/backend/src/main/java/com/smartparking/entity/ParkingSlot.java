package com.smartparking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parking_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slotNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SlotStatus status;

    @Column(nullable = false, updatable = false)
    private Long createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = System.currentTimeMillis();
    }

    public enum SlotStatus {
        AVAILABLE, OCCUPIED
    }
}
