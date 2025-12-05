package com.example.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePasswordDTO {
    private Integer uid;
    @NotBlank
    private String currentPassword;
    @NotBlank
    @Size(min = 8, max = 255)
    private String newPassword;
    @NotBlank
    private String matchPassword;
}