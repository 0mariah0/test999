import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Tag } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

const SorterListItem = ({ data }) => {
    return (
        <div className='sorter-list-item'>
            <div className='sorter-list-item-img'>
                <img width='200' height='100' src={data.baseInfo.picture}></img>
            </div>
            <div className='sorter-list-item-center'>
                <Link className='sorter-list-item-title' to={`/sorters/${data.baseInfo._id}`}>
                    <Typography.Title level={5}>{data.baseInfo.name}</Typography.Title>
                </Link>
                <Typography.Text type='secondary' className='sorter-list-item-description'>
                    {data.baseInfo.description}
                </Typography.Text>
                <div className='sorter-list-item-tags'>
                    {data.baseInfo.tags.map((tag, index) => {
                        const isLongTag = tag.length > 20;

                        const tagElem = (
                            <Tag className='tag' key={index} closable={false}>
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </Tag>
                        );
                        return isLongTag ? (
                            <Tooltip title={tag} key={index}>
                                {tagElem}
                            </Tooltip>
                        ) : (
                            tagElem
                        );
                    })}
                </div>
            </div>
            <div className='sorter-list-item-right'>
                <div className='sorter-list-item-stats'>
                    <div>
                        <Typography.Text type='secondary'>taken </Typography.Text>
                        <b>{data.baseInfo.total_plays}</b>
                        <Typography.Text type='secondary'> times</Typography.Text>
                    </div>
                    <div>
                        <Typography.Text type='secondary'>viewed </Typography.Text>
                        <b>{data.baseInfo.views}</b>
                        <Typography.Text type='secondary'> times</Typography.Text>
                    </div>
                    <div>
                        <b>{data.baseInfo.favorites}</b>
                        <Typography.Text type='secondary'> favorites</Typography.Text>
                    </div>
                </div>
                <div className='sorter-list-item-favorite'>
                    <HeartOutlined />
                </div>
            </div>
        </div>
    );
};

export default SorterListItem;
