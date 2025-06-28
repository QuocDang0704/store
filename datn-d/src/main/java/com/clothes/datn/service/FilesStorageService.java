package com.clothes.datn.service;

import com.clothes.datn.service.impl.IFilesStorageService;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Random;
import java.util.stream.Stream;

import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FilesStorageService implements IFilesStorageService {
    private final String PATH_SEPARATOR = "src\\main\\resources\\static\\images";
    private Path root = Paths.get("src\\main\\resources\\static\\images");
    @Autowired
    private ServletContext servletContext;

    @Override
    public void init() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @Override
    public void init(String path) {
        try {
            root = Paths.get(PATH_SEPARATOR);
            root = root.resolve(path);
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @Override
    public synchronized String save(MultipartFile file) {
        try {
            String fileExtension = this.generateRandomFileName(file.getOriginalFilename());

            Files.copy(file.getInputStream(), this.root.resolve(fileExtension));
            String filePath = this.root.toFile().getPath().replace("src\\main\\resources\\static\\", "")+ "\\"+ fileExtension;
            return filePath.replace("\\", "/");
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    public static String generateRandomFileName(String originalFileName) {
        // Lấy phần mở rộng của tên file gốc
        String fileExtension = getFileExtension(originalFileName);

        // Tạo chuỗi ngẫu nhiên gồm 6 ký tự
        String randomString = generateRandomString(6);

        // Lấy ngày hiện tại dưới dạng yyyyMMdd
        String currentDate = LocalDate.now().toString();

        // Kết hợp chuỗi ngẫu nhiên và ngày hiện tại với phần mở rộng của tên file gốc
        return randomString + currentDate + "." + fileExtension;
    }

    private static String generateRandomString(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder stringBuilder = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            stringBuilder.append(characters.charAt(index));
        }
        return stringBuilder.toString();
    }

    private static String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex >= 0) {
            return fileName.substring(dotIndex + 1);
        }
        return "";
    }
}
