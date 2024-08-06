const redirectAfterTime = (redirectUrl, seconds = 1) => {
	const secToMilliSeconds = seconds * 1000;

	setTimeout(() => {
		window.location.href = redirectUrl;
	}, secToMilliSeconds);
};

export default redirectAfterTime;
