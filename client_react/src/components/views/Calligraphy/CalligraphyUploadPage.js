import React, {useState, useEffect} from 'react'
import { Form, Input,  Col, Row, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import { useSelector } from "react-redux";
import Axios from 'axios';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

const {Option} = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const PrivateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' }
]

function CalligraphyUploadPage(props) {
  const user = useSelector(state => state.user);

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Tags, setTags] = useState("")
  const [Privacy, setPrivacy] = useState(0)
  const [FilePath, setFilePath] = useState("")


  const handleChangeTitle = (event) => {
      setTitle(event.currentTarget.value)
  }
 
 
  const handleChangeDecsription = (value) => {
    setDescription(value)
  }

  
  const handleChangeTags = (event) => {
    setTags(event.currentTarget.value)
  }

  const onDrop = (files) => {

    let formData = new FormData();
    const config = {
        header: { 'content-type': 'multipart/form-data' }
    }
    formData.append("file", files[0])

    Axios.post('/api/calligraphy/uploadfiles', formData, config)
        .then(response => {
            if (response.data.success) {
                let variable = {
                    filePath: response.data.url,
                    fileName: response.data.fileName
                }
                setFilePath(response.data.url)

            } else {
                alert('failed to save the video in server')
            }
        })

}


  const onSubmit = (event) => {
    event.preventDefault();

    if (user.userData && !user.userData.isAuth) {
      return alert('Please Log in First')
  }

  if (title === "" || Description === "" ||
      Privacy === "" ||
      Tags === "" ) {
      return alert('Please first fill all the fields')
  }

    const variables = {
        writer: user.userData._id,
        projectTitle: title,
        description: Description,
        privacy: Privacy,
        tags: Tags,
        thumbnail: FilePath

    }

    console.log(variables);

    Axios.post('/api/calligraphy/uploadProject', variables)
          .then(response => {
            console.log(response);
              if (response.data.success) {
                  alert('프로젝트가 성공적으로 업로드되었습니다.')
                  setTimeout(()=> {
                    props.history.push('/calligraphy')

                  },1000)
              } else {
                  alert('Failed to upload video')
              }
          })

  };

  const handleChangePrivacy = (event) => {
    setPrivacy(event.value)
  }



  return (
    <div className="container">
      <Form onSubmit={onSubmit} className="uploadProject">    
        <div className="input_wrap">
          <label>Title</label>
          <Input 
          onChange={handleChangeTitle}
          value={title}/>
        </div>
      
        
        <Row gutter={24}>
          <Col className="input_wrap" span={12}> 
            <label>Privacy</label>
            <Select 
            onChange={handleChangePrivacy} 
            style={{'width' : '100%'}} 
            labelInValue
            defaultValue={{ value: 0 }}>
              {PrivateOptions.map((item, index) => (
                <Option key={index} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <div className="input_wrap">
          <label>Description</label>
          <ReactQuill value={Description}
          onChange={handleChangeDecsription} />
        </div>
        
        <div className="input_wrap">
          <label>Tags</label>
          <Input
            onChange={handleChangeTags}
            value={Tags}>
          </Input>
        </div>

        <div className="input_wrap">
          <label>Thumbnail Image Upload</label>
          <div className="thumbnail_wrap" >

          <Dropzone
            onDrop={onDrop}
            multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
                <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <PlusOutlined style={{ fontSize: '3rem' }} />

                </div>
            )}
          </Dropzone>
          {FilePath !== "" &&
            <div>
              <img src={`http://localhost:5000/${FilePath}`} alt="haha" />
            </div>
          }
          </div>
        </div>

      
        <div className="btn_wrap my-50 text-center">
          <button type="button" onClick={onSubmit} className="btn blue">
            Submit
          </button>
        </div>

      </Form>
    </div>
  )
}

export default CalligraphyUploadPage
