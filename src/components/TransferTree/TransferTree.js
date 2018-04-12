import React from 'react';
import PropTypes from 'prop-types';
import List from './List';
import ListTree from './ListTree';
import {Icon} from 'antd';
import classNames from 'classnames';
import './style/index.less';

function noop() {
}

export default class TransferTree extends React.Component {
  static defaultProps = {
    prefixCls: 'antui-transfer-tree',
    dataSource: [],
    targetKeys: [],
    onChange: noop,
    titleText: '源列表',
    treeKey: 'id',
    treeTitleKey: 'title',
    showSearch: false,
    footer: noop,
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    dataSource: PropTypes.array,
    targetKeys: PropTypes.array,
    onChange: PropTypes.func,
    height: PropTypes.number,
    listStyle: PropTypes.object,
    listRender: PropTypes.func,
    treeKey: PropTypes.string,
    treeTitleKey: PropTypes.string,
    className: PropTypes.string,
    titleText: PropTypes.string,
    operations: PropTypes.array,
    showSearch: PropTypes.bool,
    filterOption: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    notFoundContent: PropTypes.node,
    footer: PropTypes.func,
    rowKey: PropTypes.func,
    treeRender: PropTypes.func,
    loadData: PropTypes.func,
    onSelected: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      leftFilter: '',
      rightFilter: '',
      targetNodes: props.targetNodes || [],
      selectedKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {

    const { targetNodes } = nextProps;
    if ('targetNodes' in nextProps) {
      this.setState({
        targetNodes: targetNodes,
      });
    }
  }

  handleFilter = (direction, v) => {
    this.setState({
      [`${direction}Filter`]: v,
    });
  }

  handleLeftFilter = (v) => this.handleFilter('left', v)
  handleRightFilter = (v) => this.handleFilter('right', v)

  handleClear = (direction) => {
    this.setState({
      [`${direction}Filter`]: '',
    });
  }

  handleRightClear = () => this.handleClear('right');
  handleDeleteItem = (nodes) => {
    const targetNodes = this.state.targetNodes.filter(node => !nodes.some(item => item.key === node.key));
    const targetKeys = targetNodes.map(node => node.key);

    this.setState({
      selectedKeys: targetKeys,
      targetNodes: targetNodes
    })

    this.props.onChange && this.props.onChange(targetKeys, targetNodes);
  }

  onTreeSelected = (selectedNodes) => {
    let targetNodes = selectedNodes.map(node => ({
      key: node.key,
      ...node.props,
    }));

    if (this.props.filter) {
      targetNodes = targetNodes.filter(node => this.props.filter(node));
    }

    const targetKeys = targetNodes.map(node => node.key);
    
    this.setState({
      selectedKeys: targetKeys,
      targetNodes: targetNodes
    })

    this.props.onChange && this.props.onChange(targetKeys, targetNodes);
  }

  render() {
    const {
      prefixCls, titleText, showSearch, notFoundContent, treeKey, treeTitleKey, dataSource,
      searchPlaceholder, footer, listStyle, className,
      listRender, treeRender, loadData
    } = this.props;
    const { leftFilter, selectedKeys, targetNodes } = this.state;

    const cls = classNames({
      [className]: !!className,
      [prefixCls]: true,
    });

    return (
      <div className={cls}>
        <ListTree titleText={titleText}
          loadData={loadData}
          treeData={dataSource}
          selectedKeys={selectedKeys}
          treeKey={treeKey}
          treeTitleKey={treeTitleKey}
          treeRender={treeRender}
          style={listStyle}
          handleFilter={this.handleLeftFilter}
          onTreeSelected={this.onTreeSelected}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          notFoundContent={notFoundContent}
          footer={footer}
          prefixCls={`${prefixCls}-list`}
        />
        <div className={`${prefixCls}-operation`}>
          <Icon type="right" />
        </div>
        <List
          dataSource={targetNodes}
          style={listStyle}
          onDeleteItem={this.handleDeleteItem}
          render={listRender}
          notFoundContent={notFoundContent}
          prefixCls={`${prefixCls}-list`}
        />
      </div>
    );
  }
}