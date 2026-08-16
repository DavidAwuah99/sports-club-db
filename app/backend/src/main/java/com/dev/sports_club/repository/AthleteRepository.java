package com.dev.sports_club.repository;

import com.dev.sports_club.entity.Athlete;
import com.dev.sports_club.entity.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AthleteRepository extends JpaRepository<Athlete, Integer> {

    // Prefix match (not %contains%) so this can actually use idx_athlete_lastname.
    List<Athlete> findByLastNameStartingWithIgnoreCase(String lastName);

    // Athlete and Membership are plain FK id fields, not a mapped JPA relationship
    // (deliberate choice — see MembershipService notes), so this is a subquery
    // rather than a JOIN on an association.
    @Query("SELECT a FROM Athlete a WHERE a.athleteId IN "
            + "(SELECT m.athleteId FROM Membership m WHERE m.status = :status)")
    List<Athlete> findByMembershipStatus(@Param("status") MembershipStatus status);
}
