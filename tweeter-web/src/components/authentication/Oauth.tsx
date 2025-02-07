import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import useToastListener from "../toaster/ToastListenerHook";

interface Props {
  companyNameCap:string
  companyTooltipId:string
  companyNameLower:string
}

const Oauth = (props:Props) => {
    const { displayInfoMessage } = useToastListener();
    
    const displayInfoMessageWithDarkBackground = (message: string): void => {
        displayInfoMessage(message, 3000, "text-white bg-primary");
      };

    return (
      <>
        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              `${props.companyNameCap} registration is not implemented.`
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={props.companyTooltipId}>{props.companyNameCap}</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", props.companyNameLower as IconName]} />
          </OverlayTrigger>
        </button>
        
        {/* <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "Facebook registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="facebookTooltip">Facebook</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "facebook"]} />
          </OverlayTrigger>
        </button>

        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "Twitter registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="twitterTooltip">Twitter</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "twitter"]} />
          </OverlayTrigger>
        </button>

        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "LinkedIn registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="linkedInTooltip">LinkedIn</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "linkedin"]} />
          </OverlayTrigger>
        </button>

        <button
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              "Github registration is not implemented."
            )
          }
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="githubTooltip">GitHub</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", "github"]} />
          </OverlayTrigger>
        </button> */}
      </>
    )
}

export default Oauth