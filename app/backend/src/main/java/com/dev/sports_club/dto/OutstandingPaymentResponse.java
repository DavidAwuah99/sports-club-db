package com.dev.sports_club.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutstandingPaymentResponse {

    private Integer paymentId;
    private Integer athleteId;
    private String athleteName;
    private String phone;
    private String membershipType;
    private BigDecimal amount;
    private String method;
    private String status;
    private LocalDateTime paymentDate;
}
