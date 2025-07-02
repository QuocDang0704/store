package com.clothes.datn.service;

import com.clothes.datn.config.exception.BadRequestException;
import com.clothes.datn.config.exception.NotFoundException;
import com.clothes.datn.dto.OrderDto;
import com.clothes.datn.dto.response.DataChart;
import com.clothes.datn.dto.response.OrderResponseDto;
import com.clothes.datn.entities.*;
import com.clothes.datn.repository.IOrderDetailRepository;
import com.clothes.datn.repository.IOrderRepository;
import com.clothes.datn.repository.IProductDetailRepository;
import com.clothes.datn.repository.IVoucherRepository;
import com.clothes.datn.utils.Constant;
import com.clothes.datn.utils.MapperUtils;
import com.clothes.datn.utils.Ramdom;
import com.clothes.datn.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private IOrderRepository oderRepository;
    @Autowired
    private IOrderDetailRepository oderDetailRepository;
    @Autowired
    private IProductDetailRepository productDetailRepository;
    @Autowired
    private IVoucherRepository voucherRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private VNPayService vnPayService;

    public Page<Order> getAll(Pageable pageable) {
        return oderRepository.findAll(pageable);
    }

    public Page<Order> getAlCurrentUser(Constant.OderStatus status, Pageable pageable) {
        User user = this.userService.getCurrentUser();
        return oderRepository.findAllByUserIdAndStatus(user.getId(), status, pageable);
    }

    public Page<Order> getByStatus(Constant.OderStatus status, Pageable pageable) {
        return oderRepository.findAllByStatus(status, pageable);
    }

    public Order getById(Long id) {
        return oderRepository.findByIdOrThrow(id);
    }

    public OrderResponseDto createOder(OrderDto req) {
        if (req.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findByIdOrThrow(req.getVoucherId());
            voucher.setQuantity(voucher.getQuantity() - 1);
        }

        Order order = Order
                .builder()
                .code(Ramdom.generateOrderCode())
                .isPayment(false)
                .total(req.getTotal())
                .totalInit(req.getTotalInit())
                .status(Constant.OderStatus.WaitForConfirmation)
                .paymentMethods(req.getPaymentMethods())
                .shipPrice(req.getShipPrice())
                .description(req.getDescription())
                .address(req.getAddress())
                .phone(req.getPhone())
                .name(req.getName())
                .build();

        User user = userService.getCurrentUser();
        order.setUser(User.builder().id(user.getId()).build());
        Order orderSave = this.oderRepository.save(order);

        List<OrderDetail> details = req.getOrderDetailDtos().stream().map(dto -> {
            ProductDetail productDetail = this.productDetailRepository.findByIdOrThrow(dto.getProductDetailId());
            Long quantity = productDetail.getQuantity() - dto.getQuantity();
            if (quantity > 0) {
                productDetail.setQuantity(quantity);
                productDetailRepository.save(productDetail);
            } else {
                new NotFoundException("Số lương trong kho không dủ");
            }

            return OrderDetail
                    .builder()
                    .order(orderSave)
                    .productDetail(ProductDetail.builder().id(dto.getProductDetailId()).build())
                    .price(dto.getPrice())
                    .quantity(dto.getQuantity())
                    .totalPrice(dto.getTotalPrice())
                    .build();
        }).collect(Collectors.toList());
        this.oderDetailRepository.saveAll(details);
        OrderResponseDto orderResponseDto = MapperUtils.map(order, OrderResponseDto.class);
        if (req.getPaymentMethods().toString().equals(Constant.PaymentMethods.PaymentOverVnpay.toString())) {
            try {
                String linkPay = vnPayService.getPay(orderSave.getTotal(), order.getId());
                orderResponseDto.setLink(linkPay);
            } catch (Exception e) {
                throw new BadRequestException(e.getMessage());
            }
        }

        return orderResponseDto;
    }

    public Order updateOrder(OrderDto dto) {
        Order order = this.oderRepository.findByIdOrThrow(dto.getId());
        order.setAddress(dto.getAddress());
        order.setPhone(dto.getPhone());
        order.setName(dto.getName());

        return this.oderRepository.save(order);
    }

    public Order updateStatusOrder(Long id, Constant.OderStatus status) {
        Order order = this.oderRepository.findByIdOrThrow(id);
        if (status.toString().equals(Constant.OderStatus.Cancel.toString())) {
            order.getOrderDetails().stream().forEach(dto -> {
                ProductDetail productDetail = this.productDetailRepository.findByIdOrThrow(dto.getProductDetail().getId());
                Long quantity = productDetail.getQuantity() + dto.getQuantity();
                productDetail.setQuantity(quantity);
                productDetailRepository.save(productDetail);
            });
        }
        order.setStatus(status);
        return this.oderRepository.save(order);
    }

    public Order updateStatus(Long id, Constant.OderStatus status) {
        Order order = this.oderRepository.findByIdOrThrow(id);
        order.setStatus(status);
        if (status.equals(Constant.OderStatus.Cancel)) {
            order.getOrderDetails().forEach(OrderDetail -> {
                ProductDetail productDetail = this.productDetailRepository.findByIdOrThrow(OrderDetail.getProductDetail().getId());
                Long quantity = productDetail.getQuantity() + OrderDetail.getQuantity();
                productDetail.setQuantity(quantity);
                productDetailRepository.save(productDetail);
            });
        }
        return this.oderRepository.save(order);
    }

    public List<DataChart> getTotalAmountByMonth(String year) {
        List<Object[]> data = this.oderRepository.findTotalAmountByMonth(year);
        return data.stream().map(obj -> {
            return DataChart.builder()
                    .month(obj[0].toString())
                    .totalAmount(Long.parseLong(obj[1].toString()))
                    .build();
        }).collect(Collectors.toList());
    }

    public List<DataChart> getTotalImportAmountByMonth(String year) {
        List<Object[]> data = this.oderRepository.findTotalImportAmountByMonth(year);
        return data.stream().map(obj -> {
            return DataChart.builder()
                    .month(obj[0].toString())
                    .totalAmount(Long.parseLong(obj[1].toString()))
                    .build();
        }).collect(Collectors.toList());
    }

    public List<String> getListYear() {
        List<Object[]> data = this.oderRepository.findListYear();
        return data.stream().map(obj -> {
            return obj[0].toString();
        }).collect(Collectors.toList());
    }
}
