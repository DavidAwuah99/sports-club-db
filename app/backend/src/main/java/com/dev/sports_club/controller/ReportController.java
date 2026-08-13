package com.dev.sports_club.controller;

import com.dev.sports_club.dto.ActiveMemberResponse;
import com.dev.sports_club.dto.OutstandingPaymentResponse;
import com.dev.sports_club.dto.UpcomingBookingResponse;
import com.dev.sports_club.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService service;

    @GetMapping("/active-members")
    public List<ActiveMemberResponse> activeMembers() {
        return service.activeMembers();
    }

    @GetMapping("/outstanding-payments")
    public List<OutstandingPaymentResponse> outstandingPayments() {
        return service.outstandingPayments();
    }

    @GetMapping("/upcoming-bookings")
    public List<UpcomingBookingResponse> upcomingBookings() {
        return service.upcomingBookings();
    }
}
