import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { getProfileData, changePassword } from "../Redux/Slice/ProfileSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Modal, Button } from "react-bootstrap";

const Profile = () => {
  var navigate = useNavigate();

  const dispatch = useDispatch();
  const Profile = useSelector((state) => state.profile.Profile);
  // const Password = useSelector((state)=>state.profile.changePassword)
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("formErrors", formErrors);
  console.log("Profile", Profile);
  //webcam
  const webcamRef = useRef(null);
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const openWebcamModal = () => setShowWebcamModal(true);
  const closeWebcamModal = () => setShowWebcamModal(false);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    closeWebcamModal();
  };

  const initialValues = {
    firstName: Profile.firstname,
    lastname: Profile?.lastname,
    address: Profile?.address,
    email: Profile?.email,
    phoneNo: Profile?.phoneNumber,
    imageUrl: null,
  };
  const validate = (admin) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!admin.firstName) {
      errors.firstName = "Firstname cannot be blank";
    }
    if (!admin.lastname) {
      errors.lastname = "Lastname cannot be blank";
    }
    if (!admin.address) {
      errors.address = "Address cannot be blank";
    }
    if (!admin.email) {
      errors.email = "Email cannot be blank";
    } else if (!regex.test(admin.email)) {
      errors.email = "Invalid email format";
    }
    if (!admin.phoneNo) {
      errors.phoneNo = "Phone number cannot be blank";
    } else if (admin.phoneNo.length > 10) {
      errors.phoneNo = "Mobile number not valid";
    }

    return errors;
  };

  const changePassValue = {
    email: "",
    currentPassword: "",
    newPassword: "",
  };

  const [admin, setAdmin] = useState();
  const [password, setPassword] = useState(changePassValue);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setAdmin({
      ...admin,
      [name]: value,
    });
  };

  const handleChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  useEffect(() => {
    dispatch(getProfileData());
  }, []);

  useEffect(() => {
    setAdmin(initialValues);
    setPassword(changePassValue);
  }, [Profile]);

  const updateProfile = (e) => {
    e.preventDefault();

    const data = {
      method: "PUT",
      body: JSON.stringify({
        firstname: admin.firstName,
        lastname: admin.lastname,
        email: admin.email,
        phoneNumber: admin.phoneNo,
        address: admin.address,
        image: null,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };

    //  console.log("body",data)

    fetch(`http://65.20.73.28:8090//api/admins`, data)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setAdmin(initialValues);
        toast.success(data.message);
      })
      .catch((err) => console.log(err));
  };

  const getChangePassword = async () => {
    const data = {
      method: "POST",
      body: JSON.stringify({
        email: password.email,
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };

    // dispatch(changePassword(data))

    fetch("http://65.20.73.28:8090//api/admins/changepassword", data)
      .then((response) => response.json())
      .then((data) => {
        setPassword({});
        console.log("changepassword", data);
        if (data?.status === true) {
          setPassword(changePassValue);
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(admin));

    if (Object.keys(formErrors).length == 0) {
      navigate("/profile");
    }
  };

  return (
    <>
      {/* begin::main  */}
      <div
        id="main"
        // style={{ position: "absolute", top: "0px", left: "250px" }}
      >
        {/* begin::main-content  */}

        <main className="main-content ">
          <div className="container mt-5">
            <ToastContainer />
            <div className="row">
              <div className="col-md-4">
                <div className="card ">
                  <div className="text-center mt-3">
                    <figure className="avatar avatar-lg m-b-20">
                      <img
                        src="https://via.placeholder.com/128X128"
                        className="rounded-circle"
                        alt="..."
                      />
                    </figure>
                    <h5 className="mb-1">Zeeshaan Pathan</h5>
                    <p className="text-muted small">Web Developer</p>
                  </div>
                  <div className="card-body mr-5 ">
                    <div className="row mb-2 ">
                      <div className="col-6 text-muted text-left ">
                        First Name:
                      </div>
                      <div className="col-6 text-left">
                        {Profile?.firstname}
                      </div>
                    </div>
                    <div className="row mb-2 ">
                      <div className="col-6 text-muted text-left">
                        Last Name:
                      </div>
                      <div className="col-6 text-left">{Profile?.lastname}</div>
                    </div>
                    <div className="row mb-2 ">
                      <div className=" col-5 text-muted text-left">
                        Address:
                      </div>
                      <div className="col-6 text-left ">{Profile?.address}</div>
                    </div>
                    <div className="row mb-2 ">
                      <div className="col-5 text-muted text-left">Phone:</div>
                      <div className="col-6 text-left">
                        {Profile?.phoneNumber}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 text-muted text-left">Email:</div>
                      <div className="col-6 text-left">{Profile?.email}</div>
                    </div>
                  </div>
                  <hr className="m-0" />
                </div>

                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title d-flex justify-content-between align-items-center">
                      Change Password
                    </h6>
                    <div className="form-group mb-2">
                      <label for="email">Email</label>
                      <span className="text-danger">*</span>
                      <input
                        type="text"
                        className="form-control"
                        id="old_password"
                        name="email"
                        value={password.email}
                        onChange={(e) => handleChangePasswordInput(e)}
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label for="password">Current Password</label>
                      <span className="text-danger">*</span>
                      <input
                        type="password"
                        className="form-control"
                        name="currentPassword"
                        value={password.currentPassword}
                        onChange={(e) => handleChangePasswordInput(e)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label for="confirm_password">New Password</label>
                      <span className="text-danger">*</span>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        value={password.newPassword}
                        onChange={(e) => handleChangePasswordInput(e)}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      type="submit"
                      onClick={() => getChangePassword()}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <form className="needs-validation" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label for="validationCustom01">First name</label>
                          <span className="text-danger">*</span>
                          <input
                            type="text"
                            className={`form-control ${
                              formErrors.firstName ? "is-invalid" : ""
                            }`}
                            placeholder="First name"
                            name="firstName"
                            value={admin?.firstName}
                            onChange={(e) => handleInputChange(e)}
                          />
                          {formErrors.firstName && (
                            <div className="invalid-feedback">
                              {formErrors.firstName}
                            </div>
                          )}

                          <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label for="validationCustom02">Last name</label>
                          <span className="text-danger">*</span>
                          <input
                            type="text"
                            className={`form-control ${
                              formErrors.lastName ? "is-invalid" : ""
                            }`}
                            placeholder="Last name"
                            name="lastName"
                            value={admin?.lastName}
                            onChange={(e) => handleInputChange(e)}
                          />
                          {formErrors.lastName && (
                            <div className="invalid-feedback">
                              {formErrors.lastName}
                            </div>
                          )}
                          <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label for="validationCustom03">Email</label>
                          <span className="text-danger">*</span>
                          <input
                            type="text"
                            className={`form-control ${
                              formErrors.email ? "is-invalid" : ""
                            }`}
                            placeholder="Email Id"
                            name="email"
                            value={admin?.email}
                            onChange={(e) => handleInputChange(e)}
                          />
                          {formErrors.email && (
                            <div className="invalid-feedback">
                              {formErrors.email}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label for="validationCustom04">Phone Number</label>
                          <span className="text-danger">*</span>
                          <input
                            type="number"
                            className={`form-control ${
                              formErrors.phoneNo ? "is-invalid" : ""
                            }`}
                            placeholder="Phone Number"
                            name="phoneNo"
                            value={admin?.phoneNo}
                            onChange={(e) => handleInputChange(e)}
                          />
                          {formErrors.firstName && (
                            <div className="invalid-feedback">
                              {formErrors.phoneNo}
                            </div>
                          )}
                        </div>
                        <div className="form-group col-md-12">
                          <label for="exampleFormControlTextarea1">
                            Address
                          </label>
                          <span className="text-danger">*</span>
                          <textarea
                            className={`form-control ${
                              formErrors.address ? "is-invalid" : ""
                            }`}
                            id="exampleFormControlTextarea1"
                            name="address"
                            value={admin?.address}
                            onChange={(e) => handleInputChange(e)}
                            rows="5"
                          ></textarea>
                          {formErrors.address && (
                            <div className="invalid-feedback">
                              {formErrors.address}
                            </div>
                          )}
                        </div>
                        <div className="form-group col-md-5 mt-3">
                          <label for="exampleFormControlFile1">Image</label>
                          <input
                            type="file"
                            name="Image"
                            className="form-control-file"
                            id="exampleFormControlFile1"
                          />
                          {formErrors.image && (
                            <div className="invalid-feedback">
                              {formErrors.image}
                            </div>
                          )}
                        </div>
                        <div className="col-md-4 mt-3">
                          {" "}
                          <figure
                            className="avatar avatar-sm m-r-15"
                            style={{ width: "100px", height: "100px" }}
                          >
                            <img
                              src="https://via.placeholder.com/128X128"
                              className="rounded-circle"
                              alt="user"
                              width="100%"
                              height="100%"
                            />
                          </figure>

                        </div>
                        <div className="col-md-3 mt-3">
                          <button variant="primary"
                          className="btn btn-primary  mt-4" onClick={openWebcamModal}>
                            Open Webcam
                          </button>
                          <Modal
                            show={showWebcamModal}
                            onHide={closeWebcamModal}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Webcam Image Upload</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                              />
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={closeWebcamModal}
                              >
                                Close
                              </Button>
                              <Button variant="primary" onClick={captureImage}>
                                Capture Image
                              </Button>
                            </Modal.Footer>
                          </Modal>
                          {capturedImage && (
                            <div>
                              <h2>Captured Image</h2>
                              <img src={capturedImage} alt="Captured" />
                            </div>
                          )}
                        </div>
                      
                        
                      </div>
                      <button
                        className="btn btn-primary float-right mt-4"
                        type="submit"
                        onClick={(e) => updateProfile(e)}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* end::main-content  */}
      </div>
      {/* end::main  */}
    </>
  );
};

export default Profile;
