import { Table, Button, Space, Popconfirm, Tag, Image } from 'antd';


export default function BookList(props) {

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 150,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 80,
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      width: 150,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
    },
    {
      title: "Cover",
      dataIndex: 'coverUrl',
      width: 120,
      render: (text) => (
        <Image src={`http://localhost:3080/${text}`} height={100} />
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (value) => (
        <Tag color="blue">{value.name}</Tag>
      ),
    },
    {
      title: 'Liked',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (text, record) => (
      <Space key={record.id}>
        <Button type="primary" onClick={() => props.onLiked(record.id)}>Like</Button>
        <Button className="Edit-button" onClick={() => props.onEdited(record)}>Edit</Button>
        <Popconfirm title="Are you sure you want to delete this book?" onConfirm={() => props.onDeleted(record.id)}>
          <Button danger type="dashed">Delete</Button>
        </Popconfirm>
      </Space>
    ),
    }
  ]

  return (
    <Table 
      rowKey="id" 
      dataSource={props.data} 
      columns={columns} 
      rowClassName={(record, index) => {
        if(record.stock < 30) {
          return "red-row";
        }
      }}/>
  )
}
