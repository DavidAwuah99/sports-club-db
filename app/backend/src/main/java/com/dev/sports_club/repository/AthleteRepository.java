package com.dev.sports_club.repository;

import com.dev.sports_club.entity.Athlete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AthleteRepository extends JpaRepository<Athlete, Integer> {

    // Prefix match (not %contains%) so this can actually use idx_athlete_lastname.
    List<Athlete> findByLastNameStartingWithIgnoreCase(String lastName);
}
