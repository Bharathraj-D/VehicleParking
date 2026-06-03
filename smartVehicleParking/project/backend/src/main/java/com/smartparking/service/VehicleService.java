package com.smartparking.service;

import com.smartparking.dto.VehicleDto;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.entity.Vehicle;
import com.smartparking.entity.Vehicle.VehicleStatus;
import com.smartparking.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {
    @Autowired
    private VehicleRepository vehicleRepository;

    public Vehicle parkVehicle(String ownerName, String email, String phone, String vehicleNumber,
                               String vehicleType, ParkingSlot slot) {
        Vehicle vehicle = new Vehicle();
        vehicle.setOwnerName(ownerName);
        vehicle.setEmail(email);
        vehicle.setPhone(phone);
        vehicle.setVehicleNumber(vehicleNumber.toUpperCase());
        vehicle.setVehicleType(vehicleType);
        vehicle.setSlot(slot);
        vehicle.setSlotNumber(slot.getSlotNumber());
        vehicle.setEntryTime(System.currentTimeMillis());
        vehicle.setStatus(VehicleStatus.ACTIVE);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle removeVehicle(Long vehicleId) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);
        if (vehicleOpt.isEmpty()) throw new RuntimeException("Vehicle not found");

        Vehicle vehicle = vehicleOpt.get();
        if (vehicle.getStatus() != VehicleStatus.ACTIVE) {
            throw new RuntimeException("Vehicle is not parked");
        }

        long exitTime = System.currentTimeMillis();
        long fee = calculateFee(vehicle.getEntryTime(), exitTime);
        vehicle.setExitTime(exitTime);
        vehicle.setAmount(fee);
        vehicle.setStatus(VehicleStatus.COMPLETED);
        return vehicleRepository.save(vehicle);
    }

    public long calculateFee(long entryTime, long exitTime) {
        long diffMs = exitTime - entryTime;
        long diffHours = (long) Math.ceil((double) diffMs / (1000 * 60 * 60));
        return Math.max(50, diffHours * 50);
    }

    public List<Vehicle> getActiveVehicles() {
        return vehicleRepository.findByStatusOrderByCreatedAtDesc(VehicleStatus.ACTIVE);
    }

    public List<VehicleDto> searchVehicles(String query) {
        List<Vehicle> results = vehicleRepository.findByVehicleNumberIgnoreCaseContainingOrOwnerNameIgnoreCaseContainingOrPhoneContainingOrSlotNumberContainingOrderByCreatedAtDesc(
                query, query, query, query);
        return results.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<VehicleDto> getRecentVehicles(int limit) {
        List<Vehicle> vehicles = vehicleRepository.findAll().stream()
                .sorted((v1, v2) -> Long.compare(v2.getCreatedAt(), v1.getCreatedAt()))
                .limit(limit)
                .collect(Collectors.toList());
        return vehicles.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public VehicleDto convertToDto(Vehicle vehicle) {
        return new VehicleDto(
                vehicle.getId(),
                vehicle.getOwnerName(),
                vehicle.getEmail(),
                vehicle.getPhone(),
                vehicle.getVehicleNumber(),
                vehicle.getVehicleType(),
                vehicle.getSlotNumber(),
                vehicle.getEntryTime(),
                vehicle.getExitTime(),
                vehicle.getAmount(),
                vehicle.getStatus().toString(),
                vehicle.getCreatedAt()
        );
    }

    public Optional<Vehicle> findByVehicleNumber(String vehicleNumber) {
        return vehicleRepository.findByVehicleNumber(vehicleNumber.toUpperCase());
    }
}
