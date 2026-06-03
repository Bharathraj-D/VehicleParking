package com.smartparking.controller;

import com.smartparking.dto.ParkVehicleRequest;
import com.smartparking.dto.VehicleDto;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.entity.ParkingSlot.SlotStatus;
import com.smartparking.entity.Vehicle;
import com.smartparking.service.ParkingService;
import com.smartparking.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private ParkingService parkingService;

    @PostMapping("/park")
    public ResponseEntity<?> parkVehicle(@RequestBody ParkVehicleRequest request) {
        try {
            Optional<ParkingSlot> slotOpt = parkingService.findSlotByNumber(request.getSlotNumber());
            if (slotOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Slot not found");
            }

            ParkingSlot slot = slotOpt.get();
            if (slot.getStatus() != SlotStatus.AVAILABLE) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Slot is already occupied");
            }

            Optional<Vehicle> existingVehicle = vehicleService.findByVehicleNumber(request.getVehicleNumber());
            if (existingVehicle.isPresent() && existingVehicle.get().getStatus().toString().equals("ACTIVE")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vehicle is already parked");
            }

            Vehicle vehicle = vehicleService.parkVehicle(
                    request.getOwnerName(),
                    request.getEmail(),
                    request.getPhone(),
                    request.getVehicleNumber(),
                    request.getVehicleType(),
                    slot
            );

            parkingService.updateSlotStatus(slot, SlotStatus.OCCUPIED);

            return ResponseEntity.ok(Map.of("vehicle", vehicleService.convertToDto(vehicle)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeVehicle(@RequestBody Map<String, Long> request) {
        try {
            Long vehicleId = request.get("vehicle_id");
            Vehicle vehicle = vehicleService.removeVehicle(vehicleId);

            Optional<ParkingSlot> slotOpt = parkingService.findSlotByNumber(vehicle.getSlotNumber());
            if (slotOpt.isPresent()) {
                parkingService.updateSlotStatus(slotOpt.get(), SlotStatus.AVAILABLE);
            }

            return ResponseEntity.ok(Map.of(
                    "fee", vehicle.getAmount(),
                    "exit_time", vehicle.getExitTime(),
                    "vehicle", vehicleService.convertToDto(vehicle)
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<VehicleDto>> getActiveVehicles() {
        List<Vehicle> vehicles = vehicleService.getActiveVehicles();
        return ResponseEntity.ok(vehicles.stream()
                .map(vehicleService::convertToDto)
                .toList());
    }

    @GetMapping("/search")
    public ResponseEntity<List<VehicleDto>> searchVehicles(@RequestParam String q) {
        return ResponseEntity.ok(vehicleService.searchVehicles(q));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<VehicleDto>> getRecentVehicles(@RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(vehicleService.getRecentVehicles(limit));
    }
}
