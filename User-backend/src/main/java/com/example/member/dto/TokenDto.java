package com.example.member.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenDTO {
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long tokenExpiresIn;

    public TokenDTO(String accessToken, String refreshToken) {
    }
}