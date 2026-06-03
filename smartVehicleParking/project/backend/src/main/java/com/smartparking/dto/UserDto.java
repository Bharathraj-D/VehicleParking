package com.smartparking.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
}
