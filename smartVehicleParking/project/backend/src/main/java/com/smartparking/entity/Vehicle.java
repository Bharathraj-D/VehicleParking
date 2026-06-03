package com.smartparking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @Column(nullable = false)
    private String vehicleType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id")
    private ParkingSlot slot;

    @Column(nullable = false)
    private String slotNumber;

    @Column(nullable = false)
    private Long entryTime;

    @Column
    private Long exitTime;

    @Column
    private Long amount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    @Column(nullable = false, updatable = false)
    private Long createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = System.currentTimeMillis();
    }

    public enum VehicleStatus {
        ACTIVE, COMPLETED
    }
}
