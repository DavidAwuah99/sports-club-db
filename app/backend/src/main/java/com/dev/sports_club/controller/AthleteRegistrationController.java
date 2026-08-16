package com.dev.sports_club.controller;

import com.dev.sports_club.dto.AthleteRegistrationRequest;
import com.dev.sports_club.dto.AthleteRegistrationResponse;
import com.dev.sports_club.service.AthleteRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

// Same base path as AthleteController on purpose — POST /api/athletes/** is
// already Admin+FrontDesk in SecurityConfig, which is exactly who should be
// able to register a new athlete with membership (matches Ronald's grants:
// front_desk has INSERT on athlete, membership, and payment).
@RestController
@RequestMapping("/api/athletes")
@RequiredArgsConstructor
public class AthleteRegistrationController {

    private final AthleteRegistrationService service;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AthleteRegistrationResponse register(@Valid @RequestBody AthleteRegistrationRequest request) {
        return service.register(request);
    }
}
