const reloadPageAfterTime = (seconds = 1) => {
	const secToMilliSeconds = seconds * 1000;

	setTimeout(() => {
		window.location.reload();
	}, secToMilliSeconds);
};

export default reloadPageAfterTime;
