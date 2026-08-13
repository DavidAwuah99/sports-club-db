package com.dev.sports_club.repository;

import com.dev.sports_club.entity.UpcomingBookingsView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpcomingBookingsViewRepository extends JpaRepository<UpcomingBookingsView, Integer> {
}
