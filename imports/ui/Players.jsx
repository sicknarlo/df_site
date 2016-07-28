import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';

import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';

let sortByName = {
  asc: function(a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  },
  desc: function(a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }

    // names must be equal
    return 0;
  },
  _str: 'sortByName',
};
let sortByADP = {
  asc: function(a, b) {
    if (a[this.props.values.past6MonthsADP[5]] > b[this.props.values.past6MonthsADP[5]]) {
      return 1;
    }
    if (a[this.props.values.past6MonthsADP[5]] < b[this.props.values.past6MonthsADP[5]]) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (a[this.props.values.past6MonthsADP[5]] > b[this.props.values.past6MonthsADP[5]]) {
      return -1;
    }
    if (a[this.props.values.past6MonthsADP[5]] < b[this.props.values.past6MonthsADP[5]]) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByADP',
};

let sortByPosition = {
  asc: function(a, b) {
    if (a.position > b.position) {
      return 1;
    }
    if (a.position < b.position) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (a.position > b.position) {
      return -1;
    }
    if (a.position < b.position) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByPosition',
};


let sortByTrend = {
  asc: function(a, b) {
    if (a.trend > b.trend) {
      return 1;
    }
    if (a.trend < b.trend) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (a.trend > b.trend) {
      return -1;
    }
    if (a.trend < b.trend) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByTrend',

};
let sortByValue = {
  asc: function(a, b) {
    if (a[this.props.values.past6MonthsValue[5]] > b[this.props.values.past6MonthsValue[5]]) {
      return 1;
    }
    if (a[this.props.values.past6MonthsValue[5]] < b[this.props.values.past6MonthsValue[5]]) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (a[this.props.values.past6MonthsValue[5]] > b[this.props.values.past6MonthsValue[5]]) {
      return -1;
    }
    if (a[this.props.values.past6MonthsValue[5]] < b[this.props.values.past6MonthsValue[5]]) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByValue',
};

let sortByAge = {
  asc: function(a, b) {
    if (ageCalc(new Date(a.birthdate * 1000)) > ageCalc(new Date(b.birthdate * 1000))) {
      return 1;
    }
    if (ageCalc(new Date(a.birthdate * 1000)) < ageCalc(new Date(b.birthdate * 1000))) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (ageCalc(new Date(a.birthdate * 1000)) > ageCalc(new Date(b.birthdate * 1000))) {
      return -1;
    }
    if (ageCalc(new Date(a.birthdate * 1000)) < ageCalc(new Date(b.birthdate * 1000))) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByAge',
};

const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Player component - represents a Player profile
export default class Players extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: [],
      sortGrp: sortByADP,
      sort: sortByADP.asc.bind(this),
      search: '',
    };
    // sortByADP = this.sortByADP.bind(this);
    // sortByAge = this.sortByAge.bind(this);
    // sortByValue = this.sortByValue.bind(this);
    // sortByTrend = this.sortByTrend.bind(this);
    // sortByName = this.sortByName.bind(this);
    // sortByPosition = this.sortByPosition.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  toggleFilter(pos) {
    const index = this.state.filter.indexOf(pos);
    if (index > -1) {
      this.setState(function(previousState) {
        const nextArray = previousState.filter;
        nextArray.splice(index, 1);
        return { filter: nextArray };
      });
    } else {
      this.setState(function(previousState) {
        const nextArray = previousState.filter;
        nextArray.push(pos);
        return { filter: nextArray };
      });
    }
  }

  handleSearch(e) {
    this.setState({ search: e.target.value });
  }

  toggleSort(newSort) {
    if (newSort === this.state.sortGrp) {
        console.log(this.state.sort.name);
      if (this.state.sort.name === "bound asc") {
        this.setState(function() {
          return { sort: newSort.desc.bind(this) }
        })
      } else {
        this.setState(function() {
          return { sort: newSort.asc.bind(this) }
        })
      }
    } else {
      this.setState(function() {
        return {
          sortGrp: newSort,
          sort: newSort.asc.bind(this)
        }
      })
    };
  }
  render() {

    const filteredData = this.props.players && this.props.players.filter((player) => {
      if (this.state.filter.length == 0) {
        return true;
      } else {
        return this.state.filter.indexOf(player.position) > -1;
      }
    });
    const filteredSortedData = filteredData &&
      filteredData.sort(this.state.sort);
    const filteredSortedSearchedData = filteredSortedData &&
      filteredSortedData.filter((p) => {
        return p.name.toLowerCase().includes(this.state.search.toLowerCase())
      });
    const qbCls = classnames(
        'btn',
        'btn-outline',
        'btn-primary',
        { active: this.state.filter.indexOf('QB') > -1 }
    );
    const wrCls = classnames(
        'btn',
        'btn-outline',
        'btn-primary',
        { active: this.state.filter.indexOf('WR') > -1 }
    );
    const rbCls = classnames(
        'btn',
        'btn-outline',
        'btn-primary',
        { active: this.state.filter.indexOf('RB') > -1 }
    );
    const teCls = classnames(
        'btn',
        'btn-outline',
        'btn-primary',
        { active: this.state.filter.indexOf('TE') > -1 }
    );
    const pickCls = classnames(
        'btn',
        'btn-outline',
        'btn-primary',
        'playersFilterToggle',
        { active: this.state.filter.indexOf('PICK') > -1 }
    );

    const tableHeader = (
      <thead>
        <tr>
          <th>
            <div
              className="sortToggle"
              onClick={this.toggleSort.bind(this, sortByName)}>
              Name <i className={classnames('fa', 'fa-unsorted', { active: this.state.sortGrp === sortByName })}></i>
            </div>
          </th>
          <th>
            <div
              className="sortToggle"
              onClick={this.toggleSort.bind(this, sortByPosition)}>
              Position <i className={classnames('fa', 'fa-unsorted', { active: this.state.sortGrp === sortByPosition })}></i>
            </div>
          </th>
          <th className="hide-xs">
            <div
              className="sortToggle"
              onClick={this.toggleSort.bind(this, sortByAge)}>
              Age <i className={classnames('fa', 'fa-unsorted', { active: this.state.sortGrp === sortByAge })}></i>
            </div>
          </th>
          <th>
            <div
              className="sortToggle"
              onClick={this.toggleSort.bind(this, sortByADP)}>
              ADP <i className={classnames('fa', 'fa-unsorted', { active: this.state.sortGrp === sortByADP })}></i>
            </div>
          </th>
          <th className="hide-xs">
            <div
              className="sortToggle"
              onClick={this.toggleSort.bind(this, sortByTrend)}>
              Trend <i className={classnames('fa', 'fa-unsorted', { active: this.state.sortGrp === sortByTrend })}></i>
            </div>
          </th>
          <th className="hide-xs">
            <div
              className="sortToggle"
              onClick={this.toggleSort.bind(this, sortByValue)}>
              Value <i className={classnames('fa', 'fa-unsorted', { active: this.state.sortGrp === sortByValue })}></i>
            </div>
          </th>
        </tr>
      </thead>
    );

    return (
      <div>
        <PageHeading current="Players" db={this.props.currentDb} />
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-lg-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Filters</h5>
                </div>
                <div className="ibox-content">
                  <div className="row">
                    <div className="col-xs-12 players-positionFilters">
                      <Checkbox
                        checkboxClass="icheckbox_flat-green positionFilter"
                        increaseArea="20%"
                        label="QB"
                        onChange={this.toggleFilter.bind(this, 'QB')}
                      />
                      <Checkbox
                        checkboxClass="icheckbox_flat-green positionFilter"
                        increaseArea="20%"
                        label="WR"
                        onChange={this.toggleFilter.bind(this, 'WR')}
                      />
                      <Checkbox
                        checkboxClass="icheckbox_flat-green positionFilter"
                        increaseArea="20%"
                        label="RB"
                        onChange={this.toggleFilter.bind(this, 'RB')}
                      />
                      <Checkbox
                        checkboxClass="icheckbox_flat-green positionFilter"
                        increaseArea="20%"
                        label="TE"
                        onChange={this.toggleFilter.bind(this, 'TE')}
                      />
                      <Checkbox
                        checkboxClass="icheckbox_flat-green positionFilter"
                        increaseArea="20%"
                        label="PICK"
                        onChange={this.toggleFilter.bind(this, 'PICK')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title playersTableHeader">
                  <div className="playersTableHeader-searchContainer">
                    <input
                      type="text"
                      onChange={this.handleSearch}
                      placeholder="Search for Players"
                      value={this.state.search}
                      className="form-control m-b playerTableHeader-search"
                    />
                  </div>
                </div>
                <div className="ibox-content">
                  <table className="table table-hover">
                    {tableHeader}
                    <tbody>
                      {filteredSortedSearchedData && filteredSortedSearchedData.map((player, i) =>
                        <PlayerRow
                            key={i}
                            player={player}
                            sortGrp={this.state.sortGrp._str}
                            values={this.props.values} />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Players.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
