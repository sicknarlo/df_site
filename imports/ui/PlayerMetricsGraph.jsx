import React, { Component, PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

HighchartsMore(ReactHighcharts.Highcharts);

// PlayerMetricsGraph component - represents a PlayerMetricsGraph profile
export default class PlayerMetricsGraph extends Component {

  render() {
    const player = this.props.player;
    const config = {
      chart: {
            polar: true,
            type: 'line'
        },

        title: {
            text: 'Combine Metrics'
        },

        pane: {
            size: '80%'
        },

        xAxis: {
            categories: ['40yd', 'Bench', 'Vertical', 'Broad',
                    'Shuttle', 'Cone'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}"><b>{point.y:.0f} percentile</b><br/>'
        },

        series: [{
            name: player.name,
            data: [
              player.metrics.forty_percentile * 100,
              player.metrics.bench_percentile * 100,
              player.metrics.vertical_percentile * 100,
              player.metrics.broad_percentile * 100,
              player.metrics.shuttle_percentile * 100,
              player.metrics.cone_percentile * 100
            ],
            pointPlacement: 'on'
        }]

    };
    return (
      <div className="adpChart">
        <ReactHighcharts config={config} className="adpChart-container" />
      </div>
    );
  }
}

PlayerMetricsGraph.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
