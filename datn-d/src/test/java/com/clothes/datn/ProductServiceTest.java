package com.clothes.datn;

import com.clothes.datn.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    public void testGetAllInCustomerPagination() {
        // Test pagination with filters
        Pageable pageable = PageRequest.of(0, 10);
        
        // Test without filters
        Page<?> result1 = productService.getAllInCustomer(null, null, null, null, null, pageable);
        assertNotNull(result1);
        assertNotNull(result1.getContent());
        assertEquals(10, result1.getSize());
        
        // Test with category filter
        Page<?> result2 = productService.getAllInCustomer(null, null, null, 1L, null, pageable);
        assertNotNull(result2);
        assertNotNull(result2.getContent());
        assertEquals(10, result2.getSize());
        
        // Test with supplier filter
        Page<?> result3 = productService.getAllInCustomer(null, null, null, null, 1L, pageable);
        assertNotNull(result3);
        assertNotNull(result3.getContent());
        assertEquals(10, result3.getSize());
        
        // Test with both filters
        Page<?> result4 = productService.getAllInCustomer(null, null, null, 1L, 1L, pageable);
        assertNotNull(result4);
        assertNotNull(result4.getContent());
        assertEquals(10, result4.getSize());
    }

    @Test
    public void testGetAllPagination() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<?> result = productService.getAll(pageable);
        
        assertNotNull(result);
        assertNotNull(result.getContent());
        assertEquals(10, result.getSize());
    }
} 