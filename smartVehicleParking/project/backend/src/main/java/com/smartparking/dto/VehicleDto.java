package com.smartparking.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {
    private Long id;
    private String ownerName;
    private String email;
    private String phone;
    private String vehicleNumber;
    private String vehicleType;
    private String slotNumber;
    private Long entryTime;
    private Long exitTime;
    private Long amount;
    private String status;
    private Long createdAt;
}
