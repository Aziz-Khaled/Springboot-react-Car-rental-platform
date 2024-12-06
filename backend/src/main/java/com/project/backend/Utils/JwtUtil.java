package com.project.backend.Utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {


    private static final String SECRET_KEY = Base64.getEncoder().encodeToString(
            "2c041710-58f8-4116-85c1-e83c03b3f7da".getBytes()
    );

    public static String generateToken(String email , String role ,Long id) {
        long expirationTime = 10000 * 60 * 60 * 10;

        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("role", role);
        claims.put("id", id);


        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();
    }
}