import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";

function Chat({ socket, username, room, prevData}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [imageSelected, setImageSelected] = useState("");
  const [image_url, setImageUrl] = useState("#");
  //const [media, setMedia] = useState("false")
  const [counter, setCounter] = useState(0);

  prevData.map((data) => {
    setMessageList((list) => [...list, data]);
  })

  const sendMessage = async () => {
    if (currentMessage !== "" || image_url !== "#") {
      const messageData = {
        url: image_url,
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await Axios.post("/add_user",messageData);
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setImageUrl("#");
    }
  };

  const uploadImage = async () => {
    if (imageSelected !== "") {
      const formdata = new FormData();
      formdata.append("file", imageSelected);
      formdata.append("upload_preset", "cyvi6iuz");
      await Axios.post("https://api.cloudinary.com/v1_1/davatyglp/image/upload", formdata,
        {
          onUploadProgress: data => {
            //Set the progress value to show the progress bar
            setCounter(Math.round((100 * data.loaded) / data.total))
          }
        },
      ).then(async (response) => {
        await setImageUrl(response.data.secure_url);
        console.log(response.data.secure_url);
      }).catch((e) => {
        console.log(e);
      });
      setImageSelected("");
    }
  };

  useEffect(() => {
    Axios.get("/users").then((response) => {
      for(let i=0;i<response.data.length;i++){
        setMessageList((list) => [...list, response.data[i]]);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]); 

  return (
    <div className="main">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          {counter !== 0 && counter !== 100 ? (<Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading {counter}%
          </Button>) : (<Navbar.Brand href="#home">LIVE DISCUSSION</Navbar.Brand>)
          }
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <div className="upload">
                <input type="file" accept="image/*" onChange={(event) => { setImageSelected(event.target.files[0]); }} />
                </div></Nav>
                <Nav>
                <Button variant="primary" className="UPLOAD-BUTTON" onClick={uploadImage}>upload</Button>
                </Nav>
                <Nav>
                <Button variant="primary" onClick={sendMessage}>publish</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <MDBContainer fluid className="py-5 gradient-custom">
        <MDBRow>
          <MDBCol md="6" lg="7" xl="8">
            <MDBTypography listUnStyled className="text-white">

              {messageList.map((messageContent) => {
                return (
                  <li className="d-flex justify-content-between mb-4">
                    <MDBCard className="mask-custom">
                      <MDBCardHeader
                        className="d-flex justify-content-between p-3"
                        style={{ borderBottom: "1px solid rgba(255,255,255,.3)" }}
                      >
                        <p className="fw-bold mb-0">{messageContent.author}</p>
                        <h5>&#160;&#160;&#160;</h5>
                        <p className="text-light small mb-0">
                          <MDBIcon far icon="clock" /> {messageContent.time}
                        </p>
                      </MDBCardHeader>
                      <MDBCardBody>
                        {messageContent.message !== "" ? (<p className="mb-0">
                          {messageContent.message}
                        </p>) : (
                          <p></p>
                        )}
                        {messageContent.url !== "#" ? (
                          <Image src={messageContent.url} thumbnail  style={{ "max-width": "100%", "height": "auto" }} />
                        ) : (
                          <p></p>
                        )}
                      </MDBCardBody>
                    </MDBCard>
                  </li>
                )
              })}
            </MDBTypography>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <MDBTextArea placeholder="wRITE..." id='typeText'
        onChange={(e) => { setCurrentMessage(e.target.value); }}
        onKeyDownCapture={(event) => {
          if (event.key === "Enter" && sendMessage())
            event.target.value = "";
        }}
      />
    </div>
  );
}

export default Chat;



