import React, { useEffect, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { LoggedMenu } from "../component/logged-menu";

export const MeetPage = ({ matches }) => {
  const { id } = useParams();
  //AS OF NOW DOMAIN WOULD BE JITSI'S AS WE ARE STILL USING THIER SERVERS
  const domain = "meet.jit.si";
  let api = {};

  const navigate = useNavigate();

  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (!store.userdata.id) {
      navigate("/login");
    }
  }, []);

  // INTIALISE THE MEET WITH THIS FUNCTION
  const startMeet = useCallback(() => {
    const options = {
      roomName: id,
      width: "100%",
      height: 500,
      configOverwrite: { prejoinPageEnabled: false },
      interfaceConfigOverwrite: {
        // overwrite interface properties if you want
      },
      // VIDEO FRAME WILL BE ADDED HERE
      parentNode: document.querySelector("#jitsi-iframe"),
      userInfo: {
        displayName: store.userdata.name,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    api = new JitsiMeetExternalAPI(domain, options);

    api.addEventListeners({
      readyToClose: handleClose,
      participantLeft: handleParticipantLeft,
      participantJoined: handleParticipantJoined,
      videoConferenceJoined: handleVideoConferenceJoined,
      videoConferenceLeft: handleVideoConferenceLeft,
    });
  }, [api]);

  useEffect(() => {
    if (JitsiMeetExternalAPI) {
      startMeet();
    } else {
      alert("JitsiMeetExternalAPI not loaded");
    }
  }, [startMeet]);

  // ALL OUR HANDLERS
  const handleClose = () => {
    console.log("handleClose");
  };

  const handleParticipantLeft = async (participant) => {
    console.log("handleParticipantLeft", participant);
    await getParticipants();
  };

  const handleParticipantJoined = async (participant) => {
    console.log("handleParticipantJoined", participant);
    await getParticipants();
  };

  const handleVideoConferenceJoined = async (participant) => {
    console.log("handleVideoConferenceJoined", participant);
    await getParticipants();
  };

  const handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    navigate("/myhome");
  };

  // GETTING ALL PARTICIPANTS
  const getParticipants = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.getParticipantsInfo());
      }, 500);
    });
  };

  return (
    <div className="row d-flex justify-content-center">
      <LoggedMenu />
      <React.Fragment>
        <header
          style={{
            backgroundColor: "rgb(10, 25, 41)",
            color: "white",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, padding: 10 }}>Videollamada con Familiar</p>
        </header>
        <div id="jitsi-iframe" style={{ marginBottom: 0 }}></div>
        <div
          style={{
            backgroundColor: "rgb(10, 25, 41)",
            height: "20vh",
            margin: 0,
          }}
        ></div>
      </React.Fragment>
    </div>
  );
};
