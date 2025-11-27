package com.academic.erp.salary.controller;

import com.academic.erp.salary.entity.Employee;
import com.academic.erp.salary.repository.EmployeeRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Value("${google.clientId:YOUR_GOOGLE_CLIENT_ID}")
    private String googleClientId;

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) throws Exception {
        String idTokenString = body.get("token");

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken == null)
            return ResponseEntity.status(401).body("Invalid Google Token");

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();

        // Check if employee exists in database
        Employee emp = employeeRepo.findByEmail(email);
        if (emp == null) {
            return ResponseEntity.status(403).body("Employee not registered!");
        }

        // Return employee data (no JWT token)
        return ResponseEntity.ok(Map.of(
                "employeeId", emp.getEmployeeId(),
                "name", emp.getFirstName() + " " + emp.getLastName(),
                "email", emp.getEmail(),
                "department", emp.getDepartment().getName()));
    }
}
