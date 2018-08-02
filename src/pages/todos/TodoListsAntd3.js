/**
 * Created by jm on 17/12/19.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import { Table, Breadcrumb, Row, Col, Button, } from 'antd';

import Filter from '../../components/Filter/index';
import InfiniteScroll from 'react-infinite-scroller';

let count = 0;
const TodoListsAntd3 = (props) => {
  //console.log(props);
  const onloadMore = () => {
    console.log(1);
    const refetchVariables = (fragmentVariables) => {
      count++;
      console.log({
        ...fragmentVariables,
        count: fragmentVariables.count + 1 * count,
      })
      return {
        ...fragmentVariables,
        count: fragmentVariables.count + 1 * count,
      }
    };
    props.relay.refetch(refetchVariables);
  };


  const columns = [{
    width: 150,
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => (<a href="#">{text}</a>),
  }, {
    title: '名字',
    dataIndex: 'text',
    key: 'text',
  }, {
    title: '是否完成',
    dataIndex: 'complete',
    key: 'complete',
    render: (text) => (text.toString()),
  }];
  const data2 = props.viewer.todos.edges.map(({node}) => node);
  // console.log(data2);
  console.log(props.viewer.todos.pageInfo.hasNextPage)
  return (
    <div style={{ width: '100%', height: '100%', display:'flex', flexDirection: 'column'}}>
      <Row style={{ marginBottom: '16px' }}>
        <Col span={5}>
          <Breadcrumb >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={19}>
          <Row gutter={16}>
            <Col offset={18} span={3} style={{textAlign: 'right'}}>
              <Button icon="plus" type="primary">新增</Button>
            </Col>
            <Col span={3} style={{textAlign: 'right'}}>
              <Button icon="download" type="primary">导出</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ flex: 1, background: '#fff', padding: '24px 24px 0 24px', display:'flex', flexDirection: 'column'}}>
        <Filter />
        <div style={{flex: 1}}>
          <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right:0  }}>
              <div style={{width: '100%', height:'100%', overflow:'auto'}}>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={onloadMore}
                  hasMore={props.viewer.todos.pageInfo.hasNextPage}
                  loader={<div className="loader">Loading ...</div>}
                  useWindow={false}
                  threshold={50}
                >
                  <Table
                    columns={columns}
                    dataSource={data2}
                    pagination={false}
                    rowKey={ (record) => (record.id) }
                  />
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default createRefetchContainer(TodoListsAntd3, graphql`
    fragment TodoListsAntd3_viewer on User @argumentDefinitions(
      count: {type: Int, defaultValue: 10},  # Optional argument
    ) {
        id
        todos(
          first: $count
        )  @connection(key: "TodoListsAntd3_todos") {
            edges {
                node {
                    id
                    text
                    complete
                }
            }
        }
    }`,
    graphql`
        query TodoListsAntd3Query ($count: Int) {
            viewer {
                ...TodoListsAntd3_viewer @arguments(count: $count)
            }
        }
  `,
);


