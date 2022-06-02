import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMicrophone } from "@fortawesome/free-solid-svg-icons"
import { faStop } from "@fortawesome/free-solid-svg-icons"
import "./style.css";
import image from "../voice_line.jpg"

import RecordedVoice from "./RecordedVoice"

export default function AudioRecorder() {
  const [stream, setStream] = useState({
    access: false,
    recorder: null,
    error: null,
  });

  const [recording, setRecording] = useState([]);
  const [device, setDevice] = useState(null);
  
  const chunks = useRef([]);

  useEffect(()=>{
    getAccess()
  },[])

  function getConnectedDevices(type, callback) {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === type);
            callback(filtered);
        });
  }
  
  function getAccess() {
    getConnectedDevices('audioinput', audio => setDevice(audio[0].label));

    navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((mic) => {
      let mediaRecorder;

      try {
        mediaRecorder = new MediaRecorder(mic, {
          mimeType: "audio/webm"
        });
      } catch (err) {
        console.log(err);
      }

      mediaRecorder.onstart = function () {
        setRecording({
          active: true,
          available: false,
          url: ""
        });
      };

      mediaRecorder.ondataavailable = function (e) {
        chunks.current.push(e.data);
      };

      mediaRecorder.onstop = async function () {
        const url = URL.createObjectURL(chunks.current[0]);
        chunks.current = [];

           
      setRecording({
        active: false,
        available: true,
        url
      });
      };

      setStream({
        ...stream,
        access: true,
        recorder: mediaRecorder
      });
      })
      .catch((error) => {
        console.log(error);
        setStream({ ...stream, error });
      });
  }

  function cancel() {
    setRecording({
        active: false,
        available: false,
        url: ""  
    })
  }
  
  function start() {
    return stream.error ? null : stream.recorder.start()
  }
  
  return (
    <div className="wrapper">
        <div className="items">
                <h2 test-id="title">Voice recorder</h2>
                {stream.error &&
                    <h5>Your audio device not found</h5>  
                } 
                {!stream.error && 
                    <h5>Your audio {device} connected</h5>
                }
                {!recording.active ?
                (
                    <button test-id="buttonStart" className="button" onClick={start}>
                        <FontAwesomeIcon icon={faMicrophone} size="4x"/>
                    </button>
                ) :(
                <div>
                    <button test-id="buttonStop" className="button" onClick={() => stream.recorder.stop()}>
                        <FontAwesomeIcon icon={faStop} size="4x"/>
                    </button>
                    <img src={image} className="image" />
                </div>
                )
                }

            </div>    
        {(recording.available && !recording.active) && 
            <div>
                <RecordedVoice url={recording.url} cancel={cancel}/>
            </div>
        }
    </div>
  );
}
