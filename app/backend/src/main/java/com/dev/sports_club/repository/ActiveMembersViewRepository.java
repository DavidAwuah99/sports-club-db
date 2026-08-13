package com.dev.sports_club.repository;

import com.dev.sports_club.entity.ActiveMembersView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActiveMembersViewRepository extends JpaRepository<ActiveMembersView, Integer> {
}
