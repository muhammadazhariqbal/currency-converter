import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, FormGroup, Modal, ModalBody, Input, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import icon from './icon.png'
function App() {
  // states for storing data 
  const [allCurrencies, setAllCurrencies] = useState('')
  const [isShowAllCurrency, setIsShowAllCurrency] = useState(false)
  const [amount, setAmount] = useState('')
  const [firstCurrency, setFirstCurrency] = useState('')
  const [secondCurrency, setSecondCurrency] = useState('')
  const [conversionRate, setConversionRate] = useState('')
  const [convertedMoney, setConvertedMoney] = useState('')
  const [modal, setModal] = useState(false);
  const [isLoader, setIsLoader] = useState(false)
  const [showError, setShowError] = useState(false)
  // useEffect for fetching all currencies data
  useEffect(() => {
    fetch('https://free.currconv.com/api/v7/countries?apiKey=dfd82b1f79f106587170')
      .then(response => {
        response.json()
          .then(res => {
            // object entries method for converting object to array
            setAllCurrencies(Object.entries(res.results))
          })
      })
      .catch(error => { console.log(`error ${error}`) })
  }, [])
  // toggling 
  const getAllCurrencies = () => { setIsShowAllCurrency(!isShowAllCurrency) }
  // converting amount
  const startConversion = () => {
    setIsLoader(true)
    if (!amount || !firstCurrency || !secondCurrency) {
      setShowError(true)
      setIsLoader(false)
    } else {
      setShowError(false)
      fetch(`https://free.currconv.com/api/v7/convert?q=${firstCurrency}_${secondCurrency}&compact=ultra&apiKey=dfd82b1f79f106587170`)
        .then(response => {
          response.json()
            .then(res => {
              setIsLoader(false)
              setConversionRate(res)
              if (res[`${firstCurrency}_${secondCurrency}`] === undefined) {
                return alert('Please Enter Valid Currency ID')
              } else {
                setConvertedMoney(res[`${firstCurrency}_${secondCurrency}`] * parseInt(amount))
              }

            })
            .catch(error => { console.log(error) })
        })
        .catch(error => { console.log(`error ${error.message}`) })
    }

  }
  // modal toggling
  const toggle = () => setModal(!modal);

  // reseting states after showing dds
  const resetData = () => {
    setAmount('')
    setFirstCurrency('')
    setSecondCurrency('')
    setConversionRate('')
    setConvertedMoney('')
  }
  return (
    <div className="App">
      <Container>
        <Row>
          <Col md="6"> <img src={icon} className="image" alt="icon"/> </Col>
          <Col md="6">
            <header className="App-header">
              {showError ? <Alert color="danger"> Please Fill out all fields</Alert> : null}
              <h1>CURRENCY CONVERTOR</h1>
              <div className="form-container">
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Col sm={10}>
                        <Input type="number" name="money" placeholder="Amount" value={amount} onChange={(e) => { setAmount(e.target.value) }} />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Col sm={10}>
                        <Input type="text" name="text" placeholder="Currency I have" value={firstCurrency} onChange={(e) => { setFirstCurrency(e.target.value) }}>
                        </Input>
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Col sm={10}>
                        <Input type="text" name="select" placeholder="Currency I want" value={secondCurrency} onChange={(e) => { setSecondCurrency(e.target.value) }}>

                        </Input>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <Button className="mine-btn" onClick={() => {
                startConversion()
                toggle()
              }}>{isLoader ? 'Converting...' : 'CONVERT'}</Button>
              <Button className="mine-btn" onClick={() => { getAllCurrencies() }}>{isShowAllCurrency ? "HIDE ALL CURRENCIES" : "SHOW ALL CURRENCIES"}</Button>

              {convertedMoney ?
                <div className="modal-container">
                  <Modal isOpen={modal} toggle={toggle} >
                    <Button style={{ height: 'auto', width: 'auto', backgroundColor: '#2f2e41', color: '#fff', marginLeft: 'auto', }} onClick={() => {
                      resetData()
                      toggle()
                    }}>x</Button>
                    <ModalBody>
                      <h4>Conversion Rate is {parseInt(conversionRate[`${firstCurrency}_${secondCurrency}`])} {secondCurrency}</h4>
                      <p>YOUR {amount}  {firstCurrency} = {parseInt(convertedMoney)} {secondCurrency}</p>
                    </ModalBody>
                  </Modal>
                </div>
                : null}
            </header>
          </Col>
        </Row>
        <Row>
          <Col>
            {isShowAllCurrency ?
              <div className="currency-container" >
                <Table responsive >
                  <thead>
                    <tr>
                      <th style={{ color: '#4756be0', fontWeight: 'bold' }}>COUNTRY</th>
                      <th style={{ color: '#4756be', fontWeight: 'bold' }}>CURRENCY ID</th>
                    </tr>
                  </thead>
                  {allCurrencies.map(data => {
                    return (
                      <>
                        <tbody>
                          <tr>
                            <th>{data[1].name}</th>
                            <th>{data[1].currencyId}</th>
                          </tr>
                        </tbody>
                      </>
                    )
                  })}
                </Table>
              </div> : null}
          </Col>

        </Row>
      </Container>
    </div>
  );
}

export default App;
