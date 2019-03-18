import React, { Component } from "react";
import DatePicker from "react-datepicker";

import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

import ErrorBlock from "./error";
import {
  API_PATH_SERIES
} from "./const";


class Series extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series : [],
      error : undefined,
      error_arg : undefined
    };

    this.addSeries = this.addSeries.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    
    fetch(API_PATH_SERIES)
      .then(response => response.json())
      .then(data => this.setState({ series: data.series }));
  }

  addSeries(data) {
    let arr = this.state.series.slice();
    let add = function(id) {
      arr.push({
        'id' : id,
        'name' : data['name'],
        'date_start' : data['date_start'],
        'date_end' : data['date_end']
      });
      return arr;
    };

    fetch(API_PATH_SERIES, {
      method : 'POST',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => this.setState(
              !data.error ? {
                series: add(data.id),
                error : undefined,
                error_arg : undefined
              } : {error : data.error, error_arg : data.error_arg }
      ));
  }


  
  render() {
    return (
        <div className="series">
        <h3>Series:</h3>
        <SeriesList series={this.state.series} />
        <SeriesAddForm seriesFormHandler={this.addSeries} />
        <ErrorBlock error={this.state.error} error_arg={this.state.error_arg}/>
      </div>
    );
  }
}

class SeriesList extends Component {
  render() {
    return (
        <table>
        <tbody>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date start</th>
            <th>Date end</th>
        </tr>
        {this.props.series.map(series =>
          <tr key={series.id}>
             <td>{series.id}</td>
             <td>{series.name}</td>
             <td>{series.date_start}</td>
             <td>{series.date_end}</td>
          </tr>
       )}
      </tbody>
      </table>
    );
  }
}

class SeriesAddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date_start : undefined,
      date_end : undefined,
      name : undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  formatDate(dt) {
    return moment(dt).format(DATE_FORMAT);
  }

  handleSubmit(event) {
    event.preventDefault();
    let t = {};
    for (let [key, value] of Object.entries (this.state) ) {
      if (value) {
        t[key] = value;
      }
    }
    if (t.date_start) {
      t.date_start = this.formatDate (t.date_start);
    }
    if (t.date_end) {
      t.date_end = this.formatDate (t.date_end);
    }
    this.props.seriesFormHandler(t);
  }
    
  handleChange(key, x) {
    let t = this.state;
    t[key] = x;
    this.setState(t);
  }
  
  render() {
    return (
      <div className="addForm">
        <h4>New series</h4>
        <form onSubmit={this.handleSubmit}>

        <fieldset>
        <label>Name:</label><input name="name" onChange={ (x) => this.handleChange('name', x.target.value) }
        />
        </fieldset>

        <fieldset>
        <label>Start date:</label>

        <DatePicker
         selected={this.state.date_start}
         onChange={ (date) => this.handleChange('date_start', date) }
         dateFormat="MMMM d, yyyy"
        />
        </fieldset>

        <fieldset>
      
        <label>End date</label>:
        <DatePicker
         selected={this.state.date_end}
         onChange={ (date) => this.handleChange('date_end', date) } 
         dateFormat="MMMM d, yyyy"
        />
      
      </fieldset>
        
        <button>Submit</button>
        </form>
     </div>
    )
  }
}


  
export default Series;