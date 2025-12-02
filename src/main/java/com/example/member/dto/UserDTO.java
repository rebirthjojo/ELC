package com.example.member.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserDTO {
    private Integer uid;
    @NotBlank
    private String name;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min = 8, max = 255)
    private String password;
    @Pattern(regexp = "^01(?:0|1|[2-9])-(?:\\d{3}|\\d{4})-\\d{4}$")
    private String phoneNumber;
    @NotNull
    private Character tutor;
    private String tutorDetail;
    private LocalDateTime signupDate;
    private Character deleted;
    private LocalDateTime deletedDate;
}
