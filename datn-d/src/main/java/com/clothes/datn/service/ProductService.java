package com.clothes.datn.service;

import com.clothes.datn.dto.ProductDetailDto;
import com.clothes.datn.dto.ProductDto;
import com.clothes.datn.dto.response.ResProductDetailDto;
import com.clothes.datn.dto.response.ResProductDto;
import com.clothes.datn.entities.*;
import com.clothes.datn.repository.IProductDetailRepository;
import com.clothes.datn.repository.IProductRepository;
import com.clothes.datn.utils.MapperUtils;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService implements Serializable {
    private final String PATH_FILE_IMAGE_PRODUCT = "product";
    private final String PATH_FILE_IMAGE_PRODUCT_DETAIL = "product-detail";
    @Autowired
    private IProductRepository productRepository;
    @Autowired
    private FilesStorageService filesStorageService;
    @Autowired
    private IProductDetailRepository productDetailRepository;

    @Value("${kidi.uri.path}")
    private String uri;


    public Page<Product> getAllInCustomer(Long minPrice, Long maxPrice, String name, Long categoryId, Long supplierId, Pageable pageable) {
        Streamable<Product> productStreamable = this.productRepository.findProductInCustomer(minPrice, maxPrice, name, pageable);
        List<Product> productList = productStreamable.toList();

        List<Product> filteredProducts = productList.stream()
                .filter(product -> categoryId == null || product.getCategory().getId().equals(categoryId))
                .filter(product -> supplierId == null || product.getSupplier().getId().equals(supplierId))
                .peek(product -> {
                    product.setImages(uri + product.getImages());
                    product.getProductDetails().forEach(productDetail -> {
                        productDetail.setImages(uri + productDetail.getImages());
                    });
                })
                .collect(Collectors.toList());

        return new PageImpl<>(filteredProducts, pageable, productList.size());
    }


    public Page<Product> getAll(Pageable pageable) {
        Page<Product> product = this.productRepository.findAll(pageable);
        product.forEach(product1 -> {
            product1.setImages(uri + product1.getImages());
            product1.getProductDetails().forEach(productDetail -> {
                productDetail.setImages(uri + productDetail.getImages());
            });
        });
        return product;
    }

    public Product getById(Long id) {
        Product product = this.productRepository.findByIdOrThrow(id);
        product.setImages(uri + product.getImages());
        product.getProductDetails().forEach(productDetail -> {
            productDetail.setImages(uri + productDetail.getImages());
        });
        return product;
    }

    public Product createProduct(ProductDto productDto) {
        filesStorageService.init(PATH_FILE_IMAGE_PRODUCT);
        String fileName = filesStorageService.save(productDto.getImagesFile());
        Product product = MapperUtils.map(productDto, Product.class);

        product.setCategory(Category
                .builder()
                .id(productDto.getCategoryId())
                .build());
        product.setSupplier(Supplier
                .builder()
                .id(productDto.getSupplierId())
                .build());

        product.setImages(fileName);
        return this.productRepository.save(product);
    }

    public Product updateProduct(ProductDto productDto) {
        Product product = this.productRepository.findByIdOrThrow(productDto.getId());
        if (productDto.getMaterial() != null) {
            product.setMaterial(productDto.getMaterial());
        }
        if (productDto.getName() != null) {
            product.setName(productDto.getName());
        }
        if (productDto.getDescription() != null) {
            product.setDescription(productDto.getDescription());
        }
        if (productDto.getCategoryId() != null) {
            product.setCategory(Category.builder().id(productDto.getCategoryId()).build());
        }
        if (productDto.getSupplierId() != null) {
            product.setSupplier(Supplier.builder().id(productDto.getSupplierId()).build());
        }
        if (productDto.getPrice() != null) {
            product.setPrice(productDto.getPrice());
        }
        if (productDto.getImagesFile() != null) {
            filesStorageService.init(PATH_FILE_IMAGE_PRODUCT);
            String fileName = filesStorageService.save(productDto.getImagesFile());
            product.setImages(fileName);
        }
        return this.productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        this.productRepository.deleteById(id);
    }

    //    PRODUCT DETAILS
    public ProductDetailDto getProductDetailById(Long id) {
        ProductDetail productDetail = productDetailRepository.findByIdOrThrow(id);
        productDetail.setImages(uri + productDetail.getImages());
        ProductDetailDto res = MapperUtils.map(productDetail, ProductDetailDto.class);
        res.setProductName(productDetail.getProduct().getName());
        res.setProductId(productDetail.getProduct().getId());
        return res;
    }

    public ProductDetail createProductDetail(ProductDetailDto req) {
        filesStorageService.init(PATH_FILE_IMAGE_PRODUCT_DETAIL);
        String fileName = filesStorageService.save(req.getImagesFile());
        ProductDetail product = ProductDetail
                .builder()
                .product(Product.builder().id(req.getProductId()).build())
                .color(Color.builder().id(req.getColorId()).build())
                .size(Size.builder().id(req.getSizeId()).build())
                .quantity(req.getQuantity())
                .images(fileName)
                .build();

        return this.productDetailRepository.save(product);
    }

    public synchronized ProductDetail updateProductDetail(ProductDetailDto req) {
        ProductDetail productDetail = this.productDetailRepository.findByIdOrThrow(req.getId());
        if (req.getProductId() != null) {
            productDetail.setProduct(Product.builder().id(req.getProductId()).build());
        }
        if (req.getSizeId() != null) {
            productDetail.setSize(Size.builder().id(req.getSizeId()).build());
        }
        if (req.getColorId() != null) {
            productDetail.setColor(Color.builder().id(req.getColorId()).build());
        }
        if (req.getQuantity() != null) {
            productDetail.setQuantity(req.getQuantity());
        }
        if (req.getImagesFile() != null) {
            filesStorageService.init(PATH_FILE_IMAGE_PRODUCT_DETAIL);
            String fileName = filesStorageService.save(req.getImagesFile());
            productDetail.setImages(fileName);
        }
        return this.productDetailRepository.save(productDetail);
    }

    public void deleteProductDetail(Long id) {
        this.productDetailRepository.deleteById(id);
    }

    public Page<ResProductDetailDto> getAllProductDetail(Pageable pageable, String name) {
        Page<ProductDetail> productDetails = this.productDetailRepository.findProductDetailByName(name, pageable);
        Page<ResProductDetailDto> productDetailDtos = productDetails.map(productDetail -> {
            ResProductDetailDto resProductDetailDto = MapperUtils.map(productDetail, ResProductDetailDto.class);
            resProductDetailDto.setProduct(MapperUtils.map(productDetail.getProduct(), ResProductDto.class));
            resProductDetailDto.setImages(uri + resProductDetailDto.getImages());

            Product product = this.productDetailRepository.findProductByProductDetailId(productDetail.getId());
            product.setImages(uri + product.getImages());
            resProductDetailDto.setProduct(MapperUtils.map(product, ResProductDto.class));
            return resProductDetailDto;
        });

        return productDetailDtos;
    }
}
