package com.trkpo.controller;

import com.trkpo.model.dto.response.SubscriptionResultDto;
import com.trkpo.service.SubscriptionService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subscription")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService service;

    @PostMapping("/{userId}")
    public SubscriptionResultDto subscribe(Principal principal, @PathVariable Integer userId) {
        return service.subscribe(principal.getName(), userId);
    }
}
