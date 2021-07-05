import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Link from "next/link";
var history = window.history;
let params = new URLSearchParams(window.location.search);
let workid = params.get("WorkOrderID");
let woli = params.get("WorkOrderLineItemID");
let sa = params.get("ServiceAppointmentID");
let accessToken = params.get("AccessToken");

if (history.replaceState) history.replaceState({}, "", "/");
const Gallery = () => {
  const [users, setUsers] = useState([]);
  const [wo, setWo] = useState([]);
  const [serviceAppointment, setServiceAppointment] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [photoIndex, setPhotoIndex] = useState();
  const [blobUrls, setBlobUrls] = useState([]);
  const [dateTime, setDateTime] = useState([]);
  const [ocrData, setOcrData] = useState([]);
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [capturedDate, setCapturedDate] = useState([]);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [uploadedBy, setUploadedBy] = useState([]);
  const [organization, setOrganization] = useState([]);

  const workdIds = wo.map((woId) => {
    return woId.workOrderID;
  });

  const onClose = () => {
    window.opener = null;
    window.open("", "_self");
    window.close();
  };

  const getSelectedUsers = async () => {
    var url = `https://faeuwnondevmediastore.azurewebsites.net/api/Search?WorkOrderID=${workid}&WorkOrderLineItemID=${woli}&ServiceAppointmnetID=${sa}`;
    if (sa == null) {
      url = `https://faeuwnondevmediastore.azurewebsites.net/api/Search?WorkOrderID=${workid}&WorkOrderLineItemID=${woli}`;
    }
    if (sa == null && woli == null) {
      url = `https://faeuwnondevmediastore.azurewebsites.net/api/Search?WorkOrderID=${workid}`;
    }
    const response = await fetch(url, {
      method: "get",
      headers: {
        Authorization: "Bearer" + " " + accessToken,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      var Users = await response.json();
      function groupBy(arr, prop) {
        return Object.values(
          arr.reduce((aggregate, item) => {
            const val = item[prop];
            if (!aggregate[val]) {
              aggregate[val] = {
                [prop]: val,
                data: [],
              };
            }
            aggregate[val].data.push(item);
            return aggregate;
          }, {})
        );
      }

      const grouped = groupBy(Users, "workOrderLineItemID").map((item) => ({
        ...item,
        data: groupBy(item.data, "serviceAppointmnetID"),
      }));
      setUsers(grouped);
      var WO = Users;
      setWo(WO);
    } else {
      setErrorMessage(
        "Your request has failed. Sorry for the incovenience. Please try again. Thank you !!!"
      );
    }
  };
  useEffect(() => {
    getSelectedUsers();
  }, []);
  return (
    <>
      {errorMessage !== "" ? (
        <section>
          <div className="errMsg">
            <h3 className="error"> {errorMessage} </h3>
            <button className="btnclosewind clswindow" onClick={onClose}>
              Close Window
            </button>
          </div>
        </section>
      ) : (
        <section>
          <div className="imageGrid">
            <div className="topInformation">
              <h3>
                Work Order&nbsp;:&nbsp;&nbsp;{workdIds[0]}
                <br></br>
              </h3>
            </div>
            <li className="woli">
              {users.map((woli) => (
                <li>
                  <h5 className="workLine">
                    WOLI&nbsp;:&nbsp;&nbsp;&nbsp;{woli.workOrderLineItemID}
                  </h5>
                  <p></p>
                  {woli.data.map((sa) => (
                    <li>
                      <h6 className="sa">
                        SA No.&nbsp;:&nbsp;&nbsp;&nbsp;{sa.serviceAppointmnetID}
                      </h6>
                      <ol type="1" className="users">
                        {sa.data.map((user) => {
                          const {
                            id,
                            workOrderID,
                            finalImageURL,
                            longitude,
                            latitude,
                            owner,
                            dateOnImage,
                          } = user;
                          return (
                            <li key={id}>
                              <img
                                src={finalImageURL}
                                alt={workOrderID}
                                onClick={() => {
                                  setOcrData(
                                    sa.data.map((blob) => {
                                      return blob.ocrData;
                                    })
                                  );
                                  setServiceAppointment(
                                    sa.data.map((bolb) => {
                                      return bolb.serviceAppointmnetID;
                                    })
                                  );
                                  setCapturedDate(
                                    sa.data.map((bolb) => {
                                      return bolb.dateOnImage;
                                    })
                                  );
                                  setDateTime(
                                    sa.data.map((bolb) => {
                                      return bolb.imageUploadedDateTime;
                                    })
                                  );
                                  setLat(
                                    sa.data.map((bolb) => {
                                      return bolb.latitude;
                                    })
                                  );
                                  setUploadedBy(
                                    sa.data.map((bolb) => {
                                      return bolb.owner;
                                    })
                                  );
                                  setOrganization(
                                    sa.data.map((bolb) => {
                                      return bolb.ownerOrganization;
                                    })
                                  );
                                  setLong(
                                    sa.data.map((bolb) => {
                                      return bolb.longitude;
                                    })
                                  );
                                  setPhotoIndex(sa.data.indexOf(user));
                                  setIsOpenImage(true);
                                  setBlobUrls(
                                    sa.data.map((bolb) => {
                                      return bolb.finalImageURL;
                                    })
                                  );
                                }}
                              />

                              <p style={{ float: "left" }} className="imgInfo">
                                <b>Image No.:</b>&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {sa.data.indexOf(user) + 1}
                                <br />
                                <b>SA No.:</b>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {sa.serviceAppointmnetID}
                                <br />
                                <b>Captured Date:</b>&nbsp;&nbsp;
                                {dateOnImage}
                                <br />
                                <b>Gps Loc. :</b> &nbsp;&nbsp;&nbsp;
                                {(longitude == null
                                  ? "0.00"
                                  : longitude.toFixed(8)) +
                                  "\xa0\xa0\xa0" +
                                  (latitude == null
                                    ? "0.00"
                                    : latitude.toFixed(8))}
                                <br />
                                <b>Field User Name:</b>&nbsp;&nbsp;{owner}
                              </p>
                              {isOpenImage && (
                                <Lightbox
                                  clickOutsideToClose={false}
                                  imageTitle={`SA No. :\u00A0\u00A0${serviceAppointment[photoIndex]}`}
                                  imageCaption={`GPS Loc :\u00A0\u00A0${
                                    lat[photoIndex] +
                                    "\xa0\xa0\xa0\xa0\xa0" +
                                    long[photoIndex]
                                  }\u00A0\u00A0
                           WO Loc :\u00A0\u00A0${
                             lat[photoIndex] +
                             "\xa0\xa0\xa0\xa0\xa0" +
                             long[photoIndex]
                           }\u00A0\u00A0
                           CapturedDate :\u00A0\u00A0${
                             capturedDate[photoIndex]
                           }\u00A0\u00A0
                           UploadedDate :\u00A0\u00A0${
                             dateTime[photoIndex]
                           }\u00A0\u00A0
                           Uploaded By :\u00A0\u00A0${
                             uploadedBy[photoIndex]
                           }\u00A0\u00A0
                           Organization :\u00A0\u00A0${
                             organization[photoIndex]
                           }\u00A0\u00A0
                           OCR Data :\u00A0\u00A0${
                             ocrData[photoIndex]
                           }\u00A0\u00A0`}
                                  mainSrc={blobUrls[photoIndex]}
                                  nextSrc={
                                    blobUrls[(photoIndex + 1) % blobUrls.length]
                                  }
                                  prevSrc={
                                    blobUrls[
                                      (photoIndex + blobUrls.length - 1) %
                                        blobUrls.length
                                    ]
                                  }
                                  onCloseRequest={() => setIsOpenImage(false)}
                                  onMovePrevRequest={() =>
                                    setPhotoIndex(
                                      (photoIndex + blobUrls.length - 1) %
                                        blobUrls.length
                                    )
                                  }
                                  onMoveNextRequest={() =>
                                    setPhotoIndex(
                                      (photoIndex + 1) % blobUrls.length
                                    )
                                  }
                                />
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </li>
                  ))}
                </li>
              ))}
            </li>
          </div>
        </section>
      )}
    </>
  );
};

export default Gallery;
