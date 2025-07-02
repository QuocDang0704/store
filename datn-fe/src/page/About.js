import React from 'react';
import { Container, Typography, Box, Divider, Grid, Paper } from '@mui/material';
import logo from '../assets/logo.png';
import anh1 from '../assets/anh_1.jpg';
import anh2 from '../assets/anh_2.jpg';
import anh3 from '../assets/anh_3.jpg';
import anh4 from '../assets/anh_4.jpg';

function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box textAlign="center" mb={4}>
          <img src={logo} alt="KidsShop Logo" style={{ height: 90, marginBottom: 16 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom color="primary">
            KidsShop
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            KidsShop tự hào là điểm đến tin cậy cho các bậc phụ huynh và các bé, cung cấp đa dạng sản phẩm chất lượng cao dành cho trẻ em: quần áo, đồ chơi, sách, đồ dùng học tập và nhiều hơn thế nữa.
          </Typography>
        </Box>

        {/* Gallery ảnh minh họa */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={600} gutterBottom color="secondary" textAlign="center">
            Không gian & Sản phẩm KidsShop
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box boxShadow={3} borderRadius={3} overflow="hidden" mb={1}>
                <img src={anh1} alt="Không gian cửa hàng 1" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">Không gian cửa hàng KidsShop</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box boxShadow={3} borderRadius={3} overflow="hidden" mb={1}>
                <img src={anh2} alt="Không gian cửa hàng 2" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">Khu trưng bày sản phẩm đa dạng</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box boxShadow={3} borderRadius={3} overflow="hidden" mb={1}>
                <img src={anh3} alt="Sản phẩm nổi bật" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">Sản phẩm nổi bật cho bé</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box boxShadow={3} borderRadius={3} overflow="hidden" mb={1}>
                <img src={anh4} alt="Không gian vui chơi" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">Không gian vui chơi an toàn</Typography>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={4} mb={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={600} gutterBottom color="secondary">
              Sứ mệnh
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Mang đến cho trẻ em Việt Nam những sản phẩm an toàn, sáng tạo và hữu ích, đồng hành cùng sự phát triển toàn diện của các bé.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={600} gutterBottom color="secondary">
              Tầm nhìn
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Trở thành hệ thống bán lẻ sản phẩm trẻ em hàng đầu, nơi mọi gia đình đều tìm thấy sự an tâm và hài lòng khi mua sắm cho con trẻ.
            </Typography>
          </Grid>
        </Grid>
        <Box mb={3}>
          <Typography variant="h5" fontWeight={600} gutterBottom color="secondary">
            Giá trị cốt lõi
          </Typography>
          <ul style={{ fontSize: '18px', color: '#555', marginLeft: 24 }}>
            <li>Chất lượng và an toàn là ưu tiên số một</li>
            <li>Khách hàng là trung tâm của mọi hoạt động</li>
            <li>Đổi mới, sáng tạo và không ngừng phát triển</li>
            <li>Trách nhiệm với cộng đồng và môi trường</li>
            <li>Phục vụ tận tâm, chuyên nghiệp</li>
          </ul>
        </Box>
        <Box mb={3}>
          <Typography variant="h5" fontWeight={600} gutterBottom color="secondary">
            Sản phẩm & Dịch vụ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            - Quần áo trẻ em thời trang, an toàn cho làn da nhạy cảm<br/>
            - Đồ chơi giáo dục, phát triển trí tuệ và thể chất<br/>
            - Sách, truyện tranh, dụng cụ học tập<br/>
            - Đồ dùng ăn uống, chăm sóc sức khỏe cho bé<br/>
            - Dịch vụ tư vấn chọn sản phẩm phù hợp từng độ tuổi
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom color="secondary">
            Thông tin liên hệ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Địa chỉ: 19 ngách 21/32 ngõ 230 Mễ Trì Thượng, Hà Nội<br/>
            Số điện thoại: 0372087588<br/>
            Email: lienhe@kidsshop.vn<br/>
            Website: www.kidsshop.vn
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default About; 