package com.smartparking.controller;

import com.smartparking.dto.ParkingStatsDto;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking")
public class ParkingController {
    @Autowired
    private ParkingService parkingService;

    @PostMapping("/init")
    public ResponseEntity<?> initializeSlots() {
        parkingService.initializeParkingSlots();
        return ResponseEntity.ok("Parking slots initialized");
    }

    @GetMapping("/slots")
    public ResponseEntity<List<ParkingSlot>> getAllSlots() {
        return ResponseEntity.ok(parkingService.getAllSlots());
    }

    @GetMapping("/stats")
    public ResponseEntity<ParkingStatsDto> getStats() {
        return ResponseEntity.ok(parkingService.getStats());
    }
}
