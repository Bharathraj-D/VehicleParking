package com.smartparking.service;

import com.smartparking.dto.ParkingStatsDto;
import com.smartparking.entity.ParkingSlot;
import com.smartparking.entity.ParkingSlot.SlotStatus;
import com.smartparking.entity.Vehicle;
import com.smartparking.entity.Vehicle.VehicleStatus;
import com.smartparking.repository.ParkingSlotRepository;
import com.smartparking.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParkingService {
    @Autowired
    private ParkingSlotRepository slotRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    public void initializeParkingSlots() {
        if (slotRepository.count() > 0) return;
        String[] sections = {"A", "B", "C", "D"};
        for (String section : sections) {
            for (int i = 1; i <= 50; i++) {
                ParkingSlot slot = new ParkingSlot();
                slot.setSlotNumber(section + i);
                slot.setStatus(SlotStatus.AVAILABLE);
                slotRepository.save(slot);
            }
        }
    }

    public List<ParkingSlot> getAllSlots() {
        return slotRepository.findAllByOrderBySlotNumber();
    }

    public ParkingStatsDto getStats() {
        List<ParkingSlot> allSlots = slotRepository.findAll();
        long occupiedCount = allSlots.stream().filter(s -> s.getStatus() == SlotStatus.OCCUPIED).count();
        long availableCount = allSlots.size() - occupiedCount;

        long todayStart = System.currentTimeMillis() - (System.currentTimeMillis() % 86400000);
        List<Vehicle> completedToday = vehicleRepository.findByStatusAndEntryTimeGreaterThanEqualOrderByCreatedAtDesc(
                VehicleStatus.COMPLETED, todayStart);
        long revenueToday = completedToday.stream().mapToLong(v -> v.getAmount() != null ? v.getAmount() : 0).sum();

        return new ParkingStatsDto(
                allSlots.size(),
                (int) availableCount,
                (int) occupiedCount,
                revenueToday
        );
    }

    public Optional<ParkingSlot> findSlotByNumber(String slotNumber) {
        return slotRepository.findBySlotNumber(slotNumber);
    }

    public ParkingSlot updateSlotStatus(ParkingSlot slot, SlotStatus status) {
        slot.setStatus(status);
        return slotRepository.save(slot);
    }
}
