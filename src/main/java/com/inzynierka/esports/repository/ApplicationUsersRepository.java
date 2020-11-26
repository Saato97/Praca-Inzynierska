package com.inzynierka.esports.repository;

import com.inzynierka.esports.domain.ApplicationUsers;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ApplicationUsers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicationUsersRepository extends JpaRepository<ApplicationUsers, Long> {
}
