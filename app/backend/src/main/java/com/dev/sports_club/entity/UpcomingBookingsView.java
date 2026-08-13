package com.dev.sports_club.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;

@Entity
@Immutable
@Table(name = "vw_upcoming_bookings")
@Getter
@Setter
public class UpcomingBookingsView {

    @Id
    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "facility_name")
    private String facilityName;

    @Column(name = "facility_type")
    private String facilityType;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "time_slot")
    private String timeSlot;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "sport_name")
    private String sportName;

    @Column(name = "purpose")
    private String purpose;
}
