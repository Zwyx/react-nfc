import React from "react";
import "./App.css";

/** Type for the possible steps of the app */
type TStep =
	| "initializing"
	| "noNfc"
	| "nfcNotEnabled"
	| "waitingForNfcEnabled"
	| "waitingForTag"
	| "cancelled"
	| "tagRead";

const App: React.FC = () => {
	const [step, setStep] = React.useState<TStep>("initializing");
	const [tagContent, setTagContent] = React.useState("");

	// Initialize NFC when the app is started
	React.useEffect(initializeNfc, []);

	function initializeNfc() {
		// If nfc is undefined, NFC is not available on this device, or
		// the app is running in a web browser
		if (typeof nfc !== "undefined") {
			// Register an event listener
			nfc.addNdefListener(
				onNdefEvent, // The callback function for the event listener
				() => setStep("waitingForTag"), // Success → We're waiting for an event
				() => setStep("nfcNotEnabled") // Error → NFC must not be enabled
			);
		} else {
			setStep("noNfc");
		}
	}

	function onGoToSettingsClick() {
		if (typeof nfc !== "undefined") {
			// Ask the device to open the NFC settings for the user
			nfc.showSettings(
				() => setStep("waitingForNfcEnabled"),
				() => alert("An error occurred while trying to open the NFC Settings.")
			);
		}
	}

	function onNdefEvent(e: PhoneGapNfc.TagEvent) {
		// Unregister the event listener
		nfc.removeNdefListener(onNdefEvent);

		setTagContent(
			// Retrieve the payload of the tag and decode it
			// https://www.oreilly.com/library/view/beginning-nfc/9781449324094/ch04.html
			ndef.textHelper.decodePayload(
				(e as PhoneGapNfc.NdefTagEvent).tag.ndefMessage[0].payload
			)
		);

		setStep("tagRead");
	}

	function onStopClick() {
		if (typeof nfc !== "undefined") {
			// Unregister the event listener
			nfc.removeNdefListener(onNdefEvent);
		}

		setStep("cancelled");
	}

	return (
		<div className="nfc">
			{step === "initializing" ? (
				<div>Initializing...</div>
			) : step === "noNfc" ? (
				<div>
					The device you are using doesn't appear to have NFC; or, the
					PhoneGap-NFC plugin hasn't been set up correctly.
				</div>
			) : step === "nfcNotEnabled" ? (
				<div>
					<div>
						NFC is not enabled on your device. Click the button bellow to open
						your device's settings, then activate NFC.
					</div>
					<button onClick={onGoToSettingsClick}>Go to NFC Settings</button>
				</div>
			) : step === "waitingForNfcEnabled" ? (
				<div>
					<div>Please click the button below once you have enabled NFC.</div>
					<button onClick={initializeNfc}>Initialize NFC Reader</button>
				</div>
			) : step === "waitingForTag" ? (
				<div>
					<div>Scan a NFC Tag to see its content</div>
					<button onClick={onStopClick}>Stop NFC Reader</button>
				</div>
			) : step === "tagRead" ? (
				<div>
					<div>Tag scanned! Here it's content:</div>
					<div>{tagContent}</div>
					<button onClick={onStopClick}>Stop NFC Reader</button>
				</div>
			) : (
				<div>
					<div>Bye!</div>
				</div>
			)}
		</div>
	);
};

export default App;
