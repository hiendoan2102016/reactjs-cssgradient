import React, { Component } from 'react';

// import Draggable from "react-draggable";

import { ChromePicker } from 'react-color';

import { Container, Row, Col } from 'reactstrap';
import { FormGroup, Label, Input } from 'reactstrap';

import '../style/style.css'

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listArray: [
        { hexColor: '00ff00', ratio: 0 },
        { hexColor: '0000ff', ratio: 40 }
      ],
      arr: [0, 40],
      number: 0,
      color: '', // màu của chromepicker
      hexInput: '', // màu của input
      numberInput: 0, // lưu index tìm kiếm được dựa trên ratio tương ứng của màu trên input hexcolor
      // phục vụ cho xóa phần tử
      numberInput1: 0, // lưu index tìm kiếm được dựa trên name( name được set = item.ratio ) của input
      // phục vụ cho sửa ở chormepicker ( khi input có nhiều màu giống nhau)
      numberIndex: 0, // lưu index tìm kiếm được dựa trên raito ở inputRatio ( thanh tỉ lệ )
      background: "linear-gradient(to right,#00ff00 0%, #0000ff 40%)", // màu ban đầu
      displayChomePicker: false, // hiển thị chromepicker
      deltaPosition: { // Dragable
        x: 0, y: 0
      }
    }
  }
  getMouse = () => {
    var xMouse = event.clientX;
    var yMouse = event.clientY;

    // lấy khoảng cách phần tử so với đầu trang web
    var rect = document.querySelector(".gradient-bar").getBoundingClientRect()
    var distance = xMouse - rect.x; // khoảng cách của con trỏ chuột với đầu phần tử chỉ định 
    var ratio = 0; // tỉ lệ màu
    if (yMouse >= rect.y && yMouse <= rect.y + 40) {
      ratio = (Math.round(distance / 540 * 100) / 100); // làm tròn
    }
    return ratio;
  }
  // đưa tỉ lệ chuột vào 1 mảng để so sánh
  pushRatio = () => {
    var ratio = this.getMouse();
    const { arr } = this.state;
    arr.push(ratio * 100);
    arr.sort((a, b) => a - b);
    this.setState({
      arr: arr
    })
  }
  setRatio = () => {
    const { arr } = this.state;
    this.pushRatio();
    var ratio = this.getMouse();
    var ratioColor = 0, stt = 0, distance = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == ratio * 100) {
        stt = i;
      }
    }
    if (stt == arr.length - 1) {
      distance = 100 - arr[stt - 1];
    } else {
      var distance = arr[stt + 1] - arr[stt - 1];
    }
    ratioColor = Math.ceil((arr[stt] - arr[stt - 1]) / distance * 100);
    // console.log('stt: ', stt);
    // console.log('distance', distance);
    // console.log('ratiocolor: ', ratioColor ,'%');
    return ratioColor; // tỉ lệ phần trăm giữa 1 điểm giữa 2 phần tử.
  }
  getColor = () => {
    // this.setRatio();
    var { listArray } = this.state;
    var ratio = this.setRatio();
    // console.log(ratio)
    // console.log(listArray)
    var d = listArray.length;
    // console.log('chiều dài danh sách: ', d)
    var color1 = '';
    var color2 = '';
    var middle = '';
    // console.log('tỉ lệ ở cuối danh sách: ', listArray[d - 1].ratio)
    // console.log(this.getMouse() * 100)
    if (this.getMouse() * 100 > listArray[d - 1].ratio) {
      color1 = listArray[d - 1].hexColor;
      color2 = listArray[d - 1].hexColor;
    }
    else if (this.getMouse() * 100 < listArray[0].ratio) {
      color1 = listArray[0].hexColor;
      color2 = listArray[0].hexColor;
    }
    else {
      for (let i = 0; i < listArray.length; i++) {
        if (listArray[i].ratio < this.getMouse() * 100 && listArray[i + 1].ratio > this.getMouse() * 100) {
          color1 = listArray[i].hexColor;
          color2 = listArray[i + 1].hexColor;
        }
      }
      // color1 = listArray[numberID].hexColor;
      // color2 = listArray[numberID+1].hexColor;
    }
    console.log('color1: ', color1, 'color2: ', color2)
    var hex = function (x) {
      x = x.toString(16);
      return (x.length == 1) ? '0' + x : x;
    };

    // grb color
    var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio / 100 + parseInt(color2.substring(0, 2), 16) * (1 - ratio / 100));
    var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio / 100 + parseInt(color2.substring(2, 4), 16) * (1 - ratio / 100));
    var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio / 100 + parseInt(color2.substring(4, 6), 16) * (1 - ratio / 100));

    middle = hex(r) + hex(g) + hex(b); // =>> string
    // console.log(middle);
    listArray.push({ hexColor: middle, ratio: this.getMouse() * 100 })
    this.setState({
      listArray: listArray
        .sort((a, b) => { return a.ratio - b.ratio })
    })
  }
  // hiện thỉ form màu Hex
  showColortoForm = () => {
    const { arr } = this.state;
    this.getColor();


  }
  //
  findIndexs = (texts) => { //tìm kiếm 
    const { listArray } = this.state;
    var stt = 0;
    function checkAdult(array, index) {
      if (array.ratio === parseInt(texts)) {
        stt = index;
      }
    }
    listArray.filter(checkAdult)
    return stt;
  }
  findIndexs1 = (texts) => { // tìm kiếm bằng màu
    const { listArray } = this.state;
    var stt = 0;
    function checkAdult(array, index) {
      if (array.ratio === parseInt(texts)) {
        stt = index;
      }
    }
    listArray.filter(checkAdult)
    return stt;
  }
  // // click on input to set state title = this.findIndexs(value)
  onClicktoInput = (event) => {

    const { listArray, numberInput } = this.state;
    var texts = event.target.value;
    var texts1 = event.target.name;
    var number = this.findIndexs(texts);
    var number1 = this.findIndexs1(texts1);
    console.log('number: ', number);
    this.setState({
      numberInput: number,
      numberInput: number1,
      hexInput: texts1,
      color: texts,
      displayChomePicker: true
    })
  }
  // //  change value of input
  onChangeInput = (event) => {
    var texts = event.target.value;
    const { listArray, numberInput } = this.state;
    listArray[numberInput] = {
      hexColor: texts,
      ratio: listArray[numberInput].ratio
    }
    const arrayColor = listArray.map(item => {
      return [item.hexColor, item.ratio].join(" ") //array
    })
    this.setState({
      listArray: listArray,
      background: `linear-gradient(to right, #${arrayColor.join('%, #')}%)`
    })
    //console.log('change: ', listArray, 'bacground: ', background)
  }

  onClickRatio = (event) => {
    const { listArray } = this.state;
    console.log('texxt click: ', event.target.value)
    var texts = event.target.value; // string
    var number = 0;
    console.log(listArray, texts)
    listArray.findIndex((item, index) => {
      if (item.ratio == parseInt(texts)) {
        number = index;
        console.log('number: ', number)
      }
      return number;
    })
    this.setState({
      numberIndex: number
    })
  }

  onChangeRatio = (event) => {
    var texts = event.target.value;
    const { listArray, numberIndex } = this.state;
    listArray[numberIndex] = {
      ...listArray[numberIndex],
      ratio: parseInt(texts)
    }
    // listArray.sort( (a,b) => {
    //   return a.ratio -b.ratio
    // })
    const arrayColor = listArray
      // .sort( (a,b) => {
      //   return a.ratio -b.ratio
      // })
      .map(item => {
        return [item.hexColor, item.ratio].join(" ") //array
      })
    this.setState({
      listArray: listArray,
      background: `linear-gradient(to right, #${arrayColor.join('%, #')}%)`
    })
    console.log('lisst on Change ratio: ', listArray)
  }
  // //delete the form input color 
  deleteForm = (event, index) => {
    const { listArray } = this.state;
    var ev = event.target.value;
    console.log(event)
    var number = this.findIndexs(ev);
    console.log(number)
    if (listArray.length > 2) {
      listArray.splice(number, 1);
    }
    const arrayColor = listArray.map(item => {
      return [item.hexColor, item.ratio].join(" ") //array
    })
    this.setState({
      listArray: listArray,
      background: `linear-gradient(to right, #${arrayColor.join('%, #')}%)`
    })
    console.log('list khi delete: ', listArray)
  }
  clickChangeonChromepicker = (color) => {
    const { listArray, hexInput,numberInput1 } = this.state;
    var texts = color.hex.slice(1);
    console.log(texts)
    console.log(hexInput)
    var stt = 0;
    listArray.findIndex((item, index) => {
      if (item.ratio == hexInput) {
        stt = index;
        console.log('stt: ', stt)
      }
      return stt;
    })
    console.log('find number stt: ', stt)
    listArray[stt] = {
      hexColor: texts,
      ratio: listArray[stt].ratio
    }
    console.log(listArray[stt])
    const arrayColor = listArray.map(item => {
      return [item.hexColor, item.ratio].join(" ") //array
    })
    this.setState({
      listArray: listArray,
      hexInput: listArray[stt].ratio,
      color: color.hex,
      background: `linear-gradient(to right, #${arrayColor.join('%, #')}%)`
    })
    console.log('listArray ', listArray)
  }
  // màu theo chiều ngang
  toRight = () => {
    const { listArray } = this.state;
    const arrayColor = listArray.map(item => {
      return [item.hexColor, item.ratio].join(" ") //array
    })
    this.setState({
      background: `linear-gradient(to right, #${arrayColor.join('%, #')}%)`
    })
  }
  // màu theo hình tròn đồng tâm
  toCircle = () => {
    const { listArray } = this.state;
    const arrayColor = listArray.map(item => {
      return [item.hexColor, item.ratio].join(" ") //array
    })
    this.setState({
      background: `radial-gradient(circle, #${arrayColor.join('%, #')}%)`
    })

  }
  // màu theo góc quay
  toRotate = () => {
    const { listArray } = this.state;
    const arrayColor = listArray.map(item => {
      return [item.hexColor, item.ratio].join(" ") //array
    })
    this.setState({
      background: `linear-gradient(10deg, #${arrayColor.join('%, #')}%)`
    })
  }
  // thay đổi màu ở input
  render() {
    const { listArray, background, deltaPosition } = this.state;
    var backgrounds = background;
    //console.log('array in render: ', listArray)
    return (
      <div className="gradien">
        <Container>
          <Row>
            <Col xs="6">
              <h1>Doan</h1>
              <div className="buttonChangeColor">
                <div
                  className="buld1"
                  onClick={this.toRight}
                >
                </div>
                <div
                  className="buld2"
                  onClick={this.toCircle}
                >
                </div>
                <div
                  className="buld3"
                  onClick={this.toRotate}
                >
                </div>
              </div>
              <div>
                {this.state.displayChomePicker ?
                  <div className="ChromePicker">
                    <ChromePicker
                      color={this.state.color}
                      onChange={this.clickChangeonChromepicker} />
                  </div> : null}
              </div>
            </Col>
            <Col xs="6">
              <div className="gradient-bar">
                <div
                  className="gradien-bar-bg"
                  style={{ backgroundImage: backgrounds }}
                  onClick={this.showColortoForm}
                ></div>
                {listArray.map((item, index) => (
                  <div className="ttt "
                    // style = {{left: `${item.ratio}%`}} 
                    style={{ transform: `translateX(${item.ratio * 5.17}px) translateY(${0}px)` }}
                    key={index}
                  >
                    <div
                      className="tt  handle"
                      style={{ background: `#${item.hexColor}` }}
                    >
                    </div>
                    <input className="input-1"
                      onChange={this.onChangeRatio}
                      onClick={this.onClickRatio}
                      value={item.ratio}
                      key={index}
                    // style={{ transform: `translateX(${0}px) translateY(${0}px)` }}
                    ></input>
                  </div>

                ))}
              </div>

              {listArray.map((item, index) => (
                <div key={index}>
                  <FormGroup className="inpu1">
                    <Label>Hex</Label>
                    <Input type="text"
                      value={item.hexColor}
                      onChange={this.onChangeInput}
                      onClick={this.onClicktoInput}
                      name = {item.ratio}
                    />
                    <button
                      onClick={this.deleteForm}
                      value={item.ratio}
                    >
                      xóa
                    </button>
                  </FormGroup>
                </div>

              ))}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
export default Add;
