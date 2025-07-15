package com.clothes.datn;

import com.clothes.datn.service.FilesStorageService;
import jakarta.annotation.Resource;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class DatnApplication {
    private static final Logger logger = LogManager.getLogger(DatnApplication.class);
//    @Resource
//    FilesStorageService storageService;

    public static void main(String[] args) {
        logger.info(args);
        SpringApplication.run(DatnApplication.class, args);
        System.out.println("Current working dir: " + System.getProperty("user.dir"));
    }

//    @Override
//    public void run(String... arg) throws Exception {
//        storageService.init();
//    }
}
