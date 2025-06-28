package com.clothes.datn;

import com.clothes.datn.service.FilesStorageService;
import jakarta.annotation.Resource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class DatnApplication {
    
//    @Resource
//    FilesStorageService storageService;

    public static void main(String[] args) {
        SpringApplication.run(DatnApplication.class, args);
    }

//    @Override
//    public void run(String... arg) throws Exception {
//        storageService.init();
//    }
}
