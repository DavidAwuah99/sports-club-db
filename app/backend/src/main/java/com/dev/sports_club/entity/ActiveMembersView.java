package com.dev.sports_club.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;

@Entity
@Immutable
@Table(name = "vw_active_members")
@Getter
@Setter
public class ActiveMembersView {

    @Id
    @Column(name = "membership_id")
    private Integer membershipId;

    @Column(name = "athlete_id")
    private Integer athleteId;

    @Column(name = "athlete_name")
    private String athleteName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "membership_type")
    private String membershipType;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "days_remaining")
    private Integer daysRemaining;
}
