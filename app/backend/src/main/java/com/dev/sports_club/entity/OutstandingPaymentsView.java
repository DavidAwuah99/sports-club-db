package com.dev.sports_club.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Immutable
@Table(name = "vw_outstanding_payments")
@Getter
@Setter
public class OutstandingPaymentsView {

    @Id
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "athlete_id")
    private Integer athleteId;

    @Column(name = "athlete_name")
    private String athleteName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "membership_type")
    private String membershipType;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "method")
    private String method;

    @Column(name = "status")
    private String status;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
}
