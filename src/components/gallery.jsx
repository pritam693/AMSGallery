import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
var url = window.location.href.split("/");
let workid = url[url.length - 1];

const Gallery = () => {
  const [users, setUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceAppointment, setServiceAppointment] = useState();
  const [ocr1Data, setOcrData] = useState();
  const [gpsLoc, setGpsLoc] = useState("");
  const [woLoc, setWoLoc] = useState("");
  const [dateTime, setDateTime] = useState();
  const workdIds = users.map((user) => {
    const workIdArr = user.workId;
    return workIdArr;
  });
  const workLineItemIds = users.map((user) => {
    const workLineItemIdArr = user.workLineItemId;
    return workLineItemIdArr;
  });

  const serviceAggrementId = users.map((user) => {
    const serviceAggrementArr = user.serviceAggrement;
    return serviceAggrementArr;
  });

  const getSelectedUsers = async () => {
    const response = await fetch(
      "https://faeuwnonwfm.azurewebsites.net/api/Search?code=zhCZPmKxWjsYLq26wWoM4dARhaXjcS2MapkxKPSzvLksb82EPnaM/g==&workid=" +
        workid
    );
    var users = await response.json();
    setUsers(users);
  };
  useEffect(() => {
    getSelectedUsers();
  }, []);

  return (
    <>
      <div>
        <div className="imageGrid">
          <h3>
            Service Appointment : {serviceAggrementId[0]} <br></br>
          </h3>
          <h4>
            Work Order:{workdIds[0]}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; WOLI :{" "}
            {workLineItemIds[4]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Service Appointment : {serviceAggrementId[0]}
          </h4>

          <ul className="users">
            {users.map((user) => {
              const {
                id,
                workId,
                workLineItemId,
                blobURL,
                thumbNailURL,
                ocrData,
                longitude,
                latitude,
                dateTime,
              } = user;
              return (
                <li key={id}>
                  <img
                    src={thumbNailURL}
                    alt={workId}
                    onClick={() => {
                      setSelectedImage(blobURL);
                      setIsModalOpen(true);
                      setOcrData(ocrData);
                      setWoLoc(longitude + "\xa0\xa0\xa0\xa0\xa0" + latitude);
                      setGpsLoc(longitude + "\xa0\xa0\xa0\xa0\xa0" + latitude);
                      setDateTime(dateTime);
                    }}
                  />
                  <Modal
                    isOpen={isModalOpen}
                    ariaHideApp={false}
                    closeTimeoutMS={500}
                    onRequestClose={() => setIsModalOpen(false)}
                    overlayClassName="custom-Modal__Overlay"
                    style={{
                      overlay: {
                        position: "fixed",
                        top: 10,
                        left: 95,
                        right: 95,
                        bottom: 30,
                        borderRadius: "10px",
                        backgroundColor: "rgb(34, 32, 32)",
                      },
                      content: {
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        right: "0px",
                        bottom: 0,
                        border: "none",
                        background: "rgb(34, 32, 32)",
                        overflow: "hidden",
                        WebkitOverflowScrolling: "touch",
                        borderRadius: "4px",
                        outline: "none",
                        padding: "20px",
                      },
                    }}
                  >
                    <div className="information">
                      <p>
                        SA No. :&nbsp; {serviceAggrementId[0]}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                      </p>
                      {ocr1Data !== null &&
                        ocr1Data !== undefined &&
                        ocr1Data.length !== 0 && (
                          <p className="OCR">
                            OCR Text: {ocr1Data} <br />
                          </p>
                        )}
                    </div>
                    <p className="image">
                      <img
                        src={selectedImage}
                        alt={workId}
                        className="center"
                      />
                    </p>
                    <div>
                      <p style={{ float: "left" }}>
                        GPS Loc:&nbsp; {gpsLoc}
                        &nbsp;&nbsp;&nbsp;&nbsp; WO Loc:&nbsp; {woLoc}
                        &nbsp;&nbsp;&nbsp;&nbsp;Date:&nbsp;{dateTime}
                      </p>
                      <p className="closebtn">
                        <button
                          className="btnclose"
                          style={{ float: "right" }}
                          onClick={() => {
                            setIsModalOpen(false);
                          }}
                        >
                          Close
                        </button>
                      </p>
                    </div>
                  </Modal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Gallery;
