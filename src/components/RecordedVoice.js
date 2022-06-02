import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export default function RecordedVoice(props){
  return (
    <div className="audio-bar">
        <audio tets-id="audio" controls src={props.url} />
        <button test-id="buttonCancel" className="cancel" onClick={props.cancel}>
            <FontAwesomeIcon icon={faTrash} size="2x"/>
        </button>

    </div>
  )  
}