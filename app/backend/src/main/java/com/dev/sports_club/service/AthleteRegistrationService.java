package com.dev.sports_club.service;

import com.dev.sports_club.dto.AthleteRegistrationRequest;
import com.dev.sports_club.dto.AthleteRegistrationResponse;
import com.dev.sports_club.entity.Athlete;
import com.dev.sports_club.entity.Membership;
import com.dev.sports_club.entity.MembershipStatus;
import com.dev.sports_club.entity.MembershipType;
import com.dev.sports_club.entity.Payment;
import com.dev.sports_club.entity.PaymentStatus;
import com.dev.sports_club.exception.BusinessRuleViolationException;
import com.dev.sports_club.exception.InvalidReferenceException;
import com.dev.sports_club.repository.AthleteRepository;
import com.dev.sports_club.repository.MembershipRepository;
import com.dev.sports_club.repository.MembershipTypeRepository;
import com.dev.sports_club.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Mirrors sp_register_athlete_with_membership: registers an athlete, opens their
 * first membership, and records the first payment as one atomic operation. Every
 * other service in this codebase writes to exactly one table per call, so none of
 * them needed @Transactional — Spring wraps each single repository.save() in its
 * own transaction by default. This is the one place that writes to three tables
 * and needs all three to succeed or none of them to, which is what @Transactional
 * actually buys here: if the payment insert fails, the athlete and membership
 * inserts made earlier in this method are rolled back too, not left half-done.
 */
@Service
@RequiredArgsConstructor
public class AthleteRegistrationService {

    private final AthleteRepository athleteRepository;
    private final MembershipTypeRepository membershipTypeRepository;
    private final MembershipRepository membershipRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public AthleteRegistrationResponse register(AthleteRegistrationRequest request) {
        MembershipType type = membershipTypeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new InvalidReferenceException("typeId " + request.getTypeId() + " does not exist"));

        if (request.getPaymentAmount().compareTo(type.getFee()) > 0) {
            throw new BusinessRuleViolationException("First payment cannot exceed membership amount charged");
        }

        Athlete athlete = new Athlete();
        athlete.setFirstName(request.getFirstName());
        athlete.setLastName(request.getLastName());
        athlete.setDateOfBirth(request.getDateOfBirth());
        athlete.setGender(request.getGender());
        athlete.setEmail(request.getEmail());
        athlete.setPhone(request.getPhone());
        athlete.setJoinDate(request.getStartDate());
        athlete = athleteRepository.save(athlete);

        Membership membership = new Membership();
        membership.setAthleteId(athlete.getAthleteId());
        membership.setTypeId(type.getTypeId());
        membership.setStartDate(request.getStartDate());
        membership.setEndDate(request.getStartDate().plusMonths(type.getDurationMonths()));
        membership.setAmountCharged(type.getFee());
        membership.setStatus(MembershipStatus.Active);
        membership = membershipRepository.save(membership);

        Payment payment = new Payment();
        payment.setMembershipId(membership.getMembershipId());
        payment.setAmount(request.getPaymentAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.Completed);
        payment.setReferenceNo(request.getReferenceNo());
        payment = paymentRepository.save(payment);

        return new AthleteRegistrationResponse(
                athlete.getAthleteId(),
                membership.getMembershipId(),
                payment.getPaymentId(),
                type.getFee(),
                request.getPaymentAmount()
        );
    }
}
