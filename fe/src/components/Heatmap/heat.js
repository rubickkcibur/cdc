import React from 'react';

const optsDetails = ['radius', 'gradient', 'opacity', 'zooms'];

class Heatmap extends React.Component {
  constructor(props) {
    super(props);
    if (typeof window !== 'undefined') {
      if (!props.__map__) {
        throw new Error('Heatmap has to be a child of Map component');
      } else {
        this.map = props.__map__;
        this.element = props.__ele__;
        this.resolveHeatmap(props).then(() => {
          this.triggerCreated(props);
          // if visible is set to false on created, hide it
          if ((typeof props.visible === 'boolean') && !props.visible) {
            this.heatmap.hide();
          }
          if ('dataSet' in props) {
            this.heatmap.setDataSet(props.dataSet);
          }
        });
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // compare nextProp and this.props determine
    // specify prop need to be refresh
    // alse, assure heatmap is loaded
    const currentProps = this.props;
    this.resolveHeatmap().then(() => {
      this.refreshHeatmap(nextProps, currentProps);
    })
  }

  resolveHeatmap(props) {
    if (this.heatmap) {
      return new Promise((resolve) => {
        resolve(this.heatmap);
      });
    } else {
      return new Promise((resolve) => {
        this.map.plugin(['AMap.Heatmap'], () => {
          const heatmapOptions = this.buildInitOptions(props);
          this.heatmap = new window.AMap.Heatmap(this.map, heatmapOptions);
          resolve(this.heatmap);
        });
      });
    }
  }

  triggerCreated(props) {
    const events = props.events || {};
    if (('created' in events) && (typeof events.created === 'function')) {
      events.created(this.heatmap);
    }
  }

  buildInitOptions(props) {
    const opts = {};
    optsDetails.forEach((key) => {
      if (key in props) {
        opts[key] = props[key];
      }
    });
    return opts;
  }

  refreshHeatmap(nextProps, currentProps) {
    if ('visible' in nextProps) {
      if (nextProps.visible) {
        this.heatmap.show();
      } else {
        this.heatmap.hide();
      }
    }

    const opts = {};
    let optsRefresh = false;
    optsDetails.forEach((key) => {
      if (nextProps[key] !== currentProps[key]) {
        optsRefresh = true;
        opts[key] = nextProps[key];
      }
    });
    if (optsRefresh) {
      this.heatmap.setOptions(opts);
    }

    if (nextProps.dataSet !== currentProps.dataSet ) {
      this.heatmap.setDataSet(nextProps.dataSet);
    }
  }

  render() {
    return null;
  }

  componentWillUnmount() {
    this.heatmap.hide();
    this.heatmap.setMap(null);
    delete this.heatmap;
  }
}
export default Heatmap;
// module.exports = Heatmap;
