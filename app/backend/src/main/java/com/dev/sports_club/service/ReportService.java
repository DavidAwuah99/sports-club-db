package com.dev.sports_club.service;

import com.dev.sports_club.dto.ActiveMemberResponse;
import com.dev.sports_club.dto.OutstandingPaymentResponse;
import com.dev.sports_club.dto.UpcomingBookingResponse;
import com.dev.sports_club.entity.ActiveMembersView;
import com.dev.sports_club.entity.OutstandingPaymentsView;
import com.dev.sports_club.entity.UpcomingBookingsView;
import com.dev.sports_club.repository.ActiveMembersViewRepository;
import com.dev.sports_club.repository.OutstandingPaymentsViewRepository;
import com.dev.sports_club.repository.UpcomingBookingsViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ActiveMembersViewRepository activeMembersViewRepository;
    private final OutstandingPaymentsViewRepository outstandingPaymentsViewRepository;
    private final UpcomingBookingsViewRepository upcomingBookingsViewRepository;

    public List<ActiveMemberResponse> activeMembers() {
        return activeMembersViewRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OutstandingPaymentResponse> outstandingPayments() {
        return outstandingPaymentsViewRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<UpcomingBookingResponse> upcomingBookings() {
        return upcomingBookingsViewRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private ActiveMemberResponse toResponse(ActiveMembersView v) {
        return new ActiveMemberResponse(
                v.getMembershipId(), v.getAthleteId(), v.getAthleteName(), v.getEmail(),
                v.getPhone(), v.getMembershipType(), v.getStartDate(), v.getEndDate(), v.getDaysRemaining()
        );
    }

    private OutstandingPaymentResponse toResponse(OutstandingPaymentsView v) {
        return new OutstandingPaymentResponse(
                v.getPaymentId(), v.getAthleteId(), v.getAthleteName(), v.getPhone(),
                v.getMembershipType(), v.getAmount(), v.getMethod(), v.getStatus(), v.getPaymentDate()
        );
    }

    private UpcomingBookingResponse toResponse(UpcomingBookingsView v) {
        return new UpcomingBookingResponse(
                v.getBookingId(), v.getFacilityName(), v.getFacilityType(), v.getBookingDate(),
                v.getTimeSlot(), v.getTeamName(), v.getSportName(), v.getPurpose()
        );
    }
}
