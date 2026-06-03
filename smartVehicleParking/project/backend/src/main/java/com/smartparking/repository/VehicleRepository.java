package com.smartparking.repository;

import com.smartparking.entity.Vehicle;
import com.smartparking.entity.Vehicle.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findByStatusOrderByCreatedAtDesc(VehicleStatus status);
    List<Vehicle> findByStatusAndEntryTimeGreaterThanEqualOrderByCreatedAtDesc(
        VehicleStatus status, Long startTime);
    List<Vehicle> findByVehicleNumberIgnoreCaseContainingOrOwnerNameIgnoreCaseContainingOrPhoneContainingOrSlotNumberContainingOrderByCreatedAtDesc(
        String vehicleNumber, String ownerName, String phone, String slotNumber);
}
