package in.sujeeth.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    @GetMapping("/me")
    public ResponseEntity<String> getProfile(Authentication auth) {
        return ResponseEntity.ok("Logged in as: " + auth.getName());
    }
}
