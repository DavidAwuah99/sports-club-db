package com.dev.sports_club.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActiveMemberResponse {

    private Integer membershipId;
    private Integer athleteId;
    private String athleteName;
    private String email;
    private String phone;
    private String membershipType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer daysRemaining;
}
