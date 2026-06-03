package com.smartparking.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingStatsDto {
    private Integer totalSlots;
    private Integer availableSlots;
    private Integer occupiedSlots;
    private Long revenueToday;
}
