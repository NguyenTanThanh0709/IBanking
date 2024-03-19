import React from 'react'
import { Card, ListGroup, Button } from 'react-bootstrap';

export default function AvailableBalancesItem() {
  const handleWithdraw = () => {
    // Xử lý rút tiền
    alert('Đã rút $100 từ tài khoản');
  };

  const handleDeposit = () => {
    // Xử lý nạp tiền
    alert('Đã nạp $100 vào tài khoản');
  };
  return (
    <div>
<Card className='mb-4'>
      <Card.Header as="h5">Thông Tin Số Dư Tài Khoản</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong>Số Dư Hiện Tại:</strong> $5,000.00
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Ngày Cập Nhật:</strong> 21/01/2024
        </ListGroup.Item>
        <ListGroup.Item>
          <Button variant="primary" onClick={handleWithdraw}>
            Tiếp Tục
          </Button>{' '}
        </ListGroup.Item>
      </ListGroup>
    </Card>


<Card className="bg-dark text-white">
      <Card.Img style={{  height: '550px' }} src="https://www.baotuong-cntt-tdtu.app/assets/intro/bg_cropped.png" alt="Card image" />
      <Card.ImgOverlay className='text-black text-center'>
        <Card.Title className='text-rose-600'>XIN CHAO, NGUYEN TAN THANH!</Card.Title>
        <Card.Title>Thỏa Thuận và Điều Khoản Thanh Toán Học Phí</Card.Title>
        <Card.Text>
          <strong>Hợp đồng này được ký kết giữa [Tên Tổ Chức] và [Tên Sinh Viên] vào ngày [Ngày Tháng Năm].</strong>
        </Card.Text>
        <Card.Text>
          <strong>1. Thanh Toán Học Phí:</strong>
          <br />
          a. Sinh viên cam kết thanh toán học phí theo lịch trình và số tiền đã được quy định bởi Đại học Tôn Đức Thắng.
          <br />
          b. Thời hạn thanh toán học phí là [X] ngày kể từ ngày bắt đầu kỳ học.
        </Card.Text>
        <Card.Text>
          <strong>2. Phương Thức Thanh Toán:</strong>
          <br />
          a. Sinh viên có thể thanh toán học phí bằng [phương thức thanh toán], bao gồm chuyển khoản ngân hàng, thẻ tín dụng, hoặc các phương thức khác được chấp nhận.
          <br />
          b. Mọi phí giao dịch sẽ do sinh viên chịu.
        </Card.Text>
        <Card.Text>
          <strong>3. Chính Sách Phạt và Nợ Phí:</strong>
          <br />
          a. Sinh viên có trách nhiệm thanh toán mọi khoản nợ phí và phạt phát sinh do thanh toán trễ hoặc không đúng thời hạn.
          <br />
          b. [Thêm chi tiết về chính sách phạt và nợ phí của trường].
        </Card.Text>
        <Card.Text>
          <strong>4. Miễn Giảm và Hỗ Trợ Tài Chính:</strong>
          <br />
          a. [Mô tả chính sách miễn giảm học phí và các chương trình hỗ trợ tài chính của trường].
        </Card.Text>
        <Card.Text>
          <strong>5. Điều Khoản Chấm Dứt Hợp Đồng:</strong>
          <br />
          a. Hợp đồng này có thể bị chấm dứt nếu sinh viên không thực hiện thanh toán học phí đúng hạn hoặc vi phạm các điều khoản khác của hợp đồng.
          <br />
          b. [Thêm chi tiết về điều khoản chấm dứt hợp đồng].
        </Card.Text>
      </Card.ImgOverlay>
    </Card>

    </div>
  )
}
