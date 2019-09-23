import React, { Component } from 'react';


import AddForm from '../components/addForm'
import Demo from '../components/demo'
import Add from '../components/add'

import '../style/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Color extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <div>
        <AddForm/>
        {/* <Demo/> */}
        <Add/>
      </div>
    )
  }
}
export default Color;