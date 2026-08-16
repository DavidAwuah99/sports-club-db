package com.dev.sports_club.dto;

import com.dev.sports_club.entity.Gender;
import com.dev.sports_club.entity.PaymentMethod;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AthleteRegistrationRequest {

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @NotNull
    @Past
    private LocalDate dateOfBirth;

    @NotNull
    private Gender gender;

    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    @Size(max = 20)
    private String phone;

    @NotNull
    private Integer typeId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    @Positive
    private BigDecimal paymentAmount;

    @NotNull
    private PaymentMethod paymentMethod;

    @Size(max = 50)
    private String referenceNo;
}
