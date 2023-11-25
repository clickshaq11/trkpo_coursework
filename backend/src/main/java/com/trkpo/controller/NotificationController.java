package com.trkpo.controller;

import com.trkpo.model.dto.response.NotificationDto;
import com.trkpo.service.NotificationService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping
    public List<NotificationDto> getAllNotifications(Principal principal) {
        return service.getAllNotifications(principal.getName());
    }
}
