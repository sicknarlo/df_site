import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';

function ageCalc(dateString) {
  if (dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
}

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
    if (!a.adp[0][this.props.values.adpKey]) return 1;
    if (!b.adp[0][this.props.values.adpKey]) return -1;
    if (a.adp[0][this.props.values.adpKey] > b.adp[0][this.props.values.adpKey]) {
      return 1;
    }
    if (a.adp[0][this.props.values.adpKey] < b.adp[0][this.props.values.adpKey]) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
      if (!a.adp[0][this.props.values.adpKey]) return -1;
      if (!b.adp[0][this.props.values.adpKey]) return 1;
    if (a.adp[0][this.props.values.adpKey] > b.adp[0][this.props.values.adpKey]) {
      return -1;
    }
    if (a.adp[0][this.props.values.adpKey] < b.adp[0][this.props.values.adpKey]) {
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
    if (a[this.props.values.trend3]> b[this.props.values.trend3]) {
      return 1;
    }
    if (a[this.props.values.trend3]< b[this.props.values.trend3]) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (a[this.props.values.trend3] > b[this.props.values.trend3]) {
      return -1;
    }
    if (a[this.props.values.trend3] < b[this.props.values.trend3]) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByTrend',

};
let sortByValue = {
  asc: function(a, b) {
    if (a.adp[0][this.props.values.valueKey] > b.adp[0][this.props.values.valueKey]) {
      return 1;
    }
    if (a.adp[0][this.props.values.valueKey] < b.adp[0][this.props.values.valueKey]) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (a.adp[0][this.props.values.valueKey] > b.adp[0][this.props.values.valueKey]) {
      return -1;
    }
    if (a.adp[0][this.props.values.valueKey] < b.adp[0][this.props.values.valueKey]) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByValue',
};

let sortByRank = {
  asc: function(a, b) {
    if (!a.rankings) return 1;
    if (!b.rankings) return -1;
    if (a.rankings[0][this.props.values.rankKey] > b.rankings[0][this.props.values.rankKey]) {
      return 1;
    }
    if (a.rankings[0][this.props.values.rankKey] < b.rankings[0][this.props.values.rankKey]) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (!a.rankings) return -1;
    if (!b.rankings) return 1;
    if (a.rankings[0][this.props.values.rankKey] > b.rankings[0][this.props.values.rankKey]) {
      return -1;
    }
    if (a.rankings[0][this.props.values.rankKey] < b.rankings[0][this.props.values.rankKey]) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByRank',
};

let sortByAge = {
  asc: function(a, b) {
    if (!a.birthdate) return 1;
    if (!b.birthdate) return -1;
    if (ageCalc(a.birthdate) > ageCalc(b.birthdate)) {
      return 1;
    }
    if (ageCalc(a.birthdate) < ageCalc(b.birthdate)) {
      return -1;
    }
    // a must be equal to b
    return 0;
  },
  desc: function(a, b) {
    if (!a.birthdate) return 1;
    if (!b.birthdate) return -1;
    if (ageCalc(a.birthdate) > ageCalc(b.birthdate)) {
      return -1;
    }
    if (ageCalc(a.birthdate) < ageCalc(b.birthdate)) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },
  _str: 'sortByAge',
};

// Player component - represents a Player profile
export default class Players extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: [],
      sortGrp: sortByADP,
      sortDirection: 'asc',
      sort: sortByADP.asc.bind(this),
      search: '',
    };
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
      if (this.state.sortDirection === 'asc') {
        this.setState(function() {
          return { sort: newSort.desc.bind(this), sortDirection: 'desc' };
        })
      } else {
        this.setState(function() {
          return { sort: newSort.asc.bind(this), sortDirection: 'asc' };
        })
      }
    } else {
      this.setState(function() {
        return {
          sortGrp: newSort,
          sortDirection: 'asc',
          sort: newSort.asc.bind(this)
        }
      })
    };
  }
  render() {
    console.log(this.props.players);
    const filteredData = this.props.players && this.props.players.filter((player) => {
      if (this.state.filter.length == 0) {
        return true;
      } else {
        return this.state.filter.indexOf(player.position) > -1 || (this.state.filter.indexOf(player.status) > -1 && player.position !== "PICK");
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
    const rookieCls = classnames(
        'btn',
        'btn-outline',
        'btn-primary',
        'playersFilterToggle',
        { active: this.state.filter.indexOf('R') > -1 }
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
          {/* <th>
            <div
              className="sortToggle"
              onClick={this.toggleSort.bind(this, sortByRank)}>
              Rank <i className={classnames('fa', 'fa-unsorted', { active: this.state.sortGrp === sortByRank })}></i>
            </div>
          </th> */}
          <th>
            <div
              className="sortToggle"
              onClick={this.toggleSort.bind(this, sortByADP)}>
              ECR <i className={classnames('fa', 'fa-unsorted', { active: this.state.sortGrp === sortByADP })}></i>
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
                      <Checkbox
                        checkboxClass="icheckbox_flat-green positionFilter"
                        increaseArea="20%"
                        label="ROOKIES"
                        onChange={this.toggleFilter.bind(this, 'R')}
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
                          values={this.props.values}
                        />
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
