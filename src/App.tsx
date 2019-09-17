import React from "react";
import "./App.css";

type step =
	| "initializing"
	| "noNfc"
	| "nfcNotEnabled"
	| "waitingForNfcEnabled"
	| "waitingForTag"
	| "cancelled"
	| "tagRead";

const App: React.FC = () => {
	const [step, setStep] = React.useState<step>("initializing");
	const [tagContent, setTagContent] = React.useState("");

	React.useEffect(() => initializeNfc(), []);

	function initializeNfc() {
		if (typeof nfc !== "undefined") {
			nfc.addNdefListener(
				onNdefEvent,
				() => setStep("waitingForTag"),
				() => setStep("nfcNotEnabled")
			);
		} else {
			setStep("noNfc");
		}
	}

	function onGoToSettingsClick() {
		if (typeof nfc !== "undefined") {
			nfc.showSettings(
				() => setStep("waitingForNfcEnabled"),
				() => alert("An error occurred while trying to open the NFC Settings.")
			);
		}
	}

	function onNdefEvent(e: PhoneGapNfc.TagEvent) {
		nfc.removeNdefListener(onNdefEvent);

		setTagContent(
			ndef.textHelper.decodePayload(
				(e as PhoneGapNfc.NdefTagEvent).tag.ndefMessage[0].payload
			)
		);

		setStep("tagRead");
	}

	function onStopClick() {
		if (typeof nfc !== "undefined") {
			nfc.removeNdefListener(onNdefEvent);
		}

		setStep("cancelled");
	}

	return (
		<div className="nfc">
			{step === "initializing" ? (
				<div className="status">Initializing...</div>
			) : step === "noNfc" ? (
				<div className="status">
					The device you are using doesn't appear to have the NFC feature.
				</div>
			) : step === "nfcNotEnabled" ? (
				<div>
					<div className="status">
						NFC is not enabled on your device. Click the button bellow to open
						your device's settings, then activate NFC.
					</div>
					<button onClick={onGoToSettingsClick}>Go to NFC Settings</button>
				</div>
			) : step === "waitingForNfcEnabled" ? (
				<div>
					<div className="status">
						Please click the button below once you have enabled NFC.
					</div>
					<button onClick={initializeNfc}>Initialize NFC Reader</button>
				</div>
			) : step === "waitingForTag" ? (
				<div>
					<div className="status">Scan a NFC Tag to see its content</div>
					<button onClick={onStopClick}>Stop NFC Reader</button>
				</div>
			) : step === "tagRead" ? (
				<div>
					<div className="status">Tag Content: '{tagContent}'</div>
					<button onClick={onStopClick}>Stop NFC Reader</button>
				</div>
			) : null}
		</div>
	);
};

export default App;
