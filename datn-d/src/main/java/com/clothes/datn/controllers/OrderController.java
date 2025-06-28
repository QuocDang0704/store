package com.clothes.datn.controllers;

import com.clothes.datn.dto.OrderDto;
import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.service.ColorService;
import com.clothes.datn.service.OrderService;
import com.clothes.datn.utils.Constant;
import com.clothes.datn.vnpay.VNPayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/order")
@Tag(name = "Oder", description = "Đơn hàng")
@CrossOrigin(origins = "*")
public class OrderController {
    private final ColorService colorService;
    private final OrderService orderService;
    private final VNPayService vnPayService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(orderService.getAll(pageable));
    }

    @GetMapping("/getByCurrentUser")
    public ResponseDTO getAlCurrentUser(Constant.OderStatus status, Pageable pageable) {
        return ResponseDTO.success(orderService.getAlCurrentUser(status, pageable));
    }

    @GetMapping("/getByStatus")
    public ResponseDTO getByStatus(Constant.OderStatus status, Pageable pageable) {
        return ResponseDTO.success(orderService.getByStatus(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(orderService.getById(id));
    }

    @PostMapping()
    @Operation(summary = "Tạo đơn hàng",
            description= "Chú ý KH không đăng nhập sẽ để userId là 0, đăng nhập thì để là null hoặc khác 0")
    public ResponseDTO createColor(@RequestBody OrderDto req) {
        return ResponseDTO.success(orderService.createOder(req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Status đơn hàng")
    public ResponseDTO updateStatus(
            @PathVariable("id") Long id,
            @RequestParam Constant.OderStatus status
    ) {
        return ResponseDTO.success(orderService.updateStatus(id, status));
    }
    @PutMapping("/update-order/{id}")
    @Operation(summary = "Update đơn hàng")
    public ResponseDTO updateOrder(
            @PathVariable("id") Long id,
            @RequestBody OrderDto dto
    ) {
        return ResponseDTO.success(orderService.updateOrder(dto));
    }
    @PutMapping("/update-status/{id}")
    @Operation(summary = "Update trạng thái")
    public ResponseDTO updateStatusOrder(
            @PathVariable("id") Long id,
            @RequestParam Constant.OderStatus status
    ) {
        return ResponseDTO.success(orderService.updateStatusOrder(id, status));
    }

    @GetMapping("payment-callback")
    public void paymentCallback(@RequestParam Map<String, String> queryParams, HttpServletResponse response) throws IOException {
        vnPayService.paymentCallback(queryParams, response);
    }

    @GetMapping("/getTotalAmountByMonth")
    public ResponseDTO getTotalAmountByMonth(@RequestParam String year) {
        return ResponseDTO.success(orderService.getTotalAmountByMonth(year));
    }

    @GetMapping("/getTotalImportAmountByMonth")
    public ResponseDTO getTotalImportAmountByMonth(@RequestParam String year) {
        return ResponseDTO.success(orderService.getTotalImportAmountByMonth(year));
    }

    @GetMapping("/getListYear")
    public ResponseDTO getListYear() {
        return ResponseDTO.success(orderService.getListYear());
    }

}
