package com.dev.sports_club.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingBookingResponse {

    private Integer bookingId;
    private String facilityName;
    private String facilityType;
    private LocalDate bookingDate;
    private String timeSlot;
    private String teamName;
    private String sportName;
    private String purpose;
}
