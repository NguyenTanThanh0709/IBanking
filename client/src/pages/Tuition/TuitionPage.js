import React, {useEffect} from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TuitionItem from '../../components/Tuition';
import CodeTuitionItem from '../../components/CodeTuition';
import AvailableBalancesItem from '../../components/AvailableBalances';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import { login } from "../../redux/actions";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from '../../api/API'

const radios = [
  { name: 'Thanh toán cho bản thân', value: '1' },
  { name: 'Đối tượng khác', value: '2' },
];


export default function TuitionPage() {

  const navigate = useNavigate();
  const loginState = useSelector(state => state.login);
  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState('1');
  const [selectedYear, setSelectedYear] = useState("");
  const [dateRanges, setDateRanges] = useState([]);

  const [mssv, setMssv] = useState('');
  const [userTuition, setUserTuition] = useState({});
  const [userTuitions, setUserTuitions] = useState([]);

  const [listHistoryTransactions, setListHistoryTransactions] = useState([]);

  const getListHistoryTransactions = async (id) => {
    try {
      const response = await API.fetchGetHistoryTransactionByUser(id);
      setListHistoryTransactions(response);
    } catch (error) {
      console.log(error)
    }
  }

  const handleMssvChange = (e) => {
    setMssv(e.target.value);
  };

  const handleConfirmClick = async () => {
    fetchData(mssv);
  };

  // console.log(userTuition)

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    const part = e.target.value.split(" - ");
    const startYear = part[0];
    const endYear = part[1];
    const filteredData = userTuitions.filter(item => {
      // Chuyển đổi startYear và endYear từ string sang số nguyên để so sánh
      const startYearInt = parseInt(startYear);
      const endYearInt = parseInt(endYear);
  
  
      // Chuyển đổi năm học trong dữ liệu từ string sang số nguyên
      const itemYearstart = parseInt(item.start);
      const itemYearend = parseInt(item.end);
  
  
      return itemYearstart === startYearInt && itemYearend === endYearInt;
    });

    // console.log(filteredData);
    setUserTuition(filteredData);
  };

  const generateDateRanges = (start, end) => {
    const ranges = [];
    for (let year = start; year < end; year++) {
      ranges.push(`${year} - ${year + 1}`);
    }
    return ranges;
  };


  const fetchData = async (id) => {
    try {
      const data = await API.fetchTuitionWithToken(id);
      setUserTuitions(data);
      setUserTuition([data[0]])
      setDateRanges(generateDateRanges(data[0].user.start, data[0].user.end));
    } catch (error) {
    }
  };
  

  useEffect(() => {
    const storedLoginState = localStorage.getItem('loginState');
    console.log(storedLoginState)
    if (storedLoginState) {
      let data = JSON.parse(storedLoginState)
      dispatch(login.set(data));
      const tuitionId = data.mssv;
      fetchData(tuitionId);
      getListHistoryTransactions(data._id);
      const startYear = data.start;
      const endYear = data.end;
      setDateRanges(generateDateRanges(startYear, endYear));
    }else if(loginState.isAuthenticated === 1){
      const tuitionId = loginState.data.mssv;
      fetchData(tuitionId);
      getListHistoryTransactions(loginState.data._id);
      const startYear = loginState.data.start;
      const endYear = loginState.data.end;
      setDateRanges(generateDateRanges(startYear, endYear));
    }else if(loginState.isAuthenticated !== 1){
        navigate("/")
    }
  getListHistoryTransactions();
    
  }, []);

 

  useEffect(() => {
    if(radioValue === "1" && loginState.isAuthenticated === 1){
      const tuitionId = loginState.data.mssv;
      fetchData(tuitionId);
      const startYear = loginState.data.start;
      const endYear = loginState.data.end;
      setDateRanges(generateDateRanges(startYear, endYear));
    }
    }, [radioValue]);


  console.log(userTuition)

  return (
    <Container fluid={true}>
        <Row>
            <Col className='p-2'>
            <Header data={loginState.data ? loginState.data.name : ''} />

            </Col>
        </Row>
        <Row>
            <Col className='p-2'>
              <div>
                <p className='fw-bold'>Chọn đối tượng thanh toán học phí</p>
                <ButtonGroup>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
                {radioValue === '2' && (
                  <div style={{ width: '30%' }} className='mt-2 mb-4'>
                    <Form.Control
                      type="text"
                      style={{ width: '100%' }}
                      id="mssv_text"
                      placeholder='Nhập mã số sinh viên cho đối tượng muốn thanh toán'
                      aria-describedby="passwordHelpBlock"
                      value={mssv}
                      onChange={handleMssvChange} // Assigning event handler to input field
                    />
                    <div className='mt-2'>
                      <Form.Text id="passwordHelpBlock" className='ml-2' muted>
                      {userTuition[0] ? userTuition[0].user.name : 'Họ Và Tên'}
                      </Form.Text>
                      <Button variant="secondary" className='ml-2' size="sm" onClick={handleConfirmClick}> {/* Assigning event handler to button */}
                        Xác nhận
                      </Button>
                    </div>
                  </div>
            )}




              </div>
              <div id='tuitionTab'>
              <p className='fw-bold'>Học kỳ | Semester</p>
              <select
                className="form-select form-select-sm mb-3 w-100"
                aria-label=".form-select-lg example"
                value={selectedYear} // Giá trị được chọn trong dropdown
                onChange={handleYearChange} // Xử lý sự kiện khi lựa chọn thay đổi
              >
                <option  >--Chọn năm học | Choose school year--</option>
                {dateRanges.map((range, index) => (
                  <option key={index} value={range}>
                    {range}
                  </option>
                ))}
              </select>

              </div>

              <Tabs
                defaultActiveKey="tuition"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="tuition" title="Học Phí | Tuition">
                  <TuitionItem tuition={userTuition}  transaction={listHistoryTransactions}/>
                </Tab>

                <Tab eventKey="code_tuition" title="Mã giao dịch ngân hàng | Bank transaction code">
                  <CodeTuitionItem data={userTuition} />
                </Tab>

                <Tab eventKey="available_balances" title="Số dư khả dụng | Available balances">
                  <AvailableBalancesItem/>
                </Tab>
              </Tabs>

            </Col>
        </Row>



        <Row>
            <Col className=' p-2'>
              <Footer note="Footer Note" />
            </Col>
        </Row>

    </Container>
  )
}
