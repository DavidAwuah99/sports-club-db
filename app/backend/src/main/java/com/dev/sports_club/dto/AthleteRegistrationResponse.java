package com.dev.sports_club.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AthleteRegistrationResponse {

    private Integer athleteId;
    private Integer membershipId;
    private Integer paymentId;
    private BigDecimal amountCharged;
    private BigDecimal initialPayment;
}
