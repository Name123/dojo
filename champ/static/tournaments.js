import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import ErrorBlock from "./error";
import {
  API_PATH_TOURNAMENT, API_PATH_SERIES
} from "./const";


const DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss[Z0000]';


class Tournaments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tournaments : [],
      series : [],
      error : undefined,
      error_arg : undefined,
      changed_id : undefined,
      currently_edited : undefined
    };
    this.deleteTournament = this.deleteTournament.bind(this);
    this.filterTournaments = this.filterTournaments.bind(this);
    this.addEditTournament = this.addEditTournament.bind(this);
    this.openEditForm = this.openEditForm.bind(this);
    this.resetCurrent = this.resetCurrent.bind(this);
  }

  componentDidMount() {
    fetch(API_PATH_TOURNAMENT)
      .then(response => response.json())
      .then(data =>
            this.setState(
              !data.error ? { tournaments: data.tournaments }:  { error : data.error }
      )).then (
            )
    fetch(API_PATH_SERIES)
      .then(response => response.json())
      .then(data =>
            this.setState(
              !data.error ? { series: data.series }:  { error : data.error }
      ));
  }

  resetCurrent() {
    this.setState({
      currently_edited : undefined
    });
  }

  addTournament(data) {
    let arr = this.state.tournaments.slice();
    let addTournament = function(id) {
      arr.push({
        'id' : id,
        'name' : data['name'],
        'date_start' : data['date_start'],
        'date_end' : data['date_end']
      });
      return arr;
    };

    fetch(API_PATH_TOURNAMENT, {
      method : 'POST',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => this.setState(
              !data.error ? {
                tournaments: addTournament(data.id),
                error : undefined,
                error_arg : undefined
              } : {error : data.error, error_arg : data.error_arg }
      ));
  }

  editTournament(id, data) {
    let arr = this.state.tournaments.slice();
    let modifyTournament = function() {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          for (let [key, value] of Object.entries(data)) {
            if (value) {
              arr[i][key] = value;
            }
          }
        }
      }
      
      return arr;
    };

    fetch(API_PATH_TOURNAMENT + id + '/', {
      method : 'PUT',
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => this.setState(
                      !data.error ? {
                tournaments: modifyTournament(),
                error : undefined,
                changed_id : id
              } : {error : data.error}
      ));
  }

  addEditTournament(data) {
    this.setState({changed_id : undefined});
    return data.id ? this.editTournament(data.id, data) : this.addTournament(data);
    
  }

  
  filterTournaments(params) {
    let esc = encodeURIComponent;
    let querystr = Object.keys(params)
      .filter(k => params[k] !== undefined)
      .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
    let url = API_PATH_TOURNAMENT + '?' + querystr;
    fetch(url)
      .then(response => response.json())
      .then(data =>
            this.setState(
              !data.error ? {
                tournaments: data.tournaments,
                error : undefined,
                error_arg : undefined
              } : { error : data.error, error_arg : data.error_arg }
       ));
  }

  deleteTournament(i, id) {
    let newArr = this.state.tournaments.slice()
    newArr.splice(i, 1);

    fetch(API_PATH_TOURNAMENT + id + '/', {
      method: 'DELETE'
    }).then(response => response.json())
      .then(
        data => this.setState(!data.error ? {
            tournaments : newArr,
            error : undefined
          } : { error : data.error}
         )
     );
  }

  openEditForm(el) {
    this.setState({currently_edited  : el });
  }

  render() {
    return (
        <div className="tournaments">
        <h3>Tournaments:</h3>
        <TournamentFilter filter={this.filterTournaments} series={ this.state.series }/>
        {
          this.state.tournaments && this.state.tournaments.length > 0 ? (<div>
              <TournamentList
                 tournaments={this.state.tournaments} deleter={this.deleteTournament}
                 editor={this.openEditForm} changed_id={this.state.changed_id}
              />
          </div>) : ''
        }
        <TournamentAddForm
          tournamentFormHandler={this.addEditTournament} series={ this.state.series } current={this.state.currently_edited}
          resetter={this.resetCurrent}
        />
        <ErrorBlock error={this.state.error} error_arg={this.state.error_arg}/>
      </div>

    );
  }
}

class TournamentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibility : props.tournaments.map(x => false),
    };
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails(i) {
    let arr = this.state.visibility.slice();
    arr[i] = !arr[i];
    this.setState({
      visibility : arr
    });
  }

  render() {
    let changed_id = this.props.changed_id;
    return (
      <div>
        <table>
        <tbody>
        <tr>
           <th>ID</th>
           <th>Name</th>
           <th>Date start</th>
           <th>Date end</th>
           <th>Details</th>
           <th>Show details button</th>
           <th>Delete button</th>
       </tr>
        {this.props.tournaments.map((t, i) =>
          <tr key={t.id}>
             <td>{t.id}</td>
             <td>{t.name}</td>
             <td>{t.date_start}</td>
             <td>{t.date_end}</td>
             <TournamentView id={t.id} visible={this.state.visibility[i]} editor={this.props.editor} changed_data={changed_id && changed_id == t.id}
             />
             <td><button onClick={() => this.toggleDetails(i)}> { this.state.visibility[i] ? "Hide details" : "Show details" }</button></td>
             <td><button onClick={() => this.props.deleter(i, t.id)}> Delete </button></td>
          </tr>
       )}
      </tbody>
        </table>
        </div>

     );
  }
}

class TournamentView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tournament : undefined,
      id : this.props.id

    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.visible && (prevProps.visible != this.props.visible || this.props.changed_data && !prevProps.changed_data)) {
      fetch(API_PATH_TOURNAMENT + this.state.id + '/')
      .then(response => response.json())
      .then(data => this.setState({ tournament : data }));
    }
  }

  
  render () {
    return !this.props.visible  ?  ( <td>Hidden</td> ) :
        this.state.tournament ? (<td><table>
            <tbody>
            <tr>
            <th>City</th>
            <th>Country</th>
            <th>Series ID</th>
            <th>Series name</th>
            <th>Series date start</th>
            <th>Series date end</th>
            <th>Edit button</th>
            </tr>

            <tr>
            <td>{this.state.tournament.city}</td>
            <td>{this.state.tournament.country}</td>
            <td>{this.state.tournament.series.id}</td>
            <td>{this.state.tournament.series.name}</td>
            <td>{this.state.tournament.series.date_start}</td>
            <td>{this.state.tournament.series.date_end}</td>
            <td><button onClick={() => this.props.editor(this.state.tournament)}> Editor </button></td>
            </tr>
            </tbody>
            </table>
      </td>) : <td>&nbps;</td>
  }
}

class TournamentFilter extends Component {
  constructor() {
    super();

    this.state = {
      start_date_min: undefined,
      start_date_max : undefined,
      end_date_min: undefined,
      end_date_max : undefined,
      series : undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
   
  formatDate(dt) {
    return dt ? moment(dt).format(DATE_FORMAT) : undefined;
  }


  handleChange(key, x) {
    let t = this.state;
    t[key] = x;
    this.setState(t);
  }
  
  handleSubmit(event) {
    event.preventDefault();
    let t = {};
    t = {
      start_date_min : this.formatDate(this.state.start_date_min),
      start_date_max : this.formatDate(this.state.start_date_max),
      end_date_min : this.formatDate(this.state.end_date_min),
      end_date_max : this.formatDate(this.state.end_date_max),
      series : this.state.series || 0
    };
    this.props.filter(t);
  }

  render() {
    return (
      <div>
        <fieldset>
        <form onSubmit={this.handleSubmit}>
        Min start date:
      
        <DatePicker
         selected={this.state.start_date_min}
         onChange={ (date) => this.handleChange('start_date_min', date) }
         showTimeSelect
         timeFormat="HH:mm"
         timeIntervals={15}
         dateFormat="MMMM d, yyyy h:mm aa"
         timeCaption="time"
        />

      Max start date:
      
        <DatePicker
         selected={this.state.start_date_max}
         onChange={ (date) => this.handleChange('start_date_max', date) }
         showTimeSelect
         timeFormat="HH:mm"
         timeIntervals={15}
         dateFormat="MMMM d, yyyy h:mm aa"
         timeCaption="time"
        />

      Min end date:
      
        <DatePicker
         selected={this.state.end_date_min}
         onChange={ (date) => this.handleChange('end_date_min', date) }
         showTimeSelect
         timeFormat="HH:mm"
         timeIntervals={15}
         dateFormat="MMMM d, yyyy h:mm aa"
         timeCaption="time"
        />

      Max end date:

        <DatePicker
         selected={this.state.end_date_max}
         onChange={ (date) => this.handleChange('end_date_max', date) }
         showTimeSelect
         timeFormat="HH:mm"
         timeIntervals={15}
         dateFormat="MMMM d, yyyy h:mm aa"
         timeCaption="time"
        />

      
      Series:<SeriesSelect series={this.props.series} change={this.handleChange}/>
        <button>Filter</button>
        </form>
        </fieldset>
      </div>
    )
  }
}


class TournamentAddForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.stateFromProps();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  stateFromProps() {
    let current = this.props.current;

    return {
      date_start: current && this.parseDate(current.date_start),
      date_end : current && this.parseDate(current.date_end),
      city : current && current.city,
      country : current && current.country,
      name : current && current.name,
      id : current && current.id,
      series : current && current.series.id,
      series_obj : current && current.series
    };
  }
  
  resetState() {
    this.setState(this.stateFromProps);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.current && this.props.current.id && !this.state.id ||
        !this.props.current && this.state.id ||
        this.props.current && this.props.current.id && this.props.current.id != this.state.id
       ) {
      this.resetState();
    }
  }

  formatDate(dt) {
    return moment(dt).format(DATE_FORMAT);
  }

  parseDate(datestr) {
    return datestr ? moment(datestr, DATE_FORMAT).toDate() : undefined;
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
    delete t.series_obj;
    this.props.tournamentFormHandler(t);
  }
    
  handleChange(key, x) {
    let t = this.state;
    t[key] = x;
    this.setState(t);
  }

  handleReset() {
    this.props.resetter();
  }
  
  render() {
    return (
        <div className="addForm">
        <h4> { this.state.id ? "Edit tournament '" + this.state.name + "'" : "New tournament"}</h4>
        <form onSubmit={this.handleSubmit}>
        <input type="hidden" name="id" value={this.state.id}
        />

      <fieldset>
        <label>Name:</label><input name="name" onChange={ (x) => this.handleChange('name', x.target.value) }
        value={this.state.name}/>
        </fieldset>

      <fieldset>
        <label>City:</label><input name="city" onChange={ (x) => this.handleChange('city', x.target.value) } value={this.state.city}/>
      </fieldset>
      
      <fieldset>
        <label>Country:</label><input name="country" onChange={ (x) => this.handleChange('country', x.target.value) }
        value={this.state.country}/>
      </fieldset>

      <fieldset>
        <label>Series:</label>
        <SeriesSelect series={this.props.series} current={this.state.series_obj} change={this.handleChange}/>
      </fieldset>


      <fieldset>
        <label>Start date:</label>
      
        <DatePicker
         selected={this.state.date_start}
         onChange={ (date) => this.handleChange('date_start', date) }
         showTimeSelect
         timeFormat="HH:mm"
         timeIntervals={15}
         dateFormat="MMMM d, yyyy h:mm aa"
         timeCaption="time"
        />
      </fieldset>


      <fieldset>
        <label>End date:</label>
        <DatePicker
         selected={this.state.date_end}
         onChange={ (date) => this.handleChange('date_end', date) } 
         showTimeSelect
         timeFormat="HH:mm"
         timeIntervals={15}
         dateFormat="MMMM d, yyyy h:mm aa"
         timeCaption="time"
        />
      </fieldset>
        <button type="submit">Submit</button>
        {
          this.state.id ? 
            <button type="button" onClick={this.handleReset}>Unbind</button>
            : ''
        }
      </form>
     </div>
    )
  }
}

class SeriesSelect extends Component {
  render() {
    let current = this.props.current || {};
    return (
        <select value={current.id} onChange={ (x) => this.props.change('series', x.target.value) }>
        <option key="0" value="0"></option>
      {
          this.props.series.map(
            s => <option key={s.id} value={s.id}>
              {s.name}
            </option> )
        }
        </select>
    )
  }
}



export default Tournaments;