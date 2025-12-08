package com.example.member.service;

import com.example.member.mybatis.UserMapper;
import com.example.member.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserDTO userDTO = userMapper.findUserByEmail(email);

        if (userDTO == null) {
            throw new UsernameNotFoundException(email + " -> 데이터베이스에서 찾을 수 없습니다.");
        }
        return createUserDetails(userDTO);
    }

    private UserDetails createUserDetails(UserDTO userDTO) {

        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_USER");


        return new User(
                userDTO.getEmail(),
                userDTO.getPassword(),
                Collections.singleton(grantedAuthority)
        );
    }
}