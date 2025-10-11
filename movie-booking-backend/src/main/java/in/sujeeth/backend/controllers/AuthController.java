package in.sujeeth.backend.controllers;

import in.sujeeth.backend.dtos.AuthRequest;
import in.sujeeth.backend.dtos.AuthResponse;
import in.sujeeth.backend.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody AuthRequest request) {
        AuthResponse authResponse;
        try {
            authResponse = authService.signup(request);
        } catch (RuntimeException e) {
//            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.signin(request));
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam(name = "token", required = true) String token) {
        boolean valid = authService.verifyToken(token);
        return valid
                ? ResponseEntity.ok("Token is valid")
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
}
