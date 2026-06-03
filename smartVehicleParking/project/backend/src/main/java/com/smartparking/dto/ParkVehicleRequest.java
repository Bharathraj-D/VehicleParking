package com.smartparking.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkVehicleRequest {
    private String ownerName;
    private String email;
    private String phone;
    private String vehicleNumber;
    private String vehicleType;
    private String slotNumber;
}
