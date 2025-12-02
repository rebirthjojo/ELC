package com.example.member.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserInfoDTO {
    private Integer uid;
    @Pattern(regexp = "^01(?:0|1|[2-9])-(?:\\d{3}|\\d{4})-\\d{4}$")
    private String phoneNumber;
    @NotNull
    private Character tutor;
    private String tutorDetail;
}
