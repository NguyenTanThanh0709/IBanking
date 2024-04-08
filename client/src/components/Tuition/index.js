import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
export default function TuitionItem({ tuition, transaction }) {
  //console.log(data)
  const tuitionDataExists = tuition && tuition.length > 0;
  const listHistoryTransactions = transaction && transaction.length > 0;
  console.log(tuitionDataExists);
  return (
    <Container fluid={true}>
        <Row>
            <Col>
            <div class="container mx-auto mb-2 mt-2">
                <table class="table-auto border-collapse w-full">
                    <thead>
                    <tr className='bg-blue-100 '>
                        <th class="border p-2">NỢ KỲ TRƯỚC<br />(Previous Pending Charges)</th>
                        <th class="border p-2">HỌC PHÍ HỌC KỲ<br />(Semester Tuition)</th>
                        <th class="border p-2">MIỄN GIẢM<br />(Reduction)</th>
                        <th class="border p-2">TỔNG HP PHẢI NỘP<br />(Total tuition unpaid)</th>
                        <th class="border p-2">TỔNG HỌC PHÍ ĐÃ NỘP<br />(Total tuition paid)</th>
                        <th class="border p-2">SỐ TIỀN CÒN PHẢI NỘP<br />(Remaining unpaid tuition)</th>
                        <th class="border p-2">GHI CHÚ<br />(Note)</th>
                    </tr>
                    </thead>
                    <tbody>
                {tuitionDataExists ? (
                  tuition.map((item, index) => (
                    <tr key={index} className='bg-blue-100 '>
                      <td class="border p-2">(1)</td>
                      <td class="border p-2">{item.fee.toLocaleString()}</td>
                      <td class="border p-2 text-rose-500 fw-bold">0</td>
                      <td class="border p-2 text-rose-500 fw-bold">{item.fee.toLocaleString()}</td>
                      <td class="border p-2 text-rose-500 fw-bold">{item.status ? item.fee.toLocaleString(): 0}</td>
                      <td class="border p-2 text-rose-500 fw-bold">{item.status ? 0 : item.fee.toLocaleString()}</td>
                      <td class="border p-2 text-rose-500 fw-bold">{item.status ? "Đã thanh toán" : "còn nợ"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colspan="7" class="border p-2 text-center">No tuition data available</td>
                  </tr>
                )}
              </tbody>
                </table>
            </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <p className='fw-bold'>Lưu ý: đây là dữ liệu học phí được cập nhật vào lúc 16:34:45 03/01/2024. Các bạn vui lòng xem thời gian và địa điểm nộp học phí tại "Cổng thông tin" -&gt; Chọn "Thông báo" -&gt; Chọn "Phòng Tài chính".</p>
                <p className='fw-bold'>Note: This is the data on tuition payment updated at 16:34:45 on 03 January 2024. Please view time and place for tuition payment at Student Portal -&gt; Announcement -&gt; Department for Finance</p>
            </Col>
        </Row>

        <Row className='mt-4'>
            <Col>
                <p className='fs-2 fw-bold'>Lịch sử thanh toán | Payment history</p>
            </Col>
        </Row>


        <Row>
            <Col>
            <div class="container mx-auto">
  <table class="table-auto border-collapse w-full">
    <thead>
      <tr class="bg-blue-100">
        <th class="border p-2">Ngày đóng<br />(Date of payment)</th>
        <th class="border p-2">Học kỳ<br /></th>
        <th class="border p-2">Số tiền<br />(Amount)</th>
        <th class="border p-2">Hình thức thanh toán<br />(Method of payment)</th>
        <th class="border p-2">Người thực hiện thanh toán<br />(MSSV)</th>
      </tr>
    </thead>
    <tbody>

      

    {listHistoryTransactions ? (
  transaction.map((item, index) => (
    <tr key={index}>
      <td class="border p-2">{item.payment_date}</td>
      <td class="border p-2">{item.tuition.start} -  {item.tuition.end}</td>
      <td class="border p-2">{item.tuition.fee}</td>
      <td class="border p-2">{item.method}</td>
      <td class="border p-2">{item.userSender.name} - {item.userSender.mssv}</td>
    </tr>
  ))
) : (
  <tr>
    <td colspan="5" class="border p-2 text-center">No transaction history available</td>
  </tr>
)}


    </tbody>
  </table>
</div>


            </Col>
        </Row>

        <Row>
            <Col>
                <p className=''>Hình thức thanh toán: TM: tiền mặt. CK: Chuyển khoản | Method of payment: TM - Cash; CK: Transfer | NO: Chưa Thanh Toán</p>
                <p className=''>*Mã giao dịch hết hiệu lực: là mã đã hết hiệu lực theo thời gian thông báo. Vui lòng không sử dụng mã giao dịch này để nộp học phí/chi phí.</p>
            </Col>
        </Row>
    </Container>
  )
}
