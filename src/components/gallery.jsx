import React, { useState, useEffect, Component } from "react";
import Modal from "react-modal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
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
console.log(workid);
console.log(woli);
console.log(sa);
console.log(accessToken);
const Gallery = () => {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({
    photoIndex: 0,
    isOpenImage: false,
  });
  const [wo, setWo] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceAppointment, setServiceAppointment] = useState();
  const [ocr1Data, setOcrData] = useState();
  const [gpsLoc, setGpsLoc] = useState("");
  const [photoIndex, setPhotoIndex] = useState();
  const [blobUrls, setBlobUrls] = useState([]);
  const [woLoc, setWoLoc] = useState("");
  const [dateTime, setDateTime] = useState(0);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const capturedDate = "2/10/2021 10:00:04 AM";
  const uploadedBy = "Thomas Anderson";
  const organization = "Lanes";
  const workdIds = wo.map((woId) => {
    const workIdArr = woId.workOrderID;
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
  const lat = users.map((user) => {
    const Lat = user.latitude;
    return Lat;
  });
  const long = users.map((user) => {
    const Long = user.longitude;
    return Long;
  });
  const uploadedDate = users.map((user) => {
    const upldDate = user.dateTime;
    return upldDate;
  });

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
      // mode: "cors",
      // credentials: "include",
      // withCredentials: true,
      headers: {
        Authorization: "Bearer" + " " + accessToken,
        "Content-Type": "application/json",
        // "Access-Control-Allow-Credentials": "true",
        // "Access-Control-Allow-Origin":
        //   "https://faeuwnondevmediastore.azurewebsites.net",
        //   Vary: "Origin",
        // CORS_ORIGIN_ALLOW_ALL: "False",
        // CORS_ORIGIN_WHITELIST: "http://localhost:3000/",
      },
    });
    var users = await response.json();
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

    const grouped = groupBy(users, "workOrderLineItemID").map((item) => ({
      ...item,
      data: groupBy(item.data, "serviceAppointmnetID"),
    }));
    console.log(url);
    console.log(users);
    console.log(grouped);
    setUsers(grouped);
    var wo = users;
    setWo(wo);
  };
  useEffect(() => {
    getSelectedUsers();
  }, []);

  return (
    <>
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
                <h5>WOLI:{woli.workOrderLineItemID}</h5>
                {woli.data.map((sa) => (
                  <li>
                    <h5>Sa No.:{sa.serviceAppointmnetID}</h5>
                    <ol type="1" className="users">
                      {sa.data.map((user) => {
                        const {
                          id,
                          workOrderID,
                          workOrderLineItemID,
                          serviceAppointmnetID,
                          finalImageURL,
                          thumbNailURL,
                          ocrData,
                          longitude,
                          latitude,
                          dateTime,
                          owner,
                          ownerOrganization,
                          imageUploadedDateTime,
                          dateOnImage,
                        } = user;
                        return (
                          <li key={id}>
                            <img
                              className="rotate90"
                              src={thumbNailURL}
                              alt={workOrderID}
                              onClick={() => {
                                setSelectedImage(finalImageURL);
                                setIsModalOpen(true);
                                setOcrData(ocrData);
                                setWoLoc(
                                  longitude + "\xa0\xa0\xa0\xa0\xa0" + latitude
                                );
                                setGpsLoc(
                                  longitude + "\xa0\xa0\xa0\xa0\xa0" + latitude
                                );
                                setDateTime(dateTime);
                                setPhotoIndex(sa.data.indexOf(user));
                                setIsOpenImage(true);
                                setBlobUrls(
                                  sa.data.map((bolb) => {
                                    const urls = bolb.finalImageURL;
                                    return urls;
                                  })
                                );
                              }}
                            />
                            <p style={{ float: "left" }} className="imgInfo">
                              Image No.:&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              {sa.data.indexOf(user) + 1}
                              <br />
                              SA
                              No.:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              {sa.serviceAppointmnetID}
                              <br />
                              Captured Date:&nbsp;&nbsp;{dateOnImage}
                              <br />
                              Gps Loc. : &nbsp;&nbsp;&nbsp;
                              {longitude + "\xa0\xa0\xa0" + latitude}
                              <br />
                              Field User Name:&nbsp;&nbsp;{owner}
                            </p>
                            {isOpenImage && (
                              <Lightbox
                                clickOutsideToClose={false}
                                imageTitle={`SA No. :\u00A0\u00A0${serviceAggrementId[photoIndex]}`}
                                imageCaption={`GPS Loc :\u00A0\u00A0${lat[photoIndex]}\u00A0\u00A0\u00A0\u00A0${long[photoIndex]}\u00A0\u00A0
                           WO Loc :\u00A0\u00A0${lat[photoIndex]}\u00A0\u00A0\u00A0\u00A0${long[photoIndex]}\u00A0\u00A0
                           CapturedDate :\u00A0\u00A0${capturedDate}\u00A0\u00A0
                           UploadedDate :\u00A0\u00A0${uploadedDate[photoIndex]}\u00A0\u00A0
                           Uploaded By :\u00A0\u00A0${uploadedBy}\u00A0\u00A0
                           Organization :\u00A0\u00A0${organization}\u00A0\u00A0`}
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
          {/* <ol type="1" className="users">
            {users.map((user) => {
              const {
                id,
                workOrderID,
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
                    className="rotate90"
                    src={thumbNailURL}
                    alt={workOrderID}
                    onClick={() => {
                      setSelectedImage(blobURL);
                      setIsModalOpen(true);
                      setOcrData(ocrData);
                      setWoLoc(longitude + "\xa0\xa0\xa0\xa0\xa0" + latitude);
                      setGpsLoc(longitude + "\xa0\xa0\xa0\xa0\xa0" + latitude);
                      setDateTime(dateTime);
                      setPhotoIndex(users.indexOf(user));
                      setIsOpenImage(true);
                    }}
                  />
                  <p style={{ float: "left" }} className="imgInfo">
                    Image No.:&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {users.indexOf(user) + 1}
                    <br />
                    SA No.:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{serviceAggrementId[0]}
                    <br />
                    Captured Date:&nbsp;&nbsp;{capturedDate}
                    <br />
                    Gps Loc. : &nbsp;&nbsp;&nbsp;
                    {longitude + "\xa0\xa0\xa0" + latitude}
                    <br />
                    Field User Name:&nbsp;&nbsp;{uploadedBy}
                  </p>
                  {isOpenImage && (
                    <Lightbox
                      clickOutsideToClose={false}
                      imageTitle={`SA No. :\u00A0\u00A0${serviceAggrementId[photoIndex]}`}
                      imageCaption={`GPS Loc :\u00A0\u00A0${lat[photoIndex]}\u00A0\u00A0\u00A0\u00A0${long[photoIndex]}\u00A0\u00A0
                           WO Loc :\u00A0\u00A0${lat[photoIndex]}\u00A0\u00A0\u00A0\u00A0${long[photoIndex]}\u00A0\u00A0
                           CapturedDate :\u00A0\u00A0${capturedDate}\u00A0\u00A0
                           UploadedDate :\u00A0\u00A0${uploadedDate[photoIndex]}\u00A0\u00A0
                           Uploaded By :\u00A0\u00A0${uploadedBy}\u00A0\u00A0
                           Organization :\u00A0\u00A0${organization}\u00A0\u00A0`}
                      mainSrc={blobUrls[photoIndex]}
                      nextSrc={blobUrls[(photoIndex + 1) % blobUrls.length]}
                      prevSrc={
                        blobUrls[
                          (photoIndex + blobUrls.length - 1) % blobUrls.length
                        ]
                      }
                      onCloseRequest={() => setIsOpenImage(false)}
                      onMovePrevRequest={() =>
                        setPhotoIndex(
                          (photoIndex + blobUrls.length - 1) % blobUrls.length
                        )
                      }
                      onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % blobUrls.length)
                      }
                    />
                  )}
                </li>
              );
            })}
          </ol> */}
        </div>
      </section>
    </>
  );
};

export default Gallery;
